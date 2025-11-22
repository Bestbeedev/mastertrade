<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()->select(['id', 'name', 'sku', 'version', 'category', 'description', 'features'])->limit(20)->get();
        return response()->json($products);
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
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'version' => ['required', 'string', 'max:255'],
            'download_url' => ['nullable', 'url', 'max:2048'],
            'checksum' => ['nullable', 'string', 'max:255'],
            'size' => ['required', 'integer', 'min:0'],
            'changelog' => ['nullable', 'string'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'requires_license' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (empty($data['checksum'])) {
            $data['checksum'] = hash('sha256', ($data['name'] ?? '') . '@' . ($data['version'] ?? ''));
        }

        // Normalize pricing fields
        $priceValue = (float) ($data['price'] ?? 0);
        unset($data['price']);
        $data['price_cents'] = (int) round($priceValue * 100);
        $data['requires_license'] = (bool) ($data['requires_license'] ?? false);
        $data['is_active'] = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : true;

        Product::create($data);

        return back()->with('status', 'Produit créé');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($product->id),
            ],
            'version' => ['required', 'string', 'max:255'],
            'download_url' => ['nullable', 'url', 'max:2048'],
            'checksum' => ['nullable', 'string', 'max:255'],
            'size' => ['required', 'integer', 'min:0'],
            'changelog' => ['nullable', 'string'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'requires_license' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (empty($data['checksum'])) {
            $data['checksum'] = hash('sha256', ($data['name'] ?? '') . '@' . ($data['version'] ?? ''));
        }

        // Normalize pricing fields
        $priceValue = (float) ($data['price'] ?? ($product->price_cents ?? 0) / 100);
        unset($data['price']);
        $data['price_cents'] = (int) round($priceValue * 100);
        $data['requires_license'] = (bool) ($data['requires_license'] ?? false);
        $data['is_active'] = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : (bool) ($product->is_active ?? true);

        $product->update($data);

        return back()->with('status', 'Produit mis à jour');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('status', 'Produit supprimé');
    }
}
