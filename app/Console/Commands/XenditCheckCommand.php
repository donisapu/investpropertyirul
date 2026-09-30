<?php

namespace App\Console\Commands;

use App\Services\Xendit\Exceptions\XenditException;
use App\Services\Xendit\Exceptions\XenditRejectedException;
use App\Services\Xendit\XenditGateway;
use Illuminate\Console\Command;

/**
 * Read-only check of the Xendit setup (XW-02). Never creates a payout or moves money.
 */
class XenditCheckCommand extends Command
{
    protected $signature = 'xendit:check';

    protected $description = 'Verify Xendit config and API key permissions with read-only calls';

    public function handle(XenditGateway $gateway): int
    {
        $ok = $this->checkConfig();

        if (! $ok) {
            return self::FAILURE;
        }

        $ok = $this->probe('Balance Read (CASH)', fn () => 'Rp '.number_format($gateway->getBalance(XenditGateway::BALANCE_CASH), 0, ',', '.'))
            && $ok;
        $ok = $this->probe('Balance Read (HOLDING)', fn () => 'Rp '.number_format($gateway->getBalance(XenditGateway::BALANCE_HOLDING), 0, ',', '.'))
            && $ok;
        $ok = $this->probe('Money-out Read (payout channels)', fn () => count($gateway->listPayoutChannels()).' IDR bank channels')
            && $ok;
        $ok = $this->probe('Transaction Read', fn () => count($gateway->listTransactions(null, ['limit' => 1])['data']).' row(s) on first page')
            && $ok;

        $this->newLine();
        $this->line('Not checked (would need a real request): Money-out Write, Money-in Read, webhook URLs.');

        return $ok ? self::SUCCESS : self::FAILURE;
    }

    private function checkConfig(): bool
    {
        $key = trim((string) config('xendit.secret_key'));
        $token = trim((string) config('xendit.callback_token'));
        $ok = true;

        if ($key === '') {
            $this->error('✗ XENDIT_SECRET_KEY is empty.');
            $ok = false;
        } elseif (str_starts_with($key, 'xnd_production_')) {
            $this->warn('! XENDIT_SECRET_KEY is a LIVE key (xnd_production_). Real money will move.');
        } elseif (str_starts_with($key, 'xnd_development_')) {
            $this->info('✓ XENDIT_SECRET_KEY is a sandbox key.');
        } else {
            $this->error('✗ XENDIT_SECRET_KEY does not look like a Xendit secret key (xnd_development_… / xnd_production_…).');
            $ok = false;
        }

        if ($token === '') {
            $this->error('✗ XENDIT_CALLBACK_TOKEN is empty (Dashboard → Settings → Webhooks → verification token).');
            $ok = false;
        } else {
            $this->info('✓ XENDIT_CALLBACK_TOKEN is set.');
        }

        if (app()->configurationIsCached()) {
            $this->warn('! Config is cached; run `php artisan config:clear` after editing .env.');
        }

        return $ok;
    }

    private function probe(string $label, callable $call): bool
    {
        try {
            $this->info("✓ {$label}: ".$call());

            return true;
        } catch (XenditRejectedException $e) {
            $hint = match ($e->errorCode) {
                'INVALID_API_KEY' => 'key is wrong or revoked',
                'REQUEST_FORBIDDEN_ERROR' => 'key is missing this permission',
                default => $e->errorMessage,
            };
            $this->error("✗ {$label}: {$e->errorCode} ({$hint})");
        } catch (XenditException $e) {
            $this->error("✗ {$label}: could not reach Xendit ({$e->getMessage()})");
        }

        return false;
    }
}
