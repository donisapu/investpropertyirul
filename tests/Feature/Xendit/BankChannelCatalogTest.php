<?php

use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

function freshCatalog(): BankChannelCatalog
{
    app()->forgetScopedInstances();

    return app(BankChannelCatalog::class);
}

it('lists IDR banks from Xendit, sorted by name, with amount limits', function () {
    fakeBankChannels([
        ['channel_code' => 'ID_PERMATA', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Permata',
            'amount_limits' => ['minimum' => 1, 'maximum' => 999999999999, 'minimum_increment' => 1]],
        ['channel_code' => 'ID_BSI', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Syariah Indonesia',
            'amount_limits' => ['minimum' => 10000, 'maximum' => 1999999999999, 'minimum_increment' => 1]],
        ['channel_code' => 'ID_OVO', 'channel_category' => 'EWALLET', 'currency' => 'IDR', 'channel_name' => 'OVO'],
        ['channel_code' => 'PH_BDO', 'channel_category' => 'BANK', 'currency' => 'PHP', 'channel_name' => 'BDO'],
        ['channel_code' => 'bad code!', 'channel_category' => 'BANK', 'currency' => 'IDR'],
    ]);

    $catalog = freshCatalog();

    expect(array_column($catalog->all(), 'code'))->toBe(['ID_PERMATA', 'ID_BSI'])
        ->and($catalog->has('id_bsi'))->toBeTrue()
        ->and($catalog->has('ID_OVO'))->toBeFalse()
        ->and($catalog->nameFor('ID_BSI'))->toBe('Bank Syariah Indonesia')
        ->and($catalog->limitsFor('ID_BSI'))->toBe(['min' => 10000, 'max' => 1999999999999, 'increment' => 1]);

    Http::assertSent(fn ($request) => str_contains($request->url(), 'currency=IDR&channel_category=BANK'));
});

it('caches the list for a day', function () {
    fakeBankChannels();

    freshCatalog()->all();
    freshCatalog()->all();

    Http::assertSentCount(1);
    expect(Cache::get(BankChannelCatalog::CACHE_KEY))->toBeArray()
        ->and(Cache::get(BankChannelCatalog::LAST_GOOD_CACHE_KEY))->toBeArray();
});

it('falls back to the built-in 5 banks when Xendit is down and nothing was cached', function (Closure $failure) {
    Http::fake($failure);

    $catalog = freshCatalog();

    expect($catalog->codes())->toBe(['ID_BCA', 'ID_BNI', 'ID_BRI', 'ID_CIMB', 'ID_MANDIRI'])
        ->and($catalog->limitsFor('ID_CIMB')['min'])->toBe(10000);
})->with([
    'timeout' => [fn () => throw new ConnectionException('timed out')],
    '500' => [fn () => Http::response(['error_code' => 'SERVER_ERROR'], 500)],
    'forbidden key' => [fn () => Http::response(['error_code' => 'REQUEST_FORBIDDEN_ERROR'], 403)],
    'empty list' => [fn () => Http::response([])],
]);

it('falls back to the last good list when Xendit is down', function () {
    fakeBankChannels();
    freshCatalog()->all();

    // A day later the fresh cache expired and Xendit is down.
    Cache::forget(BankChannelCatalog::CACHE_KEY);
    Http::fake(fn () => Http::response(['error_code' => 'SERVER_ERROR'], 503));

    expect(freshCatalog()->codes())->toContain('ID_BSI', 'ID_PERMATA');
});

it('does not hammer Xendit while it is down', function () {
    $calls = 0;
    Http::fake(function () use (&$calls) {
        $calls++;

        return Http::response([], 503);
    });

    freshCatalog()->all();
    freshCatalog()->all();

    expect($calls)->toBe(1);
});

it('refuses limits for an unknown bank', function () {
    fakeBankChannels();

    expect(fn () => freshCatalog()->limitsFor('ID_UNKNOWN'))->toThrow(InvalidArgumentException::class);
});
