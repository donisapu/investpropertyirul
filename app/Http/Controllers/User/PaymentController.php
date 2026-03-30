<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PropertyInvestment;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Log;

class PaymentController extends Controller
{
    public function payInvestment(Request $request, $id, XenditService $xendit)
    {
        $investment = PropertyInvestment::where('property_id', $id)->first();

        $lot = $request->lot;
        $amount = $lot * $investment->price_per_lot;

        $payment = Payment::create([
            'user_id' => Auth::id(),
            'payable_id' => $investment->id,
            'payable_type' => PropertyInvestment::class,
            'amount' => $amount,
            'external_id' => 'INV-' . Str::uuid(),
            'status' => 'PENDING',
        ]);

        try {
            $invoice = $xendit->createInvoice(
                $payment->external_id,
                $payment->amount,
                Auth::user()->email
            );

            // Intip isi respon Xendit di storage/logs/laravel.log
            \Log::info('Xendit Full Response: ' . json_encode($invoice));

            $url = $invoice->getInvoiceUrl();

            if (!$url) {
                \Log::error('URL Invoice tidak ditemukan dalam respon Xendit');
            }

            $payment->update([
                'invoice_url' => $url
            ]);

            return \Inertia\Inertia::location($url);
        } catch (\Exception $e) {
            \Log::error('Xendit Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function callback(Request $request)
    {
        if ($request->header('x-callback-token') !== config('xendit.callback_token')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->all();
        $payment = Payment::where('external_id', $data['external_id'])->first();

        if (!$payment) {
            if (str_contains($data['external_id'], 'test') || (isset($data['id']) && str_contains($data['id'], 'test'))) {
                return response()->json(['status' => 'success', 'message' => 'Test Received'], 200);
            }
            return response()->json(['message' => 'Payment not found'], 404);
        }

        if ($payment->status === 'PAID') {
            return response()->json(['message' => 'Payment already processed'], 200);
        }

        DB::transaction(function () use ($payment, $data) {
            $payment->update([
                'status' => $data['status'],
                'paid_at' => $data['status'] === 'PAID' ? now() : null,
            ]);

            if ($data['status'] === 'PAID' && $payment->payable_type === \App\Models\PropertyInvestment::class) {
                $payment->payable->increment('sold_lot', $payment->total_lot ?? 1);
            }
        });

        return response()->json(['message' => 'OK']);
    }
}
