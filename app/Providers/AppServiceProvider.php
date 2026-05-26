<?php

namespace App\Providers;

use App\Models\CrowdfundingFinancial;
use App\Observers\CrowdfundingFinancialObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Daftarkan Observer di sini bre
        CrowdfundingFinancial::observe(CrowdfundingFinancialObserver::class);
    }
}
