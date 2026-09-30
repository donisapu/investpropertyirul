<?php

namespace App\Services\Xendit;

use App\Models\Withdrawal;
use App\Models\XenditTransaction;
use App\Services\Wallet\WalletReserve;
use App\Services\Xendit\Exceptions\XenditException;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Everything the admin Xendit Dashboard shows. Balances come live from
 * Xendit; if Xendit is down, the last known values are returned with an
 * error, so the page always renders. Money in / out come from the mirror.
 */
class XenditOverview
{
    public const BALANCE_CACHE_KEY = 'xendit:balances:last-known';

    public function __construct(
        private readonly XenditGateway $gateway,
        private readonly WalletReserve $reserve,
        private readonly TransactionMirror $mirror,
        private readonly Cache $cache,
    ) {}

    public function build(): array
    {
        $balances = $this->balances();
        $reserve = $this->reserve->breakdown();

        return [
            'balances' => $balances,
            'reserve' => $reserve,
            // Same limit the server enforces on submit (also minus Cash-outs still in flight).
            'max_cashout' => $balances['cash'] === null ? null : app(\App\Services\Cashout\CashoutService::class)->maxCashout($balances['cash']),
            'flows' => [
                'today' => $this->flows(now()->startOfDay()),
                'days14' => $this->flows(now()->subDays(13)->startOfDay()),
                'month' => $this->flows(now()->startOfMonth()),
            ],
            'daily' => $this->daily(14),
            'actions' => $this->actions(),
            'latest' => XenditTransaction::query()
                ->with(['linkable' => fn ($m) => $m->morphWith([
                    \App\Models\Payment::class => ['user:id,name', 'payable.property:id,property_name'],
                    Withdrawal::class => ['user:id,name'],
                ])])
                ->orderByDesc('xendit_created_at')->orderByDesc('id')
                ->limit(10)->get(),
            'last_synced_at' => $this->mirror->lastSyncedAt(),
        ];
    }

    /**
     * @return array{cash: ?float, holding: ?float, fetched_at: ?Carbon, stale: bool, error: ?string}
     */
    public function balances(): array
    {
        try {
            $cash = $this->gateway->getBalance(XenditGateway::BALANCE_CASH);
            $holding = $this->gateway->getBalance(XenditGateway::BALANCE_HOLDING);
            $snapshot = ['cash' => (float) $cash, 'holding' => (float) $holding, 'fetched_at' => now()->toIso8601String()];
            $this->cache->forever(self::BALANCE_CACHE_KEY, $snapshot);

            return ['cash' => (float) $cash, 'holding' => (float) $holding, 'fetched_at' => now(), 'stale' => false, 'error' => null];
        } catch (XenditException $e) {
            $last = (array) $this->cache->get(self::BALANCE_CACHE_KEY, []);

            return [
                'cash' => isset($last['cash']) ? (float) $last['cash'] : null,
                'holding' => isset($last['holding']) ? (float) $last['holding'] : null,
                'fetched_at' => isset($last['fetched_at']) ? Carbon::parse($last['fetched_at']) : null,
                'stale' => true,
                'error' => $e instanceof \App\Services\Xendit\Exceptions\XenditRejectedException
                    ? 'Xendit menolak permintaan saldo ('.$e->errorCode.').'
                    : 'Xendit sedang tidak bisa dihubungi.',
            ];
        }
    }

    /** @return array{in: float, out: float, fee: float} */
    private function flows(Carbon $from): array
    {
        $rows = XenditTransaction::query()
            ->where('status', 'SUCCESS')
            ->where('xendit_created_at', '>=', $from)
            ->selectRaw('cashflow, coalesce(sum(amount), 0) as total, coalesce(sum(fee), 0) as fee')
            ->groupBy('cashflow')
            ->get()
            ->keyBy('cashflow');

        return [
            'in' => (float) ($rows[XenditTransaction::MONEY_IN]->total ?? 0),
            'out' => (float) ($rows[XenditTransaction::MONEY_OUT]->total ?? 0),
            'fee' => (float) $rows->sum('fee'),
        ];
    }

    /** @return list<array{date: Carbon, in: float, out: float}> */
    private function daily(int $days): array
    {
        $from = now()->subDays($days - 1)->startOfDay();

        // Grouped in PHP so it works the same on every database driver.
        $byDay = XenditTransaction::query()
            ->where('status', 'SUCCESS')
            ->where('xendit_created_at', '>=', $from)
            ->get(['cashflow', 'amount', 'xendit_created_at'])
            ->groupBy(fn (XenditTransaction $t) => $t->xendit_created_at->timezone(config('app.timezone'))->toDateString());

        return collect(range(0, $days - 1))->map(function (int $i) use ($from, $byDay) {
            $day = $from->copy()->addDays($i);
            /** @var Collection $rows */
            $rows = $byDay->get($day->toDateString(), collect());

            return [
                'date' => $day,
                'in' => (float) $rows->where('cashflow', XenditTransaction::MONEY_IN)->sum('amount'),
                'out' => (float) $rows->where('cashflow', XenditTransaction::MONEY_OUT)->sum('amount'),
            ];
        })->all();
    }

    private function actions(): array
    {
        $pending = Withdrawal::query()->where('status', Withdrawal::STATUS_PENDING);

        return [
            'pending_count' => (clone $pending)->count(),
            'pending_total' => (int) (clone $pending)->sum('amount'),
            'pending_oldest' => (clone $pending)->min('created_at'),
            'stuck_count' => Withdrawal::query()
                ->where('status', Withdrawal::STATUS_PROCESSING)
                ->where(fn ($q) => $q->where('approved_at', '<', now()->subDay())
                    ->orWhere(fn ($q) => $q->whereNull('approved_at')->where('updated_at', '<', now()->subDay())))
                ->count(),
            'cashout_ready_count' => XenditTransaction::query()
                ->where('cashflow', XenditTransaction::MONEY_IN)
                ->where('status', 'SUCCESS')
                ->whereIn('settlement_status', ['SETTLED', 'EARLY_SETTLED'])
                ->whereNull('company_cashout_id')
                ->count(),
        ];
    }
}
