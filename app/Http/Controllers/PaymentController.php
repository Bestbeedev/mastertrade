<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        // Stub: normally create transaction and return PSP init data
        $reference = Str::uuid()->toString();

        return response()->json([
            'reference' => $reference,
            'amount' => (int) $request->input('amount', 0),
            'status' => 'initiated',
        ]);
    }

    public function webhook(Request $request)
    {
        // Stub: verify signature and update transaction
        return response()->json(['ok' => true]);
    }
}
