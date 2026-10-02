<?php

namespace App\Services;

use App\Models\InvestmentTransaction;
use App\Models\PropertyFinancial;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Pays one FINAL month of an investment's net profit into the investors' wallets.
 *
 * Each investor gets lots_owned / total_lot of the net profit, floored to whole rupiah.
 * The share of unsold lots (and the rounding rest) is not paid out: it stays with the owner.
 * Admins start it from the Financials page; it never runs on a schedule (client, 2026-10-02).
 */
class DistributeProfitService
{
    /**
     * What handle() would pay right now, for the confirm dialog.
     *
     * @return array{shares: Collection, total: int, undistributed: int, net_profit: int}
     */
    public function preview(PropertyFinancial $financial): array
    {
        $investment = $financial->investment()->firstOrFail();
        $netProfit = (int) floor($financial->net_profit);

        $shares = $investment->total_lot > 0 && $netProfit > 0
            ? $this->owners($investment->id)->map(fn ($row) => [
                'user_id' => (int) $row->user_id,
                'lot' => (int) $row->lot,
                'amount' => intdiv((int) $row->lot * $netProfit, (int) $investment->total_lot),
            ])->filter(fn ($share) => $share['amount'] > 0)->values()
            : collect();

        $total = (int) $shares->sum('amount');

        return ['shares' => $shares, 'total' => $total, 'undistributed' => max(0, $netProfit - $total), 'net_profit' => $netProfit];
    }

    /**
     * @return array{investors: int, total: int, undistributed: int}
     *
     * @throws ProfitDistributionRejected
     */
    public function handle(PropertyFinancial $financial): array
    {
        return DB::transaction(function () use ($financial) {
            // Two admins (or a double click) take turns here; the second one sees is_distributed.
            $financial = PropertyFinancial::query()->whereKey($financial->id)->lockForUpdate()->firstOrFail();

            if ($financial->is_distributed) {
                throw new ProfitDistributionRejected('Profit bulan ini sudah pernah dibagikan.');
            }

            if ($financial->status !== 'FINAL') {
                throw new ProfitDistributionRejected('Laporan harus berstatus FINAL sebelum profit dibagikan.');
            }

            if ($financial->net_profit <= 0) {
                throw new ProfitDistributionRejected('Net profit harus lebih dari 0 untuk dibagikan.');
            }

            $plan = $this->preview($financial);

            if ($plan['shares']->isEmpty()) {
                throw new ProfitDistributionRejected('Belum ada investor yang memegang lot investasi ini.');
            }

            foreach ($plan['shares'] as $share) {
                $this->credit($share['user_id'], $share['amount'], $financial);
            }

            $financial->forceFill(['is_distributed' => true, 'distributed_at' => now()])->save();

            return ['investors' => $plan['shares']->count(), 'total' => $plan['total'], 'undistributed' => $plan['undistributed']];
        });
    }

    // Lots each investor holds now: approved buys minus approved sells.
    private function owners(int $investmentId): Collection
    {
        return InvestmentTransaction::query()
            ->selectRaw("user_id, SUM(CASE WHEN type = 'BUY' THEN lot WHEN type = 'SELL' THEN -lot ELSE 0 END) as lot")
            ->where('investment_id', $investmentId)
            ->where('status', 'APPROVED')
            ->groupBy('user_id')
            ->havingRaw("SUM(CASE WHEN type = 'BUY' THEN lot WHEN type = 'SELL' THEN -lot ELSE 0 END) > 0")
            ->orderBy('user_id')
            ->get();
    }

    private function credit(int $userId, int $amount, PropertyFinancial $financial): void
    {
        $wallet = Wallet::query()->where('user_id', $userId)->lockForUpdate()->first()
            ?? Wallet::create(['user_id' => $userId, 'balance' => 0]);

        if (($wallet->status ?? 'ACTIVE') !== 'ACTIVE') {
            throw new ProfitDistributionRejected("Wallet investor #{$userId} sedang nonaktif; aktifkan dulu sebelum membagikan profit.");
        }

        // Whole rupiah added to a decimal(18,2) balance: bcadd keeps the cents exact.
        $balanceAfter = bcadd((string) $wallet->balance, (string) $amount, 2);
        $wallet->forceFill(['balance' => $balanceAfter])->save();

        WalletTransaction::create([
            'user_id' => $userId,
            'type' => 'PROFIT',
            'amount' => $amount,
            'balance_after' => $balanceAfter,
            'reference_type' => PropertyFinancial::class,
            'reference_id' => $financial->id,
        ]);
    }
}
