<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['product:id,name,download_url'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get(['id', 'product_id', 'status', 'amount', 'created_at']);

        return Inertia::render('client/commande', [
            'orders' => $orders,
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
    public function show(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        $order->loadMissing(['product:id,name,download_url,version']);
        return Inertia::render('client/order', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }

    /**
     * Generate and download the invoice PDF for an order.
     */
    public function invoice(Order $order)
    {
        $order->load(['user:id,name,email', 'product:id,name,sku,version']);
        $data = [
            'order' => $order,
            'user' => $order->user,
            'product' => $order->product,
            'issued_at' => now()->toDateString(),
        ];

        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', $data)->setPaper('a4');
            $filename = 'invoice-' . substr($order->id ?? 'order', 0, 8) . '.pdf';
            return $pdf->download($filename);
        }

        return view('pdf.invoice', $data);
    }
}
