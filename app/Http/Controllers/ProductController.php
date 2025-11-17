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
        $products = Product::query()->select(['id', 'name', 'sku', 'version', 'category', 'description'])->limit(20)->get();
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
        ]);

        if (empty($data['checksum'])) {
            $data['checksum'] = hash('sha256', ($data['name'] ?? '') . '@' . ($data['version'] ?? ''));
        }

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
        ]);

        if (empty($data['checksum'])) {
            $data['checksum'] = hash('sha256', ($data['name'] ?? '') . '@' . ($data['version'] ?? ''));
        }

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
