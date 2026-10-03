<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CrowdfundingPortfolio;
use App\Models\CrowdfundingTransaction;
use App\Models\InvestmentPortfolio;
use App\Models\InvestmentTransaction;
use App\Models\Payment;
use App\Models\PropertyCrowdfunding;
use App\Models\PropertyInvestment;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\XenditService;
use App\Services\Xendit\TransactionMirror;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    public function payInvestment(Request $request, $id, XenditService $xendit)
    {
        // The row lock makes concurrent buyers of the same investment take turns, so the
        // lots that pending invoices hold are counted before the next one is reserved (PF-06).
        $payment = DB::transaction(function () use ($request, $id) {
            $investment = PropertyInvestment::where('property_id', $id)->lockForUpdate()->firstOrFail();

            if ($investment->status !== 'Open') {
                throw ValidationException::withMessages(['error' => 'Investasi ini sedang tidak dibuka untuk pembelian.']);
            }

            if ($investment->total_lot - $investment->sold_lot <= 0) {
                throw ValidationException::withMessages(['error' => 'Lot investasi ini sudah habis.']);
            }

            $available = $investment->availableLots();

            if ($available <= 0) {
                throw ValidationException::withMessages(['error' => 'Sisa lot sedang dipesan investor lain. Coba lagi nanti.']);
            }

            $minLot = max(1, (int) $investment->min_lot_size);
            $maxLot = $investment->max_lot_size > 0 ? min($investment->max_lot_size, $available) : $available;

            $request->validate([
                'lot' => ['required', 'integer', 'min:' . $minLot, 'max:' . $maxLot],
            ], [
                'lot.required' => 'Jumlah lot wajib diisi.',
                'lot.integer' => 'Jumlah lot harus bilangan bulat.',
                'lot.min' => 'Minimal pembelian :min lot.',
                'lot.max' => $maxLot === $available ? 'Sisa lot tinggal :max.' : 'Maksimal pembelian :max lot.',
            ]);

            $campaign = Campaign::discountFor($request->campaign_id, $investment);
            $pricePerLot = $campaign
                ? $campaign->discountedPrice($investment->price_per_lot)
                : (int) round($investment->price_per_lot);

            $lot = (int) $request->lot;

            return Payment::create([
                'user_id' => Auth::id(),
                'payable_id' => $investment->id,
                'payable_type' => PropertyInvestment::class,
                'campaign_id' => $campaign?->id,
                'lot' => $lot,
                'amount' => $lot * $pricePerLot,
                'external_id' => 'INV-' . Str::uuid(),
                'status' => 'PENDING',
            ]);
        });

        try {
            $invoice = $xendit->createInvoice(
                $payment->external_id,
                $payment->amount,
                Auth::user()->email
            );

            $url = $invoice->getInvoiceUrl();

            if (!$url) {
                throw new \Exception('URL Invoice tidak ditemukan dalam respon Xendit');
            }

            $payment->update([
                'invoice_url' => $url
            ]);

            return \Inertia\Inertia::location($url);
        } catch (\Exception $e) {
            $payment->delete();

            Log::error('Xendit Error: ' . $e->getMessage(), ['external_id' => $payment->external_id]);
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function payCrowdfunding(Request $request, $id, XenditService $xendit)
    {
        // Same reservation rule as payInvestment (PF-06).
        $payment = DB::transaction(function () use ($request, $id) {
            // The purchase page posts PropertyCrowdfunding.id (see PublicCrowdfundingController::purchase).
            $crowdfunding = PropertyCrowdfunding::lockForUpdate()->findOrFail($id);

            if ($crowdfunding->status !== 'Open') {
                throw ValidationException::withMessages(['error' => 'Crowdfunding ini sedang tidak dibuka untuk pendanaan.']);
            }

            if ($crowdfunding->funding_goal - $crowdfunding->collected_amount <= 0) {
                throw ValidationException::withMessages(['error' => 'Target pendanaan crowdfunding ini sudah terpenuhi.']);
            }

            $available = $crowdfunding->availableAmount();

            if ($available <= 0) {
                throw ValidationException::withMessages(['error' => 'Sisa target sedang dipesan investor lain. Coba lagi nanti.']);
            }

            $campaign = Campaign::discountFor($request->campaign_id, $crowdfunding);
            $minAmount = min($available, $campaign
                ? $campaign->discountedPrice($crowdfunding->min_contribution)
                : (int) round($crowdfunding->min_contribution));

            $request->validate([
                'total_amount' => ['required', 'integer', 'min:' . $minAmount, 'max:' . $available],
            ], [
                'total_amount.required' => 'Nominal wajib diisi.',
                'total_amount.integer' => 'Nominal harus bilangan bulat (rupiah).',
                'total_amount.min' => 'Minimal partisipasi Rp ' . number_format($minAmount, 0, ',', '.') . '.',
                'total_amount.max' => 'Sisa target pendanaan tinggal Rp ' . number_format($available, 0, ',', '.') . '.',
            ]);

            return Payment::create([
                'user_id' => Auth::id(),
                'payable_id' => $crowdfunding->id,
                'payable_type' => PropertyCrowdfunding::class,
                'campaign_id' => $campaign?->id,
                'amount' => (int) $request->total_amount,
                'external_id' => 'INV-' . Str::random(10) . '-' . time(),
                'status' => 'PENDING',
            ]);
        });

        try {
            $invoice = $xendit->createInvoice(
                $payment->external_id,
                (int) $payment->amount,
                Auth::user()->email
            );

            $url = $invoice->getInvoiceUrl();

            if (!$url) {
                throw new \Exception('URL Invoice tidak ditemukan dalam respon Xendit');
            }

            $payment->update([
                'invoice_url' => $url
            ]);

            return \Inertia\Inertia::location($url);
        } catch (\Exception $e) {
            $payment->delete();

            Log::error('Xendit Error: ' . $e->getMessage(), ['external_id' => $payment->external_id]);
            return back()->withErrors(['error' => 'Gagal membuat invoice: ' . $e->getMessage()]);
        }
    }

    public function callback(Request $request)
    {
        $expectedToken = (string) config('xendit.callback_token');
        $givenToken = (string) $request->header('x-callback-token');

        // An empty configured token must never match an empty/missing header.
        if ($expectedToken === '' || ! hash_equals($expectedToken, $givenToken)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->all();
        $externalId = $data['external_id'] ?? null;
        $payment = is_string($externalId) && $externalId !== ''
            ? Payment::where('external_id', $externalId)->first()
            : null;

        // Acknowledge unknown invoices (dashboard "Test and save", other apps on the same
        // Xendit account) with 200: a non-2xx makes Xendit retry up to 6 times for nothing.
        if (! $payment) {
            Log::warning('Xendit invoice webhook for unknown external_id', [
                'external_id' => $externalId,
                'invoice_id' => $data['id'] ?? null,
                'status' => $data['status'] ?? null,
                'webhook_id' => $request->header('webhook-id'),
            ]);

            return response()->json(['message' => 'Ignored: unknown external_id'], 200);
        }

        // Mirror the invoice's Xendit transaction after replying (XW-08).
        if (is_string($data['id'] ?? null) && $data['id'] !== '') {
            $invoiceId = $data['id'];
            dispatch(fn () => app(TransactionMirror::class)->refreshProduct($invoiceId))->afterResponse();
        }

        if ($payment->status === 'PAID') {
            return response()->json(['message' => 'Payment already processed'], 200);
        }

        DB::transaction(function () use ($payment, $data) {
            // Retried / parallel deliveries of the same invoice take turns here; the later one sees PAID.
            $payment = Payment::lockForUpdate()->find($payment->id);

            if ($payment->status === 'PAID') {
                return;
            }

            $payment->update([
                'status' => $data['status'],
                'paid_at' => $data['status'] === 'PAID' ? now() : null,
            ]);

            if ($data['status'] === 'PAID') {

                // Locked so two payments for the same product cannot both take its last lots.
                $payable = $payment->payable_type::lockForUpdate()->find($payment->payable_id);

                if (!$payable) {
                    // The product was deleted while the invoice was open: nothing to book it on.
                    $this->refundToWallet($payment, 0);

                    return;
                }

                // INVESTMENT
                if ($payment->payable_type === \App\Models\PropertyInvestment::class) {

                    if ($payable->sold_lot + $payment->lot > $payable->total_lot) {
                        $this->refundToWallet($payment, $payable->total_lot - $payable->sold_lot);

                        return;
                    }

                    $payable->increment('sold_lot', $payment->lot);
                    $price_per_lot = $payment->amount / $payment->lot;
                    InvestmentTransaction::create([
                        'user_id' => $payment->user_id,
                        'investment_id' => $payable->id,
                        'payment_id' => $payment->id,
                        'type' => 'BUY',
                        'status' => 'APPROVED',
                        'lot' => $payment->lot,
                        'amount' => $payment->amount,
                        'price_per_lot' => $price_per_lot,
                        'transacted_at' => $payment->paid_at,
                    ]);

                    $portfolio = InvestmentPortfolio::firstOrCreate([
                        'user_id' => $payment->user_id,
                        'investment_id' => $payable->id,
                    ]);

                    $portfolio->increment('total_lot', $payment->lot);
                    $portfolio->increment('total_invested', $payment->amount);

                    if ($payable->sold_lot >= $payable->total_lot && $payable->status === 'Open') {
                        $payable->update(['status' => 'FullyFunded']);
                    }
                }

                // 🔵 CROWDFUNDING
                if ($payment->payable_type === \App\Models\PropertyCrowdfunding::class) {

                    if ($payable->collected_amount + $payment->amount > $payable->funding_goal) {
                        $this->refundToWallet($payment, $payable->funding_goal - $payable->collected_amount);

                        return;
                    }

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

                    if ($payable->collected_amount >= $payable->funding_goal && $payable->status === 'Open') {
                        $payable->update(['status' => 'Funded']);
                    }
                }
            }
        });

        return response()->json(['message' => 'OK']);
    }

    /**
     * The money arrived but the product is already full (e.g. the admin lowered the target
     * while an invoice was open). Nothing is booked; the whole amount goes back to the user's
     * Wallet, where they can reinvest or withdraw it (client, 2026-10-03).
     *
     * Runs inside the webhook transaction with the Payment row locked; refunded_at makes it once only.
     */
    private function refundToWallet(Payment $payment, $left): void
    {
        if ($payment->refunded_at !== null) {
            return;
        }

        $wallet = Wallet::query()->where('user_id', $payment->user_id)->lockForUpdate()->first()
            ?? Wallet::create(['user_id' => $payment->user_id, 'balance' => 0]);

        // Whole rupiah added to a decimal(18,2) balance: bcadd keeps the cents exact.
        $balanceAfter = bcadd((string) $wallet->balance, (string) (int) $payment->amount, 2);
        $wallet->forceFill(['balance' => $balanceAfter])->save();

        WalletTransaction::create([
            'user_id' => $payment->user_id,
            'type' => WalletTransaction::TYPE_PAYMENT_REFUND,
            'amount' => (int) $payment->amount,
            'balance_after' => $balanceAfter,
            'reference_type' => Payment::class,
            'reference_id' => $payment->id,
        ]);

        $payment->forceFill(['needs_refund' => true, 'refunded_at' => now()])->save();

        Log::warning('Paid invoice exceeds what is left, refunded to wallet', [
            'payment_id' => $payment->id,
            'payable_type' => $payment->payable_type,
            'payable_id' => $payment->payable_id,
            'lot' => $payment->lot,
            'amount' => $payment->amount,
            'left' => $left,
        ]);
    }

    public function sellInvestment(Request $request, $id)
    {
        $request->validate([
            'lot' => 'required|integer|min:1'
        ]);

        return DB::transaction(function () use ($request, $id) {
            $investment = PropertyInvestment::where('property_id', $id)->first();
            $portfolio = InvestmentPortfolio::where([
                'user_id' => Auth::id(),
                'investment_id' => $investment->id
            ])->lockForUpdate()->firstOrFail();

            $lot = $request->lot;

            $pendingSellLot = InvestmentTransaction::where([
                'user_id' => Auth::id(),
                'investment_id' => $investment->id,
                'type' => 'SELL',
                'status' => 'PENDING'
            ])->sum('lot');

            if (($portfolio->total_lot - $pendingSellLot) < $lot) {
                throw new \Exception('Lot tidak cukup atau sedang dalam proses penjualan');
            }

            $amount = $lot * $investment->price_per_lot;

            InvestmentTransaction::create([
                'user_id' => Auth::id(),
                'investment_id' => $investment->id,
                'type' => 'SELL',
                'status' => 'PENDING',
                'lot' => $lot,
                'price_per_lot' => $investment->price_per_lot,
                'amount' => $amount,
                'transacted_at' => now(),
            ]);

        });
    }
}
