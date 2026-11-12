<?php

namespace App\Console\Commands;

use App\Services\Sale\SaleBookingService;
use Illuminate\Console\Command;

/** Backup for the EXPIRED webhook: closes pending bookings whose invoice ran out (B6). */
class ExpireSaleBookings extends Command
{
    protected $signature = 'sales:expire-bookings';

    protected $description = 'Mark pending booking fees past their invoice expiry as expired';

    public function handle(SaleBookingService $bookings): int
    {
        $this->info($bookings->expireOverdue().' booking(s) expired.');

        return self::SUCCESS;
    }
}
