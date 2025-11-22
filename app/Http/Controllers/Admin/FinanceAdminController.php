<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Carbon;

class FinanceAdminController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $range = (int) ($request->query('range', 30));
        if (!in_array($range, [7, 30, 90], true)) {
            $range = 30;
        }
        $since = Carbon::now()->subDays($range);

        // Revenue by day (last 30 days)
        $days = collect(range($range - 1, 0))->map(function ($daysAgo) {
            return Carbon::today()->subDays($daysAgo)->format('Y-m-d');
        });

        $revenueByDayRaw = Order::selectRaw('DATE(created_at) as date, SUM(amount) as total_amount')
            ->where('created_at', '>=', $since)
            ->where('status', 'paid')
            ->groupBy('date')
            ->pluck('total_amount', 'date');

        $ordersByDayRaw = Order::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $since)
            ->groupBy('date')
            ->pluck('count', 'date');

        $chartData = $days->map(function ($date) use ($revenueByDayRaw, $ordersByDayRaw) {
            $amountCents = (int) ($revenueByDayRaw[$date] ?? 0);
            return [
                'date' => $date,
                'revenue' => $amountCents / 100,
                'orders' => (int) ($ordersByDayRaw[$date] ?? 0),
            ];
        });

        // Totals
        $totalRevenueCents = (int) Order::where('status', 'paid')->sum('amount');
        $revenueCentsRange = (int) Order::where('created_at', '>=', $since)->where('status', 'paid')->sum('amount');
        $ordersCountRange = (int) Order::where('created_at', '>=', $since)->count();

        $statusCounts = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $topProducts = Order::selectRaw('product_id, COUNT(*) as orders_count, SUM(amount) as revenue_cents')
            ->where('status', 'paid')
            ->groupBy('product_id')
            ->orderByDesc('revenue_cents')
            ->with(['product:id,name'])
            ->take(5)->get();

        $recentOrders = Order::with(['user:id,name,email', 'product:id,name'])
            ->latest()->take(10)
            ->get(['id', 'user_id', 'product_id', 'status', 'amount', 'created_at']);

        return Inertia::render('admin/finance', [
            'chartData' => $chartData,
            'totals' => [
                'revenue_cents_total' => $totalRevenueCents,
                'revenue_cents_range' => $revenueCentsRange,
                'orders_range' => $ordersCountRange,
            ],
            'statusCounts' => $statusCounts,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'filters' => [ 'range' => $range ],
        ]);
    }
}
