<?php

namespace App\Services\Xendit;

use App\Models\CompanyCashout;
use App\Models\Payment;
use App\Models\Withdrawal;
use App\Models\XenditTransaction;
use App\Services\Xendit\Exceptions\XenditException;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Keeps xendit_transactions in step with Xendit GET /transactions.
 *
 * - upsert(): insert or update one Xendit transaction by its id; an older
 *   copy never overwrites a newer one. Links it to our Payment / Withdrawal.
 * - sync(): incremental pull by `updated`, paging with after_id. Used by the
 *   scheduler (every 10 min) and the admin "Sync now" button.
 * - refreshProduct(): pull the transactions of one invoice / payout, used
 *   right after their webhooks.
 */
class TransactionMirror
{
    public const STATE_KEY = 'xendit:transactions:sync-state';

    private const LOCK_KEY = 'xendit:transactions:sync-lock';

    /** Re-read a little before the last seen update: Xendit's clock and ours differ. */
    private const OVERLAP_MINUTES = 10;

    private const PAGE_SIZE = 50;

    public function __construct(
        private readonly XenditGateway $gateway,
        private readonly Cache $cache,
    ) {}

    /**
     * @return array{created: int, updated: int, unchanged: int, pages: int, complete: bool}
     *
     * @throws XenditException when Xendit cannot be read (nothing is lost; the next run continues)
     */
    public function sync(int $maxPages = 40): array
    {
        $lock = $this->cache->lock(self::LOCK_KEY, 600);

        if (! $lock->get()) {
            return ['created' => 0, 'updated' => 0, 'unchanged' => 0, 'pages' => 0, 'complete' => false, 'skipped' => true];
        }

        try {
            return $this->runSync($maxPages);
        } finally {
            $lock->release();
        }
    }

    /** Last sync result and time, for the admin pages. */
    public function state(): array
    {
        return (array) $this->cache->get(self::STATE_KEY, []);
    }

    public function lastSyncedAt(): ?Carbon
    {
        $at = $this->state()['finished_at'] ?? null;

        return $at ? Carbon::parse($at) : null;
    }

    /**
     * Pull and upsert the Xendit transactions of one invoice / payout (product id).
     * Never throws: a failure is logged and the scheduled sync catches up.
     */
    public function refreshProduct(string $productId): int
    {
        try {
            $page = $this->gateway->listTransactions(null, ['product_id' => $productId, 'limit' => self::PAGE_SIZE]);
        } catch (Throwable $e) {
            Log::warning('Could not refresh Xendit transactions for product', ['product_id' => $productId, 'error' => $e->getMessage()]);

            return 0;
        }

        foreach ($page['data'] as $transaction) {
            $this->upsert($transaction);
        }

        return count($page['data']);
    }

    /**
     * @return 'created'|'updated'|'unchanged'|'skipped'
     */
    public function upsert(array $transaction): string
    {
        $id = $transaction['id'] ?? null;

        if (! is_string($id) || $id === '' || strlen($id) > 191) {
            return 'skipped';
        }

        $attributes = $this->attributes($transaction);
        $existing = XenditTransaction::where('xendit_id', $id)->first();

        if ($existing && $existing->xendit_updated_at && $attributes['xendit_updated_at']
            && $attributes['xendit_updated_at']->lt($existing->xendit_updated_at)) {
            return 'unchanged'; // stale copy (e.g. an older page read after a newer webhook refresh)
        }

        [$type, $linkId] = $this->link($attributes['reference_id'], $attributes['product_id']);
        $attributes['linkable_type'] = $type ?? $existing?->linkable_type;
        $attributes['linkable_id'] = $linkId ?? $existing?->linkable_id;

        if (! $existing) {
            XenditTransaction::create(['xendit_id' => $id, ...$attributes]);

            return 'created';
        }

        $existing->fill($attributes);

        if (! $existing->isDirty()) {
            return 'unchanged';
        }

        $existing->save();

        return 'updated';
    }

    private function runSync(int $maxPages): array
    {
        $state = $this->state();
        $since = isset($state['max_updated']) ? Carbon::parse($state['max_updated'])->subMinutes(self::OVERLAP_MINUTES) : null;
        // A run that stopped at the page cap resumes from its cursor with the same window.
        $cursor = $state['cursor'] ?? null;
        // Xendit returns no rows for updated[gte] alone, so always send an upper bound too.
        $until = now()->addMinutes(self::OVERLAP_MINUTES);
        if ($cursor && isset($state['cursor_since'])) {
            $since = Carbon::parse($state['cursor_since']);
            $until = isset($state['cursor_until']) ? Carbon::parse($state['cursor_until']) : $until;
        }

        $filters = ['limit' => self::PAGE_SIZE];
        if ($since) {
            $filters['updated'] = ['gte' => $since, 'lte' => $until];
        }

        $counts = ['created' => 0, 'updated' => 0, 'unchanged' => 0];
        $maxUpdated = isset($state['max_updated']) ? Carbon::parse($state['max_updated']) : null;
        $pages = 0;
        $complete = false;

        while ($pages < $maxPages) {
            $page = $this->gateway->listTransactions($cursor, $filters);
            $pages++;

            foreach ($page['data'] as $transaction) {
                $result = $this->upsert($transaction);
                if (isset($counts[$result])) {
                    $counts[$result]++;
                }
                $updated = $this->time($transaction['updated'] ?? null);
                if ($updated && (! $maxUpdated || $updated->gt($maxUpdated))) {
                    $maxUpdated = $updated;
                }
            }

            $cursor = $page['next_cursor'];

            if (! $page['has_more'] || $cursor === null) {
                $complete = true;
                break;
            }
        }

        $this->cache->forever(self::STATE_KEY, [
            // Only move the window forward once every page of it was read.
            'max_updated' => $complete ? $maxUpdated?->toIso8601String() : ($state['max_updated'] ?? null),
            'cursor' => $complete ? null : $cursor,
            'cursor_since' => $complete ? null : $since?->toIso8601String(),
            'cursor_until' => $complete || ! $since ? null : $until->toIso8601String(),
            'finished_at' => now()->toIso8601String(),
            'last_result' => $counts + ['pages' => $pages, 'complete' => $complete],
        ]);

        return $counts + ['pages' => $pages, 'complete' => $complete];
    }

    private function attributes(array $t): array
    {
        $fee = is_array($t['fee'] ?? null) ? $t['fee'] : [];

        return [
            'type' => $this->str($t['type'] ?? null, 64),
            'status' => $this->str($t['status'] ?? null, 32),
            'settlement_status' => $this->str($t['settlement_status'] ?? null, 32),
            'cashflow' => $this->str($t['cashflow'] ?? null, 16),
            'channel_category' => $this->str($t['channel_category'] ?? null, 64),
            'channel_code' => $this->str($t['channel_code'] ?? null, 64),
            'account_identifier' => $this->str($t['account_identifier'] ?? null, 255),
            'reference_id' => $this->str($t['reference_id'] ?? null, 255),
            'product_id' => $this->str($t['product_id'] ?? null, 255),
            'amount' => $this->number($t['amount'] ?? 0),
            'fee' => $this->number($fee['xendit_fee'] ?? 0) + $this->number($fee['value_added_tax'] ?? 0),
            'currency' => $this->str($t['currency'] ?? 'IDR', 8) ?? 'IDR',
            'xendit_created_at' => $this->time($t['created'] ?? null),
            'xendit_updated_at' => $this->time($t['updated'] ?? null),
            'payload' => $t,
        ];
    }

    /**
     * Our record behind a transaction: invoices carry the Payment external_id,
     * payouts the Withdrawal external_id (or its payout id as product id).
     *
     * @return array{0: ?string, 1: ?int}
     */
    private function link(?string $referenceId, ?string $productId): array
    {
        if ($referenceId) {
            if ($id = Payment::where('external_id', $referenceId)->value('id')) {
                return [Payment::class, $id];
            }
            if ($id = Withdrawal::where('external_id', $referenceId)->value('id')) {
                return [Withdrawal::class, $id];
            }
            if ($id = CompanyCashout::where('external_id', $referenceId)->value('id')) {
                return [CompanyCashout::class, $id];
            }
        }

        if ($productId && ($id = Withdrawal::where('xendit_id', $productId)->value('id'))) {
            return [Withdrawal::class, $id];
        }

        return [null, null];
    }

    private function str(mixed $value, int $max): ?string
    {
        return is_scalar($value) && (string) $value !== '' ? mb_substr((string) $value, 0, $max) : null;
    }

    private function number(mixed $value): float
    {
        return is_numeric($value) ? round((float) $value, 2) : 0.0;
    }

    private function time(mixed $value): ?Carbon
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        try {
            // Eloquent stores the wall-clock time as given, so convert to the app timezone first.
            return Carbon::parse($value)->setTimezone(config('app.timezone'));
        } catch (Throwable) {
            return null;
        }
    }
}
