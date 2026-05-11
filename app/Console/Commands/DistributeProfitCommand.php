<?php

namespace App\Console\Commands;

use App\Models\PropertyFinancial;
use App\Services\DistributeProfitService;
use Illuminate\Console\Command;

class DistributeProfitCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */

    protected $signature = 'profit:distribute';
    protected $description = 'Distribute profit to investors';

    /**
     * The console command description.
     *
     * @var string
     */

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $financials = PropertyFinancial::where('status', 'FINAL')
            ->where('is_distributed', false)
            ->get();

        if ($financials->isEmpty()) {
            $this->info('Gak ada profit yang siap dibagikan, bre.');
            return;
        }

        foreach ($financials as $financial) {
            $this->info("Lagi bagi profit buat ID: {$financial->id}...");
            app(DistributeProfitService::class)->handle($financial);
            $this->info("Kelarrr!");
        }
    }
}
