<?php

namespace App\Providers;

use App\Models\CrowdfundingFinancial;
use App\Observers\CrowdfundingFinancialObserver;
use App\Services\Xendit\XenditGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Not a singleton: reads config('xendit.*') at resolve time so config changes (and tests) apply.
        $this->app->bind(XenditGateway::class, fn ($app) => XenditGateway::fromConfig($app['config']->get('xendit', [])));
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
