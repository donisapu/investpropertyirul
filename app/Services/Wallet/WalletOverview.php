<?php

namespace App\Services\Wallet;

use App\Models\CrowdfundingFinancial;
use App\Models\InvestmentTransaction;
use App\Models\PropertyFinancial;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Services\Withdrawal\PayoutFailure;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Everything the user Wallet page shows, as plain arrays for Inertia.
 * Account numbers leave the server masked (last 4 digits only).
 */
class WalletOverview
{
    private const HISTORY_LIMIT = 50;

    public function __construct(private readonly BankChannelCatalog $banks) {}

    public function for(User $user): array
    {
        $wallet = Wallet::where('user_id', $user->id)->first();
        $monthStart = Carbon::now()->startOfMonth();

        $withdrawals = Withdrawal::query()->where('user_id', $user->id)->get();

        return [
            'balance' => $this->wholeRupiah($wallet?->balance),
            'summary' => [
                'processing' => $withdrawals->filter->isOpen()->sum(fn (Withdrawal $w) => $w->totalDeduction()),
                'withdrawn_this_month' => $withdrawals
                    ->where('status', Withdrawal::STATUS_SUCCEEDED)
                    ->filter(fn (Withdrawal $w) => ($w->processed_at ?? $w->updated_at)?->gte($monthStart))
                    ->sum('amount'),
                'profit_this_month' => (int) WalletTransaction::query()
                    ->where('user_id', $user->id)
                    ->where('type', 'PROFIT')
                    ->where('created_at', '>=', $monthStart)
                    ->sum('amount'),
            ],
            'bankAccounts' => $this->bankAccounts($user),
            'history' => $this->history($user, $withdrawals->keyBy('id')),
        ];
    }

    private function bankAccounts(User $user): array
    {
        $lastFailures = Withdrawal::query()
            ->where('user_id', $user->id)
            ->where('status', Withdrawal::STATUS_FAILED)
            ->whereNotNull('failure_code')
            ->latest('id')
            ->get(['user_bank_account_id', 'failure_code'])
            ->unique('user_bank_account_id')
            ->keyBy('user_bank_account_id');

        return $user->bankAccounts()->latest('id')->get()
            ->map(fn (UserBankAccount $account) => [
                'id' => $account->id,
                'bank_code' => $account->bank_code,
                'bank_name' => $this->shortBankName($account->bank_code),
                'bank_badge' => $this->bankBadge($account->bank_code),
                'last4' => $this->last4($account->account_number),
                'holder' => $account->account_holder_name,
                'last_failure' => PayoutFailure::message($lastFailures->get($account->id)?->failure_code),
            ])->values()->all();
    }

    private function history(User $user, Collection $withdrawals): array
    {
        $rows = WalletTransaction::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->limit(self::HISTORY_LIMIT)
            ->get();

        $accounts = UserBankAccount::withTrashed()
            ->whereIn('id', $withdrawals->pluck('user_bank_account_id'))
            ->get()
            ->keyBy('id');

        $names = $this->referenceNames($rows);

        return $rows->map(function (WalletTransaction $row) use ($withdrawals, $accounts, $names) {
            $withdrawal = $row->reference_type === Withdrawal::class ? $withdrawals->get($row->reference_id) : null;
            $account = $withdrawal ? $accounts->get($withdrawal->user_bank_account_id) : null;
            $target = $account ? $this->shortBankName($account->bank_code).' •••• '.$this->last4($account->account_number) : 'rekening';
            $name = $names[$row->reference_type][$row->reference_id] ?? null;
            $amount = $this->wholeRupiah($row->amount);

            return match ($row->type) {
                WalletTransaction::TYPE_WITHDRAW => [
                    'kind' => 'withdraw',
                    'title' => "Tarik ke {$target}",
                    'subtitle' => $this->withdrawSubtitle($withdrawal),
                    'amount' => -$amount,
                    'status' => $this->withdrawStatus($withdrawal),
                    'fix_account' => false,
                ],
                WalletTransaction::TYPE_WITHDRAW_REFUND => [
                    'kind' => 'refund',
                    'title' => "Dikembalikan: tarik ke {$target}",
                    'subtitle' => PayoutFailure::message($withdrawal?->failure_code) ?? ($withdrawal?->failure_reason ?: 'Saldo dan biaya admin dikembalikan'),
                    'amount' => $amount,
                    'status' => $this->withdrawStatus($withdrawal),
                    'fix_account' => PayoutFailure::isAccountProblem($withdrawal?->failure_code),
                ],
                'PROFIT' => [
                    'kind' => 'profit',
                    'title' => $name ? "Bagi hasil {$name}" : 'Bagi hasil',
                    'subtitle' => null,
                    'amount' => $amount,
                    'status' => ['label' => 'Masuk', 'tone' => 'success'],
                    'fix_account' => false,
                ],
                'INVEST_SELL' => [
                    'kind' => 'sell',
                    'title' => $name ? "Jual lot {$name}" : 'Jual lot',
                    'subtitle' => null,
                    'amount' => $amount,
                    'status' => ['label' => 'Masuk', 'tone' => 'success'],
                    'fix_account' => false,
                ],
                default => [
                    'kind' => strtolower($row->type),
                    'title' => $row->type === 'INVEST_BUY' ? ($name ? "Beli lot {$name}" : 'Beli lot') : 'Top up',
                    'subtitle' => null,
                    'amount' => $row->type === 'INVEST_BUY' ? -$amount : $amount,
                    'status' => null,
                    'fix_account' => false,
                ],
            } + ['id' => $row->id, 'date' => $row->created_at?->toIso8601String()];
        })->values()->all();
    }

    private function withdrawSubtitle(?Withdrawal $withdrawal): ?string
    {
        return match ($withdrawal?->status) {
            Withdrawal::STATUS_PENDING => 'Menunggu dicek admin',
            Withdrawal::STATUS_PROCESSING => 'Diproses Xendit, biasanya < 1 jam',
            Withdrawal::STATUS_SUCCEEDED => $withdrawal->processed_at
                ? 'Masuk rekening '.$withdrawal->processed_at->timezone(config('app.timezone'))->translatedFormat('j M H.i')
                : 'Masuk rekening',
            Withdrawal::STATUS_REJECTED => $withdrawal->failure_reason ? 'Ditolak: '.$withdrawal->failure_reason : 'Ditolak admin',
            Withdrawal::STATUS_FAILED, Withdrawal::STATUS_REVERSED => PayoutFailure::message($withdrawal->failure_code) ?? 'Transfer gagal',
            default => null,
        };
    }

    /** @return array{label: string, tone: string}|null */
    private function withdrawStatus(?Withdrawal $withdrawal): ?array
    {
        return match ($withdrawal?->status) {
            Withdrawal::STATUS_PENDING => ['label' => 'Menunggu admin', 'tone' => 'neutral'],
            Withdrawal::STATUS_PROCESSING => ['label' => 'Diproses', 'tone' => 'info'],
            Withdrawal::STATUS_SUCCEEDED => ['label' => 'Berhasil', 'tone' => 'success'],
            Withdrawal::STATUS_FAILED => ['label' => 'Gagal · saldo kembali', 'tone' => 'danger'],
            Withdrawal::STATUS_REJECTED => ['label' => 'Ditolak · saldo kembali', 'tone' => 'danger'],
            Withdrawal::STATUS_REVERSED => ['label' => 'Dibatalkan bank · saldo kembali', 'tone' => 'danger'],
            default => null,
        };
    }

    /**
     * Property / crowdfunding names for PROFIT and INVEST_* rows, in a few queries.
     *
     * @return array<string, array<int, string>>
     */
    private function referenceNames(Collection $rows): array
    {
        $names = [];
        $idsOf = fn (string $type) => $rows->where('reference_type', $type)->pluck('reference_id')->filter()->unique();

        if (($ids = $idsOf(PropertyFinancial::class))->isNotEmpty()) {
            foreach (PropertyFinancial::with('investment.property')->whereIn('id', $ids)->get() as $f) {
                $names[PropertyFinancial::class][$f->id] = $f->investment?->property?->property_name;
            }
        }

        if (($ids = $idsOf(CrowdfundingFinancial::class))->isNotEmpty()) {
            foreach (CrowdfundingFinancial::with('crowdfunding.property')->whereIn('id', $ids)->get() as $f) {
                $names[CrowdfundingFinancial::class][$f->id] = $f->crowdfunding?->property?->property_name;
            }
        }

        if (($ids = $idsOf(InvestmentTransaction::class))->isNotEmpty()) {
            foreach (InvestmentTransaction::with('ip.property')->whereIn('id', $ids)->get() as $t) {
                $names[InvestmentTransaction::class][$t->id] = $t->ip?->property?->property_name;
            }
        }

        return $names;
    }

    /** "Bank Negara Indonesia (BNI)" -> "BNI", "Bank Mandiri" -> "Mandiri". */
    private function shortBankName(string $code): string
    {
        $name = $this->banks->nameFor($code) ?? preg_replace('/^ID_/', '', $code);

        if (preg_match('/\(([^)]+)\)\s*$/', $name, $m)) {
            return $m[1];
        }

        return preg_replace('/^Bank\s+/i', '', $name);
    }

    private function bankBadge(string $code): string
    {
        return substr(preg_replace('/[^A-Z]/', '', preg_replace('/^ID_/', '', strtoupper($code))), 0, 4) ?: 'BANK';
    }

    private function last4(?string $number): string
    {
        return substr(preg_replace('/\D/', '', (string) $number), -4);
    }

    /** Wallet amounts are whole Rupiah in practice; drop the decimal(18,2) cents for display. */
    private function wholeRupiah(mixed $value): int
    {
        return (int) floor((float) ($value ?? 0));
    }
}
