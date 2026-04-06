<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\CrowdfundingPortfolio;
use App\Models\CrowdfundingTransaction;
use App\Models\InvestmentPortfolio;
use App\Models\InvestmentTransaction;
use App\Models\Payment;
use App\Models\PropertyCrowdfunding;
use App\Models\PropertyInvestment;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
            'lot' => $lot,
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

            $url = $invoice->getInvoiceUrl();

            if (!$url) {
                Log::error('URL Invoice tidak ditemukan dalam respon Xendit');
            }

            $payment->update([
                'invoice_url' => $url
            ]);

            return \Inertia\Inertia::location($url);
        } catch (\Exception $e) {
            Log::error('Xendit Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function payCrowdfunding(Request $request, $id, XenditService $xendit)
    {
        $request->validate([
            'total_amount' => 'required|numeric|min:100000',
        ]);

        $crowdfunding = PropertyCrowdfunding::where('property_id', $id)->firstOrFail();

        $payment = Payment::create([
            'user_id' => Auth::id(),
            'payable_id' => $crowdfunding->id,
            'payable_type' => PropertyCrowdfunding::class,
            'amount' => $request->total_amount,
            'external_id' => 'INV-' . Str::random(10) . '-' . time(),
            'status' => 'PENDING',
        ]);

        try {
            $invoice = $xendit->createInvoice(
                $payment->external_id,
                (int) $payment->amount,
                Auth::user()->email
            );

            $url = $invoice['invoice_url'] ?? null;

            if (!$url) {
                throw new \Exception('URL Invoice tidak ditemukan dalam respon Xendit');
            }

            $payment->update([
                'invoice_url' => $url
            ]);

            return \Inertia\Inertia::location($url);
        } catch (\Exception $e) {
            $payment->delete();

            Log::error('Xendit Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal membuat invoice: ' . $e->getMessage()]);
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

            if ($data['status'] === 'PAID') {

                $payable = $payment->payable;

                if (!$payable) {
                    Log::error('PAYABLE NULL', ['payment_id' => $payment->id]);
                    return;
                }

                // 🟢 INVESTMENT
                if ($payment->payable_type === \App\Models\PropertyInvestment::class) {

                    $payable->increment('sold_lot', $payment->lot);

                    InvestmentTransaction::create([
                        'user_id' => $payment->user_id,
                        'investment_id' => $payable->id,
                        'payment_id' => $payment->id,
                        'type' => 'BUY',
                        'lot' => $payment->lot,
                        'amount' => $payment->amount,
                        'transacted_at' => $payment->paid_at,
                    ]);

                    $portfolio = InvestmentPortfolio::firstOrCreate([
                        'user_id' => $payment->user_id,
                        'investment_id' => $payable->id,
                    ]);

                    $portfolio->increment('total_lot', $payment->lot);
                    $portfolio->increment('total_invested', $payment->amount);
                }

                // 🔵 CROWDFUNDING
                if ($payment->payable_type === \App\Models\PropertyCrowdfunding::class) {

                    $payable->increment('collected_amount', $payment->amount);

                    CrowdfundingTransaction::create([
                        'user_id' => $payment->user_id,
                        'crowdfunding_id' => $payable->id,
                        'payment_id' => $payment->id,
                        'amount' => $payment->amount,
                        'transacted_at' => $payment->paid_at,
                    ]);

                    $portfolio = CrowdfundingPortfolio::firstOrCreate([
                        'user_id' => $payment->user_id,
                        'crowdfunding_id' => $payable->id,
                    ]);

                    $portfolio->increment('total_amount', $payment->amount);
                }
            }
        });

        return response()->json(['message' => 'OK']);
    }

    public function sellInvestment(Request $request, $id)
    {

        $investment = PropertyInvestment::findOrFail($id);

        $portfolio = InvestmentPortfolio::where([
            'user_id' => Auth::id(),
            'investment_id' => $investment->id
        ])->firstOrFail();

        $lot = $request->lot;

        // validasi
        if ($portfolio->total_lot < $lot) {
            throw new \Exception('Lot tidak cukup');
        }

        // misal harga jual = price_per_lot (sementara)
        $amount = $lot * $investment->price_per_lot;

        DB::transaction(function () use ($portfolio, $investment, $lot, $amount) {

            // 1. kurangi portfolio
            $portfolio->decrement('total_lot', $lot);
            $portfolio->decrement('total_invested', $amount);

            // 2. kurangi dari property
            $investment->decrement('sold_lot', $lot);

            // 3. simpan transaksi
            InvestmentTransaction::create([
                'user_id' => Auth::id(),
                'investment_id' => $investment->id,
                'payment_id' => null,
                'type' => 'SELL',
                'lot' => $lot,
                'amount' => $amount,
                'transacted_at' => now(),
            ]);
        });
    }
}
