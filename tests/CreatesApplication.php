<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;
use RuntimeException;

trait CreatesApplication
{
    /**
     * Creates the application.
     */
    public function createApplication(): Application
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        $this->guardAgainstNonTestDatabase($app);

        return $app;
    }

    /**
     * RefreshDatabase wipes whatever database it connects to. Refuse to run
     * unless the app is clearly pointed at a throwaway test database.
     */
    protected function guardAgainstNonTestDatabase(Application $app): void
    {
        if ($app->configurationIsCached()) {
            throw new RuntimeException(
                'Refusing to run tests with a cached config (bootstrap/cache/config.php) — it ignores phpunit.xml/.env.testing '
                .'and may point at the dev database. Run `php artisan config:clear` first.'
            );
        }

        if (! $app->environment('testing')) {
            throw new RuntimeException('Refusing to run tests: APP_ENV must be "testing", got "'.$app->environment().'".');
        }

        $connection = $app['config']->get('database.default');
        $config = $app['config']->get("database.connections.{$connection}", []);
        $driver = $config['driver'] ?? null;
        $database = (string) ($config['database'] ?? '');

        $isInMemorySqlite = $driver === 'sqlite' && $database === ':memory:';
        // A connection URL overrides "database", so its name cannot be trusted here.
        $isNamedTestDatabase = empty($config['url'])
            && preg_match('/_(test|testing)$/', $database) === 1;

        if (! $isInMemorySqlite && ! $isNamedTestDatabase) {
            throw new RuntimeException(sprintf(
                'Refusing to run tests against database "%s" (connection "%s", driver "%s"). '
                .'Use sqlite :memory: or a database whose name ends in "_test" / "_testing".',
                $database,
                $connection,
                $driver ?? 'unknown',
            ));
        }
    }
}
