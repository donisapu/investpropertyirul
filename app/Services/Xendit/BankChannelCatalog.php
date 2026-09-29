<?php

namespace App\Services\Xendit;

use App\Services\Xendit\Exceptions\XenditException;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

/**
 * IDR bank payout channels a user can withdraw to (no e-wallets), with each
 * bank's amount limits.
 *
 * Source: Xendit GET /payouts_channels, cached for a day. If Xendit is down,
 * falls back to the last good list, then to a built-in list of 5 big banks, so
 * the Wallet page never breaks. Codes are Xendit channel codes (e.g. ID_BCA).
 *
 * @phpstan-type Bank array{code: string, name: string, min: int, max: int|null, increment: int}
 */
class BankChannelCatalog
{
    public const CACHE_KEY = 'xendit:bank_channels:v1';

    public const LAST_GOOD_CACHE_KEY = 'xendit:bank_channels:last_good:v1';

    public const TTL_SECONDS = 86400;

    /** While Xendit is down, retry at most this often instead of on every request. */
    public const FALLBACK_TTL_SECONDS = 600;

    /** Used only when Xendit has never answered. Limits per Xendit's published defaults. */
    public const BUILT_IN = [
        ['code' => 'ID_BCA', 'name' => 'Bank Central Asia (BCA)', 'min' => 1, 'max' => null, 'increment' => 1],
        ['code' => 'ID_BNI', 'name' => 'Bank Negara Indonesia (BNI)', 'min' => 1, 'max' => null, 'increment' => 1],
        ['code' => 'ID_BRI', 'name' => 'Bank Rakyat Indonesia (BRI)', 'min' => 1, 'max' => null, 'increment' => 1],
        ['code' => 'ID_CIMB', 'name' => 'CIMB Niaga', 'min' => 10000, 'max' => null, 'increment' => 1],
        ['code' => 'ID_MANDIRI', 'name' => 'Bank Mandiri', 'min' => 1, 'max' => null, 'increment' => 1],
    ];

    /** @var array<string, Bank>|null per-instance memo, keyed by code */
    private ?array $banks = null;

    public function __construct(
        private readonly XenditGateway $gateway,
        private readonly Cache $cache,
    ) {}

    /**
     * @return list<Bank> sorted by name
     */
    public function all(): array
    {
        return array_values($this->banks());
    }

    /**
     * @return Bank|null
     */
    public function find(?string $code): ?array
    {
        if ($code === null) {
            return null;
        }

        return $this->banks()[strtoupper(trim($code))] ?? null;
    }

    public function has(?string $code): bool
    {
        return $this->find($code) !== null;
    }

    /**
     * @return list<string>
     */
    public function codes(): array
    {
        return array_keys($this->banks());
    }

    public function nameFor(?string $code): ?string
    {
        return $this->find($code)['name'] ?? null;
    }

    /** Short label for lists: "Bank Negara Indonesia (BNI)" -> "BNI"; otherwise the full name. */
    public function shortNameFor(?string $code): string
    {
        $name = $this->nameFor($code) ?? preg_replace('/^ID_/', '', (string) $code);

        return preg_match('/\(([^)]+)\)\s*$/', $name, $m) ? $m[1] : $name;
    }

    /**
     * Per-bank amount limits for a Payout (used by the Withdrawal request).
     *
     * @return array{min: int, max: int|null, increment: int}
     */
    public function limitsFor(string $code): array
    {
        $bank = $this->find($code) ?? throw new InvalidArgumentException("Unknown bank channel code: {$code}");

        return ['min' => $bank['min'], 'max' => $bank['max'], 'increment' => $bank['increment']];
    }

    /**
     * Drop the cached list so the next read asks Xendit again.
     */
    public function refresh(): void
    {
        $this->cache->forget(self::CACHE_KEY);
        $this->banks = null;
    }

    /**
     * @return array<string, Bank>
     */
    private function banks(): array
    {
        return $this->banks ??= $this->keyByCode($this->load());
    }

    /**
     * @return list<Bank>
     */
    private function load(): array
    {
        $cached = $this->cache->get(self::CACHE_KEY);

        if (is_array($cached) && $cached !== []) {
            return $cached;
        }

        try {
            $banks = $this->normalize($this->gateway->listPayoutChannels('BANK'));

            if ($banks === []) {
                throw new \UnexpectedValueException('Xendit returned no IDR bank channels.');
            }

            $this->cache->put(self::CACHE_KEY, $banks, self::TTL_SECONDS);
            $this->cache->forever(self::LAST_GOOD_CACHE_KEY, $banks);

            return $banks;
        } catch (XenditException|\UnexpectedValueException $e) {
            $lastGood = $this->cache->get(self::LAST_GOOD_CACHE_KEY);
            $fallback = is_array($lastGood) && $lastGood !== [] ? $lastGood : self::BUILT_IN;

            Log::warning('Xendit bank channel list unavailable, using fallback', [
                'reason' => $e->getMessage(),
                'fallback' => $fallback === self::BUILT_IN ? 'built-in' : 'last-good',
            ]);

            $this->cache->put(self::CACHE_KEY, $fallback, self::FALLBACK_TTL_SECONDS);

            return $fallback;
        }
    }

    /**
     * @return list<Bank>
     */
    private function normalize(array $channels): array
    {
        $banks = [];

        foreach ($channels as $channel) {
            $code = strtoupper((string) ($channel['channel_code'] ?? ''));

            if (($channel['channel_category'] ?? 'BANK') !== 'BANK'
                || ($channel['currency'] ?? 'IDR') !== 'IDR'
                || preg_match('/^[A-Z0-9_]{1,64}$/', $code) !== 1) {
                continue;
            }

            $limits = is_array($channel['amount_limits'] ?? null) ? $channel['amount_limits'] : [];
            $name = trim((string) ($channel['channel_name'] ?? ''));

            $banks[] = [
                'code' => $code,
                'name' => $name !== '' ? $name : $code,
                'min' => max(1, (int) ceil((float) ($limits['minimum'] ?? 1))),
                'max' => isset($limits['maximum']) && is_numeric($limits['maximum']) ? (int) floor((float) $limits['maximum']) : null,
                'increment' => max(1, (int) ($limits['minimum_increment'] ?? 1)),
            ];
        }

        usort($banks, fn (array $a, array $b) => strcasecmp($a['name'], $b['name']));

        return $banks;
    }

    /**
     * @param  list<Bank>  $banks
     * @return array<string, Bank>
     */
    private function keyByCode(array $banks): array
    {
        $byCode = [];

        foreach ($banks as $bank) {
            $byCode[$bank['code']] ??= $bank;
        }

        return $byCode;
    }
}
