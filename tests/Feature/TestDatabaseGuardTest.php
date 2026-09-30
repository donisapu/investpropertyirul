<?php

use Illuminate\Support\Facades\DB;

it('runs the suite on a test database, never the dev database', function () {
    // phpunit.xml: in-memory sqlite. phpunit.pgsql.xml: invest_test.
    $database = DB::connection()->getDatabaseName();

    DB::connection()->getDriverName() === 'sqlite'
        ? expect($database)->toBe(':memory:')
        : expect($database)->toEndWith('_test');
});

it('refuses to boot tests against a non-test database', function (array $connection) {
    config(['database.default' => 'guard_probe', 'database.connections.guard_probe' => $connection]);

    expect(fn () => $this->guardAgainstNonTestDatabase($this->app))->toThrow(RuntimeException::class);
})->with([
    'dev postgres' => [['driver' => 'pgsql', 'database' => 'invest']],
    'sqlite file' => [['driver' => 'sqlite', 'database' => '/tmp/database.sqlite']],
    'test name but url override' => [['driver' => 'pgsql', 'database' => 'invest_test', 'url' => 'postgres://u:p@h/invest']],
]);

it('allows a dedicated *_test database', function () {
    config(['database.default' => 'guard_probe', 'database.connections.guard_probe' => ['driver' => 'pgsql', 'database' => 'invest_test']]);

    $this->guardAgainstNonTestDatabase($this->app);

    expect(true)->toBeTrue();
});
