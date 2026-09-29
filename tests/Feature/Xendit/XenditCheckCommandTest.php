<?php

use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Http::preventStrayRequests();
    config(['xendit.secret_key' => 'xnd_development_test_key', 'xendit.callback_token' => 'token']);
});

it('passes when every read-only probe succeeds', function () {
    Http::fake([
        'api.xendit.co/balance*' => Http::response(['balance' => 5000000]),
        'api.xendit.co/payouts_channels*' => Http::response([['channel_code' => 'ID_BCA']]),
        'api.xendit.co/transactions*' => Http::response(['has_more' => false, 'data' => []]),
    ]);

    $this->artisan('xendit:check')
        ->expectsOutputToContain('sandbox key')
        ->expectsOutputToContain('Balance Read (CASH): Rp 5.000.000')
        ->expectsOutputToContain('1 IDR bank channels')
        ->assertSuccessful();

    Http::assertNotSent(fn ($request) => $request->method() !== 'GET');
});

it('fails and names the missing permission', function () {
    Http::fake([
        'api.xendit.co/balance*' => Http::response(['error_code' => 'REQUEST_FORBIDDEN_ERROR', 'message' => 'Forbidden'], 403),
        '*' => Http::response([]),
    ]);

    $this->artisan('xendit:check')
        ->expectsOutputToContain('REQUEST_FORBIDDEN_ERROR (key is missing this permission)')
        ->assertFailed();
});

it('fails without calling Xendit when config is empty', function () {
    config(['xendit.secret_key' => '', 'xendit.callback_token' => '']);
    Http::fake();

    $this->artisan('xendit:check')
        ->expectsOutputToContain('XENDIT_SECRET_KEY is empty')
        ->assertFailed();

    Http::assertNothingSent();
});
