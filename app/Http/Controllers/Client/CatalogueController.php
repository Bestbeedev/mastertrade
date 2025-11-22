<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\License;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CatalogueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()
            ->select(['id', 'name', 'sku', 'version', 'description', 'category', 'features', 'price_cents', 'requires_license', 'is_active'])
            ->orderBy('name')
            ->get();
        return Inertia::render('client/catalogue', [
            'products' => $products,
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
    public function show(Product $product)
    {
        $user = Auth::user();
        $hasActiveLicense = false;
        $hasPaidOrder = false;
        if ($user) {
            $hasActiveLicense = License::where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->where('status', 'active')
                ->where(function ($q) {
                    $q->whereNull('expiry_date')->orWhere('expiry_date', '>', now());
                })
                ->exists();
            $hasPaidOrder = Order::where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->where('status', 'paid')
                ->exists();
        }

        $isActive = (bool) ($product->is_active ?? true);
        $requires = (bool) ($product->requires_license ?? false);
        $isPaid = (int) ($product->price_cents ?? 0) > 0;
        $canDownload = $isActive && (
            ($requires && $hasActiveLicense)
            || (!$requires && $isPaid && $hasPaidOrder)
            || (!$requires && !$isPaid)
        );

        return Inertia::render('client/product', [
            'product' => $product,
            'canDownload' => $canDownload,
            'hasActiveLicense' => $hasActiveLicense,
            'hasPaidOrder' => $hasPaidOrder,
        ]);
    }

    /**
     * Simulated purchase: create a paid order and issue a license if required.
     */
    public function purchase(Request $request, Product $product)
    {
        $user = $request->user();
        abort_unless($user, 403);

        // If already eligible, redirect back
        $hasActiveLicense = License::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>', now());
            })
            ->exists();
        $hasPaidOrder = Order::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->where('status', 'paid')
            ->exists();
        if ($hasActiveLicense || $hasPaidOrder) {
            return back()->with('status', 'Achat déjà effectué.');
        }

        // Create simulated order
        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'paid',
            'amount' => (int) ($product->price_cents ?? 0),
            'payment_method' => 'simulation',
            'payment_id' => Str::uuid()->toString(),
        ]);

        // Issue license if required
        if ($product->requires_license) {
            License::create([
                'key' => strtoupper(Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4)),
                'product_id' => $product->id,
                'user_id' => $user->id,
                'status' => 'active',
                'type' => 'permanent',
                'expiry_date' => null,
                'max_activations' => 3,
                'activations_count' => 0,
            ]);
        }

        return redirect()->route('orders.show', $order->id)->with('status', 'Paiement simulé réussi.');
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
}
