<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "uses()" function to bind a different classes or traits.
|
*/

uses(TestCase::class, RefreshDatabase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Fake Xendit GET /payouts_channels with the given IDR bank channels.
 */
function fakeBankChannels(?array $channels = null): void
{
    $channels ??= [
        ['channel_code' => 'ID_BCA', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Central Asia (BCA)',
            'amount_limits' => ['minimum' => 1, 'maximum' => 999999999999, 'minimum_increment' => 1]],
        ['channel_code' => 'ID_BSI', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Syariah Indonesia (BSI)',
            'amount_limits' => ['minimum' => 10000, 'maximum' => 1999999999999, 'minimum_increment' => 1]],
        ['channel_code' => 'ID_PERMATA', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Permata',
            'amount_limits' => ['minimum' => 1, 'maximum' => 999999999999, 'minimum_increment' => 1]],
    ];

    \Illuminate\Support\Facades\Http::fake(['api.xendit.co/payouts_channels*' => \Illuminate\Support\Facades\Http::response($channels)]);
}
