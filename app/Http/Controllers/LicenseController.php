<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\License;
use App\Models\Product;
use Inertia\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class LicenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $licenses = License::with(['product:id,name,version'])
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($l) {
                return [
                    'id' => $l->id,
                    'product' => [
                        'name' => optional($l->product)->name,
                        'version' => optional($l->product)->version,
                    ],
                    'key' => $l->key,
                    'type' => $l->type,
                    'seats' => (int) ($l->max_activations ?? 1),
                    'usedSeats' => (int) ($l->activations_count ?? 0),
                    'expires' => $l->expiry_date ? (string) $l->expiry_date : null,
                    'status' => $l->status,
                ];
            });

        return Inertia::render('client/license', [
            'licenses' => $licenses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('client/license');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return back()->with('status', 'created');
    }

    /**
     * Display the specified resource.
     */
    public function show(License $license)
    {
        return Inertia::render('client/license', [
            'license' => $license,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(License $license)
    {
        return Inertia::render('client/license', [
            'license' => $license,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, License $license)
    {
        return back()->with('status', 'updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(License $license)
    {
        return back()->with('status', 'deleted');
    }

    public function renew(License $license)
    {
        return back()->with('status', 'renewed');
    }

    public function extend(License $license)
    {
        return back()->with('status', 'extended');
    }

    public function certificate(License $license)
    {
        return response()->json(['certificate_url' => '#']);
    }

    /**
     * Validate a license key (API stub).
     */
    public function validateKey(Request $request)
    {
        $key = (string) $request->input('key');
        $productId = $request->input('product_id');
        $productSlug = $request->input('product');
        $productSku = $request->input('sku');
        $deviceId = $request->input('device_id');

        $product = null;
        if ($productId) {
            $product = Product::find($productId);
        } elseif ($productSlug) {
            $product = Product::where('slug', $productSlug)->first();
        } elseif ($productSku) {
            $product = Product::where('sku', $productSku)->first();
        }

        if (!$product || !$key) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid request',
            ], 400);
        }

        $license = License::where('key', $key)
            ->where('product_id', $product->id)
            ->where('status', 'active')
            ->first();

        $now = Carbon::now();
        $expiresAt = $license?->expiry_date ? Carbon::parse($license->expiry_date) : null;
        $isValid = $license && $expiresAt && $expiresAt->isFuture();
        $daysLeft = $expiresAt ? $now->diffInDays($expiresAt, false) : null;

        return response()->json([
            'valid' => (bool) $isValid,
            'license_key' => $key,
            'product_id' => $product->id,
            'status' => $license?->status,
            'expires_at' => $expiresAt?->toIso8601String(),
            'days_left' => $daysLeft,
            'message' => $isValid ? 'Valid license' : 'Invalid or expired license',
        ]);
    }

    /**
     * Start activation flow. If user already has an active license for the product, show it; otherwise, go to checkout.
     */
    public function activationStart(Request $request)
    {
        $productId = $request->input('product_id');
        $productSlug = $request->input('product');
        $productSku = $request->input('sku');
        $deviceId = $request->input('device_id');
        $machine = $request->input('machine');

        $product = null;
        if ($productId) {
            $product = Product::find($productId);
        } elseif ($productSlug) {
            $product = Product::where('slug', $productSlug)->first();
        } elseif ($productSku) {
            $product = Product::where('sku', $productSku)->first();
        }

        if (!$product) {
            return redirect()->route('home')->with('error', 'Produit introuvable');
        }

        $user = $request->user();
        $license = License::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->where('status', 'active')
            ->where('expiry_date', '>', Carbon::now())
            ->first();

        if ($license) {
            return Inertia::render('client/license-activate', [
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name ?? 'Produit',
                ],
                'license' => [
                    'id' => $license->id,
                    'key' => $license->key,
                    'expires_at' => (string) $license->expiry_date,
                    'status' => $license->status,
                ],
                'device_id' => $deviceId,
                'machine' => $machine,
            ]);
        }

        return Inertia::render('client/license-checkout', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name ?? 'Produit',
            ],
            'device_id' => $deviceId,
            'machine' => $machine,
        ]);
    }

    /**
     * Simulate checkout and create a license for the user.
     */
    public function activationCheckout(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'integer'],
        ]);
        $user = $request->user();
        $product = Product::find($request->integer('product_id'));
        if (!$product) {
            return back()->withErrors(['product_id' => 'Produit introuvable']);
        }

        $license = new License();
        $license->user_id = $user->id;
        $license->product_id = $product->id;
        $license->status = 'active';
        $license->type = 'Standard';
        $license->expiry_date = Carbon::now()->addYear();
        $license->max_activations = 3;
        $license->activations_count = 0;
        $license->key = $this->generateLicenseKey();
        $license->save();

        return redirect()->route('licenses.activation.complete', ['license' => $license->id]);
    }

    /**
     * Show activation completion with license details.
     */
    public function activationComplete(License $license)
    {
        $product = $license->product()->select('id', 'name')->first();
        return Inertia::render('client/license-activate', [
            'product' => $product,
            'license' => [
                'id' => $license->id,
                'key' => $license->key,
                'expires_at' => (string) $license->expiry_date,
                'status' => $license->status,
            ],
            'completed' => true,
        ]);
    }

    protected function generateLicenseKey(int $segments = 5, int $length = 4): string
    {
        $parts = [];
        for ($i = 0; $i < $segments; $i++) {
            $parts[] = strtoupper(Str::random($length));
        }
        return implode('-', $parts);
    }
}
