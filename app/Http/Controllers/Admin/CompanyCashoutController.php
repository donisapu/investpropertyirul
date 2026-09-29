<?php

namespace App\Http\Controllers\Admin;

use App\Models\CompanyCashout;
use App\Models\Payment;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use App\Models\XenditTransaction;
use App\Services\Cashout\CashoutAttempt;
use App\Services\Cashout\CashoutRejected;
use App\Services\Cashout\CashoutService;
use App\Services\Withdrawal\PayoutResult;
use App\Services\Xendit\BankChannelCatalog;
use App\Services\Xendit\Exceptions\XenditException;
use App\Services\Xendit\XenditOverview;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\Request;

/**
 * Admin > Company Cash-out (mockup "Xendit Transactions + Cash-out" and
 * "Cash-out diblokir"): pick settled money in, cash it out to the company.
 */
class CompanyCashoutController extends AdminController
{
    protected string $viewPath = 'company_cashouts';

    public function create(XenditOverview $overview, CashoutService $cashouts, BankChannelCatalog $banks)
    {
        $balances = $overview->balances();
        $max = $balances['cash'] === null ? null : $cashouts->maxCashout($balances['cash']);
        $with = ['linkable' => fn (MorphTo $m) => $m->morphWith([
            Payment::class => ['user:id,name', 'payable.property:id,property_name'],
            Withdrawal::class => ['user:id,name'],
        ]), 'cashout:id,external_id,created_at'];

        $eligible = XenditTransaction::cashoutEligible()->with($with)
            ->orderByDesc('xendit_created_at')->limit(CashoutService::MAX_ROWS)->get();

        // Shown but not selectable, so admins see why a row is missing.
        $blocked = XenditTransaction::query()->with($with)
            ->where('cashflow', XenditTransaction::MONEY_IN)->where('status', 'SUCCESS')
            ->where('xendit_created_at', '>=', now()->subDays(30))
            ->where(fn ($q) => $q->whereNotNull('company_cashout_id')->orWhereNotIn('settlement_status', ['SETTLED', 'EARLY_SETTLED'])->orWhereNull('settlement_status'))
            ->orderByDesc('xendit_created_at')->limit(100)->get();

        $settings = WithdrawalSetting::current();

        return $this->view('create', [
            'title' => 'Company Cash-out',
            'rows' => $eligible->concat($blocked)->sortByDesc(fn ($t) => $t->xendit_created_at?->timestamp ?? 0)->values(),
            'balances' => $balances,
            'max' => $max,
            'autoSelect' => $max === null ? [] : $cashouts->autoSelect($max)->modelKeys(),
            'account' => $settings->companyAccount(),
            'accountBank' => $settings->company_bank_code ? $banks->shortNameFor($settings->company_bank_code) : null,
        ]);
    }

    public function store(Request $request, CashoutService $cashouts)
    {
        $data = $request->validate([
            'transaction_ids' => ['required', 'array', 'min:1', 'max:'.CashoutService::MAX_ROWS],
            'transaction_ids.*' => ['integer', 'distinct'],
        ], ['transaction_ids.required' => 'Pilih minimal satu transaksi.']);

        try {
            $attempt = $cashouts->create($request->user(), $data['transaction_ids']);
        } catch (CashoutRejected $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.company-cashouts.index', ['id' => $attempt->cashout->id])->with(...match ($attempt->outcome) {
            CashoutAttempt::SENT => ['success', 'Cash-out '.$attempt->cashout->external_id.' Rp '.number_format($attempt->cashout->amount, 0, ',', '.').' dikirim ke Xendit.'],
            CashoutAttempt::UNKNOWN => ['warning', $attempt->message],
            default => ['error', $attempt->message],
        });
    }

    public function index(Request $request)
    {
        $request->validate(['id' => ['nullable', 'integer']]);

        return $this->view('index', [
            'title' => 'Riwayat Cash-out',
            'cashouts' => CompanyCashout::with('creator:id,name,email')->latest('id')->paginate(20)->withQueryString(),
            'open' => $request->integer('id') ?: null,
            'details' => CompanyCashout::query()->whereKey($request->integer('id'))
                ->with(['transactions' => fn ($q) => $q->with(['linkable' => fn (MorphTo $m) => $m->morphWith([Payment::class => ['user:id,name'], Withdrawal::class => ['user:id,name']])])])
                ->first(),
        ]);
    }

    public function checkStatus(CompanyCashout $cashout, CashoutService $cashouts)
    {
        try {
            $result = $cashouts->checkStatus($cashout);
        } catch (XenditException) {
            return back()->with('warning', 'Tidak bisa membaca status dari Xendit sekarang. Coba lagi sebentar lagi.');
        }

        $fresh = $cashout->fresh();

        return back()->with(...match ($result) {
            PayoutResult::APPLIED => ['success', 'Status '.$fresh->external_id.' diperbarui: '.$fresh->status.'.'],
            PayoutResult::NOT_FOUND => ['warning', 'Xendit belum punya payout untuk '.$fresh->external_id.'.'],
            default => ['info', 'Belum ada perubahan. Status Xendit: '.($fresh->payout_status ?? '-').'.'],
        });
    }
}
