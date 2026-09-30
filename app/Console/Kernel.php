<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('profit:distribute')->monthlyOn(1, '00:00')->runInBackground();
        // Xendit Transactions mirror (XW-08); webhooks keep it fresher in between.
        $schedule->command('xendit:sync-transactions')->everyTenMinutes()->withoutOverlapping(15);
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
