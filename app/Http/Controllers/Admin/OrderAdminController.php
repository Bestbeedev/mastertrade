<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class OrderAdminController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $query = Order::with(['product:id,name', 'user:id,name,email'])
            ->select(['id', 'user_id', 'product_id', 'status', 'amount', 'created_at']);
        if ($status) {
            $query->where('status', $status);
        }
        $orders = $query->latest()->paginate(50)->withQueryString();

        $statusCounts = Order::selectRaw("status, COUNT(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'statusCounts' => $statusCounts,
            'filters' => ['status' => $status],
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,paid,failed,refunded'],
            'amount' => ['nullable', 'numeric', 'min:0'],
        ]);
        if (array_key_exists('amount', $data)) {
            $order->amount = $data['amount'];
        }
        $order->status = $data['status'];
        $order->save();
        return back()->with('status', 'Commande mise à jour');
    }

    public function show(Order $order)
    {
        $order->loadMissing(['user:id,name,email', 'product:id,name,download_url']);
        return Inertia::render('admin/order-show', [
            'order' => $order,
        ]);
    }

    public function exportCsv(Request $request)
    {
        $status = $request->query('status');
        $query = Order::with(['product:id,name', 'user:id,name,email'])
            ->select(['id', 'user_id', 'product_id', 'status', 'amount', 'created_at']);
        if ($status) {
            $query->where('status', $status);
        }
        $orders = $query->latest()->get();

        $rows = [];
        $rows[] = ['id', 'client', 'email', 'produit', 'montant_cents', 'statut', 'date'];
        foreach ($orders as $o) {
            $rows[] = [
                (string) $o->id,
                (string) optional($o->user)->name,
                (string) optional($o->user)->email,
                (string) optional($o->product)->name,
                (string) ($o->amount ?? 0),
                (string) $o->status,
                (string) optional($o->created_at)->toDateTimeString(),
            ];
        }

        $csv = '';
        foreach ($rows as $row) {
            $csv .= implode(',', array_map(function ($v) {
                $v = str_replace('"', '""', $v);
                return '"' . $v . '"';
            }, $row)) . "\n";
        }

        $filename = 'orders-' . now()->format('Ymd-His') . '.csv';
        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
