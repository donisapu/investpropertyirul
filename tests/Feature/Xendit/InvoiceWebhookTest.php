<?php

use Illuminate\Support\Facades\Log;

beforeEach(function () {
    config(['xendit.callback_token' => 'expected-token']);
});

it('acknowledges an invoice webhook for an unknown external_id with 200', function () {
    Log::spy();

    $this->postJson('/xendit/webhook', [
        'id' => '579c8d61f23fa4ca35e52da4',
        'external_id' => 'invoice_123124123',
        'status' => 'PAID',
    ], ['x-callback-token' => 'expected-token'])
        ->assertOk()
        ->assertJson(['message' => 'Ignored: unknown external_id']);

    Log::shouldHaveReceived('warning')->withArgs(fn ($message, $context) => $context['external_id'] === 'invoice_123124123')->once();
});

it('acknowledges a payload without external_id instead of erroring', function () {
    $this->postJson('/xendit/webhook', ['status' => 'PAID'], ['x-callback-token' => 'expected-token'])
        ->assertOk();
});

it('rejects a wrong or missing callback token', function (array $headers) {
    $this->postJson('/xendit/webhook', ['external_id' => 'x'], $headers)->assertForbidden();
})->with([
    'wrong token' => [['x-callback-token' => 'nope']],
    'missing token' => [[]],
]);

it('rejects every request when no callback token is configured', function () {
    config(['xendit.callback_token' => '']);

    $this->postJson('/xendit/webhook', ['external_id' => 'x'])->assertForbidden();
    $this->postJson('/xendit/webhook', ['external_id' => 'x'], ['x-callback-token' => ''])->assertForbidden();
});
