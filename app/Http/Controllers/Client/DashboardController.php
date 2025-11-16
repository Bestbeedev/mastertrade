<?php

namespace App\Http\Controllers\Client;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\License;
use App\Models\Order;
use App\Models\Download;
use App\Models\Ticket;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user()->load('role');
        $authUser = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role_id' => $user->role_id,
            'country' => $user->country,
            'phone' => $user->phone,
            'role' => $user->role ? ['id' => $user->role->id, 'name' => $user->role->name] : null,
        ];

        // Real stats where available
        $userId = $user->id;
        $activeLicenses = License::where('user_id', $userId)->where('status', 'active')->count();
        $expiredLicenses = License::where('user_id', $userId)->where('status', 'expired')->count();
        $totalOrders = Order::where('user_id', $userId)->count();
        $totalDownloads = Download::where('user_id', $userId)->count();
        $pendingRenewals = License::where('user_id', $userId)
            ->where('status', 'active')
            ->whereDate('expiry_date', '>=', Carbon::today())
            ->whereDate('expiry_date', '<=', Carbon::today()->addDays(30))
            ->count();
        $supportTickets = Ticket::where('user_id', $userId)->count();

        $dashboardStats = [
            'activeLicenses' => $activeLicenses,
            'totalOrders' => $totalOrders,
            'totalDownloads' => $totalDownloads,
            'activeCourses' => 0, // keep 0 until implemented
            'pendingRenewals' => $pendingRenewals,
            'supportTickets' => $supportTickets,
            'licenseStatus' => [
                'active' => $activeLicenses,
                'expired' => $expiredLicenses,
                'trial' => 0,
            ],
            'recentActivity' => [], // keep empty for now
        ];

        // Active software list from licenses + products
        $activeSoftware = License::with(['product:id,name,version,category'])
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->orderBy('expiry_date')
            ->take(6)
            ->get()
            ->map(function ($lic) {
                return [
                    'id' => $lic->id,
                    'name' => $lic->product->name ?? 'Produit',
                    'version' => $lic->product?->version ? 'v' . $lic->product->version : null,
                    'status' => 'active',
                    'expiry' => $lic->expiry_date ? Carbon::parse($lic->expiry_date)->toDateString() : null,
                    'category' => $lic->product->category ?? null,
                ];
            });

        return Inertia::render('dashboard', [
            'user_data' => $authUser,
            'dashboardStats' => $dashboardStats,
            'activeSoftware' => $activeSoftware,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    /// Passe le user connecté à la vue Inertia
    public function getCurrentUser()
    {
        return Inertia::render('Dashboard', [
            'auth_user' => Auth::user(),
        ]);
    }
}
