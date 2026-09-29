<?php

namespace App\Console\Commands;

use App\Services\Xendit\Exceptions\XenditException;
use App\Services\Xendit\TransactionMirror;
use Illuminate\Console\Command;

class SyncXenditTransactions extends Command
{
    protected $signature = 'xendit:sync-transactions {--pages=40 : Max pages of 50 per run}';

    protected $description = 'Pull new and changed Xendit transactions into the local mirror';

    public function handle(TransactionMirror $mirror): int
    {
        try {
            $result = $mirror->sync(max(1, (int) $this->option('pages')));
        } catch (XenditException $e) {
            $this->error('Xendit could not be read: '.$e->getMessage());

            return self::FAILURE;
        }

        if ($result['skipped'] ?? false) {
            $this->warn('Another sync is running; skipped.');

            return self::SUCCESS;
        }

        $this->info(sprintf(
            'Synced %d page(s): %d new, %d updated, %d unchanged%s.',
            $result['pages'], $result['created'], $result['updated'], $result['unchanged'],
            $result['complete'] ? '' : ' (more pending, continues next run)',
        ));

        return self::SUCCESS;
    }
}
