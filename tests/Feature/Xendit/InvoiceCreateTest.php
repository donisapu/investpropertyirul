<?php

use App\Models\Payment;
use App\Models\PropertyCrowdfunding;
use App\Models\PropertyInvestment;
use App\Models\Role;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Xendit\Invoice\Invoice;

function invoiceInvestor(): User
{
    $user = User::forceCreate([
        'name' => 'Investor', 'email' => uniqid('inv').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    return $user;
}

function invoiceProperty(): int
{
    return DB::table('properties')->insertGetId([
        'property_name' => 'Margasari', 'property_location' => 'Karawang', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Rumah', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
}

// In production the crowdfunding id and its property id differ; force that here.
function invoiceCrowdfunding(): PropertyCrowdfunding
{
    $propertyId = invoiceProperty();
    DB::table('property_crowdfundings')->insert([
        'id' => $propertyId + 40, 'property_id' => $propertyId, 'funding_goal' => 100000000,
        'min_contribution' => 1000000, 'estimated_roi' => 12, 'collected_amount' => 0, 'tenor' => 12,
        'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]);

    return PropertyCrowdfunding::findOrFail($propertyId + 40);
}

function invoiceInvestment(): PropertyInvestment
{
    $id = DB::table('property_investments')->insertGetId([
        'property_id' => invoiceProperty(), 'asset_price' => 1000000, 'total_investment_value' => 1000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 10000, 'total_lot' => 100,
        'sold_lot' => 0, 'min_lot_size' => 1, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]);

    return PropertyInvestment::findOrFail($id);
}

function fakeInvoice(string $url = 'https://checkout-staging.xendit.co/web/inv_1'): void
{
    test()->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')
        ->andReturn(new Invoice(['invoice_url' => $url])));
}

function failingInvoice(): void
{
    test()->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')
        ->andThrow(new Exception('API_VALIDATION_ERROR')));
}

it('creates the crowdfunding invoice for the crowdfunding id the purchase page posts', function () {
    $crowdfunding = invoiceCrowdfunding();
    fakeInvoice();

    $this->actingAs(invoiceInvestor())
        ->post(route('user.payment.crowdfunding', $crowdfunding->id), ['total_amount' => 5000000])
        ->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');

    $payment = Payment::sole();
    expect($payment->payable_type)->toBe(PropertyCrowdfunding::class)
        ->and($payment->payable_id)->toBe($crowdfunding->id)
        ->and($payment->invoice_url)->toBe('https://checkout-staging.xendit.co/web/inv_1');
});

it('sends inertia visits to the invoice with a location response', function () {
    $crowdfunding = invoiceCrowdfunding();
    fakeInvoice();

    $this->actingAs(invoiceInvestor())
        ->post(route('user.payment.crowdfunding', $crowdfunding->id), ['total_amount' => 5000000], ['X-Inertia' => 'true'])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://checkout-staging.xendit.co/web/inv_1');
});

it('no longer resolves a crowdfunding by its property id', function () {
    $crowdfunding = invoiceCrowdfunding();
    fakeInvoice();

    $this->actingAs(invoiceInvestor())
        ->post(route('user.payment.crowdfunding', $crowdfunding->property_id), ['total_amount' => 5000000])
        ->assertNotFound();

    expect(Payment::count())->toBe(0);
});

it('returns the Xendit error to the page and drops the pending crowdfunding payment', function () {
    $crowdfunding = invoiceCrowdfunding();
    failingInvoice();
    Log::spy();

    $this->actingAs(invoiceInvestor())
        ->from('/crowdfunding/purchase/'.$crowdfunding->id)
        ->post(route('user.payment.crowdfunding', $crowdfunding->id), ['total_amount' => 5000000])
        ->assertRedirect('/crowdfunding/purchase/'.$crowdfunding->id)
        ->assertSessionHasErrors(['error' => 'Gagal membuat invoice: API_VALIDATION_ERROR']);

    expect(Payment::count())->toBe(0);
    Log::shouldHaveReceived('error')->withArgs(fn ($message) => str_contains($message, 'API_VALIDATION_ERROR'))->once();
});

it('creates the investment invoice for the property id', function () {
    $investment = invoiceInvestment();
    fakeInvoice();

    $this->actingAs(invoiceInvestor())
        ->post(route('user.payment.investment', $investment->property_id), ['lot' => 5])
        ->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');

    expect(Payment::sole()->payable_id)->toBe($investment->id)
        ->and((int) Payment::sole()->amount)->toBe(50000);
});

it('answers 404 instead of 500 for an unknown investment property', function () {
    fakeInvoice();

    $this->actingAs(invoiceInvestor())
        ->post(route('user.payment.investment', 999), ['lot' => 5])
        ->assertNotFound();
});

it('returns the Xendit error to the page and drops the pending investment payment', function () {
    $investment = invoiceInvestment();
    failingInvoice();

    $this->actingAs(invoiceInvestor())
        ->from('/investments/purchase/'.$investment->property_id)
        ->post(route('user.payment.investment', $investment->property_id), ['lot' => 5])
        ->assertRedirect('/investments/purchase/'.$investment->property_id)
        ->assertSessionHasErrors(['error' => 'Terjadi kesalahan: API_VALIDATION_ERROR']);

    expect(Payment::count())->toBe(0);
});
