<?php

use App\Models\InvestmentPortfolio;
use App\Models\InvestmentTransaction;
use App\Models\Payment;
use App\Models\PropertyInvestment;
use Illuminate\Support\Facades\DB;
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

function seedPendingInvestmentPayment(): array
{
    $userId = DB::table('users')->insertGetId([
        'name' => 'Investor', 'email' => 'investor@example.com', 'password' => bcrypt('secret'),
        'created_at' => now(), 'updated_at' => now(),
    ]);
    $propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Villa A', 'property_location' => 'Bali', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Villa', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    $investmentId = DB::table('property_investments')->insertGetId([
        'property_id' => $propertyId, 'asset_price' => 1000000, 'total_investment_value' => 1000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 10000, 'total_lot' => 100,
        'sold_lot' => 10, 'min_lot_size' => 1, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]);
    $paymentId = DB::table('payments')->insertGetId([
        'user_id' => $userId, 'payable_type' => PropertyInvestment::class, 'payable_id' => $investmentId,
        'amount' => 50000, 'external_id' => 'INV-TEST-1', 'status' => 'PENDING', 'lot' => 5,
        'created_at' => now(), 'updated_at' => now(),
    ]);

    return compact('userId', 'investmentId', 'paymentId');
}

it('still processes a PAID invoice for an investment, once', function () {
    ['userId' => $userId, 'investmentId' => $investmentId, 'paymentId' => $paymentId] = seedPendingInvestmentPayment();

    $payload = ['id' => 'inv_1', 'external_id' => 'INV-TEST-1', 'status' => 'PAID', 'amount' => 50000];
    $headers = ['x-callback-token' => 'expected-token'];

    $this->postJson('/xendit/webhook', $payload, $headers)->assertOk()->assertJson(['message' => 'OK']);
    // Xendit may deliver the same webhook again; it must not be applied twice.
    $this->postJson('/xendit/webhook', $payload, $headers)->assertOk();

    expect(Payment::find($paymentId)->status)->toBe('PAID')
        ->and(DB::table('property_investments')->where('id', $investmentId)->value('sold_lot'))->toBe(15)
        ->and(InvestmentTransaction::where('payment_id', $paymentId)->count())->toBe(1)
        ->and(InvestmentPortfolio::where(['user_id' => $userId, 'investment_id' => $investmentId])->value('total_lot'))->toBe(5);
});

it('marks an expired invoice without touching the investment', function () {
    ['investmentId' => $investmentId, 'paymentId' => $paymentId] = seedPendingInvestmentPayment();

    $this->postJson('/xendit/webhook', ['external_id' => 'INV-TEST-1', 'status' => 'EXPIRED'], ['x-callback-token' => 'expected-token'])
        ->assertOk();

    expect(Payment::find($paymentId)->status)->toBe('EXPIRED')
        ->and(DB::table('property_investments')->where('id', $investmentId)->value('sold_lot'))->toBe(10)
        ->and(InvestmentTransaction::count())->toBe(0);
});

it('no longer exposes the duplicate api invoice callback', function () {
    $this->postJson('/api/xendit/callback/invoice', ['external_id' => 'x'])->assertNotFound();
});
