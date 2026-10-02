<?php

namespace App\Services;

use App\Models\CrowdfundingFinancial;
use App\Models\CrowdfundingPortfolio;
use App\Models\CrowdfundingReturn;
use App\Models\PropertyCrowdfunding;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Pays a crowdfunding out once the flip is done: each investor gets their principal back
 * plus principal / total principal of the net profit (a loss is shared the same way).
 *
 * Shares are floored to whole rupiah; the rounding rest stays with the owner.
 * Admins start it from the Crowdfunding Financials page after seeing the plan. It used to run
 * from an observer when a report was saved as FINAL, which missed reports created as FINAL
 * and left a report FINAL but unpaid when the payout failed.
 */
class CrowdfundingDistributionService
{
    /**
     * What handle() would pay right now, for the confirm dialog.
     *
     * @return array{shares: Collection, principal: int, profit: int, total: int, net_profit: int}
     */
    public function preview(CrowdfundingFinancial $financial): array
    {
        $portfolios = CrowdfundingPortfolio::where('crowdfunding_id', $financial->crowdfunding_id)
            ->where('total_amount', '>', 0)->orderBy('user_id')->get();

        return $this->plan($portfolios, (int) floor($financial->net_profit));
    }

    /**
     * @return array{investors: int, total: int}
     *
     * @throws ProfitDistributionRejected
     */
    public function handle(CrowdfundingFinancial $financial): array
    {
        return DB::transaction(function () use ($financial) {
            // Two admins (or a double click) take turns here; the second one sees is_distributed.
            $financial = CrowdfundingFinancial::query()->whereKey($financial->id)->lockForUpdate()->firstOrFail();

            if ($financial->is_distributed) {
                throw new ProfitDistributionRejected('Hasil crowdfunding ini sudah pernah dibagikan.');
            }

            if ($financial->status !== 'FINAL') {
                throw new ProfitDistributionRejected('Laporan harus berstatus FINAL sebelum hasil dibagikan.');
            }

            // The payment webhook locks this row too, so no contribution lands mid-payout.
            $crowdfunding = PropertyCrowdfunding::query()->whereKey($financial->crowdfunding_id)->lockForUpdate()->firstOrFail();

            if ($crowdfunding->status !== 'Funded') {
                throw new ProfitDistributionRejected('Crowdfunding harus berstatus Funded sebelum hasil dibagikan.');
            }

            $portfolios = CrowdfundingPortfolio::where('crowdfunding_id', $crowdfunding->id)
                ->where('total_amount', '>', 0)->orderBy('user_id')->lockForUpdate()->get();
            $plan = $this->plan($portfolios, (int) floor($financial->net_profit));

            if ($plan['shares']->isEmpty()) {
                throw new ProfitDistributionRejected('Belum ada investor di crowdfunding ini, atau hasilnya sudah dibagikan lewat laporan lain.');
            }

            foreach ($plan['shares'] as $share) {
                $this->credit($share, $financial);
            }

            // The money is back in the wallets, so the holdings are closed.
            CrowdfundingPortfolio::whereKey($portfolios->modelKeys())->delete();

            $financial->forceFill(['is_distributed' => true, 'distributed_at' => now()])->save();

            return ['investors' => $plan['shares']->count(), 'total' => $plan['total']];
        });
    }

    private function plan(Collection $portfolios, int $netProfit): array
    {
        $principalTotal = (string) $portfolios->reduce(fn ($sum, $p) => bcadd($sum, $this->rupiah($p->total_amount)), '0');

        $shares = bccomp($principalTotal, '0') > 0
            ? $portfolios->map(function ($portfolio) use ($netProfit, $principalTotal) {
                $principal = $this->rupiah($portfolio->total_amount);
                $profit = $this->floorDiv(bcmul($principal, (string) $netProfit), $principalTotal);

                return [
                    'user_id' => (int) $portfolio->user_id,
                    'principal' => (int) $principal,
                    'profit' => (int) $profit,
                    // A loss bigger than the principal pays nothing; it never takes money out.
                    'amount' => max(0, (int) bcadd($principal, $profit)),
                    'ownership' => round((float) bcdiv(bcmul($principal, '100'), $principalTotal, 4), 2),
                ];
            })->values()
            : collect();

        return [
            'shares' => $shares,
            'principal' => (int) $principalTotal,
            'profit' => (int) $shares->sum('profit'),
            'total' => (int) $shares->sum('amount'),
            'net_profit' => $netProfit,
        ];
    }

    private function credit(array $share, CrowdfundingFinancial $financial): void
    {
        $wallet = Wallet::query()->where('user_id', $share['user_id'])->lockForUpdate()->first()
            ?? Wallet::create(['user_id' => $share['user_id'], 'balance' => 0]);

        if (($wallet->status ?? 'ACTIVE') !== 'ACTIVE') {
            throw new ProfitDistributionRejected("Wallet investor #{$share['user_id']} sedang nonaktif; aktifkan dulu sebelum membagikan hasil.");
        }

        // Whole rupiah added to a decimal(18,2) balance: bcadd keeps the cents exact.
        $balanceAfter = bcadd((string) $wallet->balance, (string) $share['amount'], 2);
        $wallet->forceFill(['balance' => $balanceAfter])->save();

        WalletTransaction::create([
            'user_id' => $share['user_id'],
            'type' => 'PROFIT',
            'amount' => $share['amount'],
            'balance_after' => $balanceAfter,
            'reference_type' => CrowdfundingFinancial::class,
            'reference_id' => $financial->id,
        ]);

        CrowdfundingReturn::create([
            'crowdfunding_financial_id' => $financial->id,
            'user_id' => $share['user_id'],
            'principal_returned' => $share['principal'],
            'profit_received' => $share['profit'],
            'ownership_percentage' => $share['ownership'],
            'distributed_at' => now(),
        ]);
    }

    // Contributions are whole rupiah; drop any cents the decimal column carries.
    private function rupiah($amount): string
    {
        return bcadd((string) $amount, '0', 0);
    }

    // bcdiv truncates toward zero; a loss share must round down too, or the payout exceeds what is there.
    private function floorDiv(string $a, string $b): string
    {
        $q = bcdiv($a, $b, 0);

        return bccomp(bcmul($q, $b), $a) > 0 ? bcsub($q, '1') : $q;
    }
}
