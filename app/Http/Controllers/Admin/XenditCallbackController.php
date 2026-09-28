<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditCallbackController extends Controller
{
    public function handleInvoice(Request $request)
    {
        $xenditToken = $request->header('x-callback-token');
        if ($xenditToken !== env('XENDIT_WEBHOOK_TOKEN')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();

        if ($data['status'] === 'PAID') {
            Log::info('Pembayaran Berhasil untuk External ID: ' . $data['external_id']);
        }

        return response()->json(['status' => 'OK'], 200);
    }
}
