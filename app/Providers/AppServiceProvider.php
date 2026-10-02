<?php

namespace App\Providers;

use App\Services\Xendit\BankChannelCatalog;
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

        // Scoped: one memoized bank list per request / job.
        $this->app->scoped(BankChannelCatalog::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
