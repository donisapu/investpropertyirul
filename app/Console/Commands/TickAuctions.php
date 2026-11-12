<?php

namespace App\Console\Commands;

use App\Services\Auction\AuctionService;
use Illuminate\Console\Command;

/** Opens, closes and defaults auctions on time, and expires unpaid deposits (USE-CASES §C). */
class TickAuctions extends Command
{
    protected $signature = 'auctions:tick';

    protected $description = 'Open and close auctions on schedule, default unpaid settlements, expire unpaid deposits';

    public function handle(AuctionService $auctions): int
    {
        $done = $auctions->tick();
        $this->info(sprintf('%d opened, %d closed, %d defaulted, %d deposit(s) expired.', $done['opened'], $done['closed'], $done['defaulted'], $done['expired']));

        return self::SUCCESS;
    }
}
