<?php

use App\Models\Payment;
use App\Models\Role;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Xendit\Invoice\Invoice;

beforeEach(function () {
    $this->withoutVite();
    $this->investor = User::forceCreate([
        'name' => 'Investor', 'email' => uniqid('pg').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $this->investor->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    // Every accepted payment reaches Xendit; every rejected one must not.
    $this->invoices = [];
    $this->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')
        ->andReturnUsing(function ($externalId, $amount) {
            $this->invoices[] = $amount;

            return new Invoice(['invoice_url' => 'https://checkout-staging.xendit.co/web/inv_1']);
        }));
});

function guardProperty(): int
{
    return DB::table('properties')->insertGetId([
        'property_name' => 'Margasari', 'property_location' => 'Karawang', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Rumah', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
}

// Lots of 100.000; 1-50 per purchase; 100 lots of which 10 sold.
function guardInvestment(array $overrides = []): object
{
    $id = DB::table('property_investments')->insertGetId(array_merge([
        'property_id' => guardProperty(), 'asset_price' => 10000000, 'total_investment_value' => 10000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 100000, 'total_lot' => 100,
        'sold_lot' => 10, 'min_lot_size' => 2, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ], $overrides));

    return DB::table('property_investments')->find($id);
}

// Goal 100jt of which 90jt collected; minimum 1jt.
function guardCrowdfunding(array $overrides = []): object
{
    $id = DB::table('property_crowdfundings')->insertGetId(array_merge([
        'property_id' => guardProperty(), 'funding_goal' => 100000000, 'min_contribution' => 1000000,
        'estimated_roi' => 12, 'collected_amount' => 90000000, 'tenor' => 12, 'status' => 'Open',
        'created_at' => now(), 'updated_at' => now(),
    ], $overrides));

    return DB::table('property_crowdfundings')->find($id);
}

// 10% off, running today.
function guardCampaign(int $propertyId, array $overrides = []): int
{
    return DB::table('campaigns')->insertGetId(array_merge([
        'property_id' => $propertyId, 'title' => 'Promo', 'discount_percent' => 10,
        'start_date' => now()->subDay()->toDateString(), 'end_date' => now()->addDay()->toDateString(),
        'status' => 'active', 'created_at' => now(), 'updated_at' => now(),
    ], $overrides));
}

function buyLots(object $investment, array $data)
{
    return test()->actingAs(test()->investor)->from('/investments/purchase/'.$investment->property_id)
        ->post(route('user.payment.investment', $investment->property_id), $data);
}

function fund(object $crowdfunding, array $data)
{
    return test()->actingAs(test()->investor)->from('/crowdfunding/purchase/'.$crowdfunding->id)
        ->post(route('user.payment.crowdfunding', $crowdfunding->id), $data);
}

// PF-01: campaign discount

it('charges the discounted lot price of an active campaign', function () {
    $investment = guardInvestment();
    $campaignId = guardCampaign($investment->property_id);

    buyLots($investment, ['lot' => 3, 'campaign_id' => $campaignId])->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');

    expect($this->invoices)->toBe([270000])
        ->and((int) Payment::sole()->amount)->toBe(270000)
        ->and(Payment::sole()->campaign_id)->toBe($campaignId);
});

it('charges full price when the campaign does not apply', function (array $campaign, bool $otherProperty) {
    $investment = guardInvestment();
    $campaignId = guardCampaign($otherProperty ? guardProperty() : $investment->property_id, $campaign);

    buyLots($investment, ['lot' => 3, 'campaign_id' => $campaignId])->assertRedirect();

    expect($this->invoices)->toBe([300000])->and(Payment::sole()->campaign_id)->toBeNull();
})->with([
    'expired' => [['start_date' => '2026-07-21', 'end_date' => '2026-08-17'], false],
    // Resolved when the test runs: the app timezone (WIB) is not set yet while datasets load.
    'not started' => [fn () => ['start_date' => now()->addDay()->toDateString(), 'end_date' => now()->addWeek()->toDateString()], false],
    'inactive' => [['status' => 'inactive'], false],
    'other property' => [[], true],
]);

it('charges full price without a campaign', function () {
    buyLots(guardInvestment(), ['lot' => 3])->assertRedirect();

    expect($this->invoices)->toBe([300000]);
});

it('shows the discount on the purchase page only while the campaign runs', function () {
    $investment = guardInvestment();
    $active = guardCampaign($investment->property_id);
    $expired = guardCampaign($investment->property_id, ['start_date' => '2026-07-21', 'end_date' => '2026-08-17']);

    $this->get('/investments/purchase/'.$investment->property_id.'?campaign_id='.$active)
        ->assertInertia(fn (Assert $page) => $page->where('property.financials.discounted_price_per_lot', 90000)
            ->where('property.campaign.id', $active));

    $this->get('/investments/purchase/'.$investment->property_id.'?campaign_id='.$expired)
        ->assertInertia(fn (Assert $page) => $page->where('property.financials.discount_percent', 0)
            ->where('property.campaign', null));
});

it('keeps a campaign on its own product when the property has both', function () {
    $investment = guardInvestment();
    $crowdfunding = guardCrowdfunding(['property_id' => $investment->property_id]);
    $campaignId = guardCampaign($investment->property_id); // targets the investment

    fund($crowdfunding, ['total_amount' => 900000, 'campaign_id' => $campaignId])
        ->assertSessionHasErrors('total_amount');
    expect($this->invoices)->toBe([]);
});

// PF-04: a discounted contribution is paid at the discounted price but counts in full (client, 2026-10-03).
it('charges the discounted price for a crowdfunding contribution and credits its full value', function () {
    config(['xendit.callback_token' => 'expected-token']);
    $crowdfunding = guardCrowdfunding();
    $campaignId = guardCampaign($crowdfunding->property_id);

    fund($crowdfunding, ['total_amount' => 1000000, 'campaign_id' => $campaignId])->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');

    $payment = Payment::sole();
    expect($this->invoices)->toBe([900000])
        ->and($payment)->campaign_id->toBe($campaignId)
        ->and((int) $payment->amount)->toBe(900000)
        ->and((int) $payment->credited_amount)->toBe(1000000);

    $this->postJson('/xendit/webhook', ['id' => 'inv_x', 'external_id' => $payment->external_id, 'status' => 'PAID'], ['x-callback-token' => 'expected-token'])
        ->assertOk();

    expect((int) DB::table('property_crowdfundings')->where('id', $crowdfunding->id)->value('collected_amount'))->toBe(91000000)
        ->and((int) DB::table('crowdfunding_portfolios')->where('user_id', $this->investor->id)->value('total_amount'))->toBe(1000000)
        ->and((int) DB::table('crowdfunding_transactions')->where('user_id', $this->investor->id)->value('amount'))->toBe(900000);
});

it('keeps the crowdfunding minimum at its full value under a campaign', function () {
    $crowdfunding = guardCrowdfunding();
    $campaignId = guardCampaign($crowdfunding->property_id);

    fund($crowdfunding, ['total_amount' => 900000, 'campaign_id' => $campaignId])
        ->assertSessionHasErrors(['total_amount' => 'Minimal partisipasi Rp 1.000.000.']);
    expect($this->invoices)->toBe([]);
});

it('reserves the credited value of an open discounted contribution', function () {
    $crowdfunding = guardCrowdfunding(['collected_amount' => 99000000]);
    $campaignId = guardCampaign($crowdfunding->property_id);
    fund($crowdfunding, ['total_amount' => 1000000, 'campaign_id' => $campaignId])->assertRedirect();

    fund($crowdfunding, ['total_amount' => 1000000])
        ->assertSessionHasErrors(['error' => 'Sisa target sedang dipesan investor lain. Coba lagi nanti.']);
    expect($this->invoices)->toBe([900000]);
});

it('drops expired campaigns from the shared props', function () {
    $investment = guardInvestment();
    $active = guardCampaign($investment->property_id);
    guardCampaign($investment->property_id, ['start_date' => '2026-07-21', 'end_date' => '2026-08-17']);

    $this->get('/investments')->assertInertia(fn (Assert $page) => $page->has('campaigns', 1)->where('campaigns.0.id', $active));
});

// PF-02: lot count

it('rejects a lot count outside the investment rules', function (array $data, string $message) {
    buyLots(guardInvestment(), $data)->assertSessionHasErrors(['lot' => $message]);

    expect(Payment::count())->toBe(0)->and($this->invoices)->toBe([]);
})->with([
    'missing' => [[], 'Jumlah lot wajib diisi.'],
    'text' => [['lot' => 'abc'], 'Jumlah lot harus bilangan bulat.'],
    'fraction' => [['lot' => 2.5], 'Jumlah lot harus bilangan bulat.'],
    'zero' => [['lot' => 0], 'Minimal pembelian 2 lot.'],
    'negative' => [['lot' => -5], 'Minimal pembelian 2 lot.'],
    'below min_lot_size' => [['lot' => 1], 'Minimal pembelian 2 lot.'],
    'above max_lot_size' => [['lot' => 51], 'Maksimal pembelian 50 lot.'],
]);

it('rejects more lots than are left', function () {
    buyLots(guardInvestment(['sold_lot' => 95]), ['lot' => 6])->assertSessionHasErrors(['lot' => 'Sisa lot tinggal 5.']);

    expect($this->invoices)->toBe([]);
});

it('sells the last lots', function () {
    buyLots(guardInvestment(['sold_lot' => 95]), ['lot' => 5])->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');

    expect($this->invoices)->toBe([500000]);
});

it('rejects a sold-out investment that is still Open', function () {
    buyLots(guardInvestment(['sold_lot' => 100]), ['lot' => 2])
        ->assertSessionHasErrors(['error' => 'Lot investasi ini sudah habis.']);

    expect($this->invoices)->toBe([]);
});

it('only sells Open investments', function (string $status) {
    buyLots(guardInvestment(['status' => $status]), ['lot' => 2])
        ->assertSessionHasErrors(['error' => 'Investasi ini sedang tidak dibuka untuk pembelian.']);

    expect($this->invoices)->toBe([]);
})->with(['Draft', 'FullyFunded', 'Running', 'Finished', 'Cancelled']);

// PF-04: crowdfunding amount

it('rejects a crowdfunding amount outside the rules', function (array $data, string $message) {
    fund(guardCrowdfunding(), $data)->assertSessionHasErrors(['total_amount' => $message]);

    expect(Payment::count())->toBe(0)->and($this->invoices)->toBe([]);
})->with([
    'missing' => [[], 'Nominal wajib diisi.'],
    'fraction' => [['total_amount' => 1000000.5], 'Nominal harus bilangan bulat (rupiah).'],
    'below min_contribution' => [['total_amount' => 999999], 'Minimal partisipasi Rp 1.000.000.'],
    'above remaining target' => [['total_amount' => 10000001], 'Sisa target pendanaan tinggal Rp 10.000.000.'],
]);

it('accepts the remaining target even when it is below the minimum', function () {
    fund(guardCrowdfunding(['collected_amount' => 99500000]), ['total_amount' => 500000])->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');

    expect($this->invoices)->toBe([500000]);
});

it('rejects a fully funded crowdfunding', function () {
    fund(guardCrowdfunding(['collected_amount' => 100000000]), ['total_amount' => 1000000])
        ->assertSessionHasErrors(['error' => 'Target pendanaan crowdfunding ini sudah terpenuhi.']);
});

it('only funds Open crowdfundings', function (string $status) {
    fund(guardCrowdfunding(['status' => $status]), ['total_amount' => 1000000])
        ->assertSessionHasErrors(['error' => 'Crowdfunding ini sedang tidak dibuka untuk pendanaan.']);

    expect($this->invoices)->toBe([]);
})->with(['Draft', 'Funded', 'Failed', 'Cancelled']);

// PF-05: Draft is not public

it('hides a Draft crowdfunding', function () {
    $open = guardCrowdfunding();
    $draft = guardCrowdfunding(['status' => 'Draft']);

    $this->get('/crowdfunding')->assertInertia(fn (Assert $page) => $page->where('properties.data', fn ($rows) => collect($rows)->pluck('crowdfunding_id')->all() === [$open->id]));
    $this->get('/crowdfunding/project')->assertInertia(fn (Assert $page) => $page->where('properties.data', fn ($rows) => collect($rows)->pluck('crowdfunding_id')->all() === [$open->id]));
    $this->get('/crowdfunding/'.$draft->id)->assertNotFound();
    $this->actingAs($this->investor)->get('/crowdfunding/purchase/'.$draft->id)->assertNotFound();
});

it('hides a Draft investment', function () {
    $open = guardInvestment();
    $draft = guardInvestment(['status' => 'Draft']);

    $this->get('/investments')->assertInertia(fn (Assert $page) => $page->where('properties.data', fn ($rows) => collect($rows)->pluck('investment_id')->all() === [$open->id]));
    $this->get('/investments/'.$draft->property_id)->assertNotFound();
    $this->actingAs($this->investor)->get('/investments/purchase/'.$draft->property_id)->assertNotFound();
});

// PF-03: one investment per property

it('allows one investment per property', function () {
    $investment = guardInvestment();

    expect(fn () => guardInvestment(['property_id' => $investment->property_id]))->toThrow(QueryException::class);
});

it('stops an admin from adding a second investment to a property', function () {
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    $investment = guardInvestment();
    $form = [
        'property_id' => $investment->property_id, 'asset_price' => 10000000, 'property_upgrades' => 0, 'notary_fee' => 0,
        'platform_fee' => 0, 'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 100000, 'total_lot' => 100,
        'min_lot_size' => 1, 'max_lot_size' => 50, 'roi_period_months' => 12, 'status' => 'Open',
    ];

    $this->actingAs($admin)->post(route('admin.investment-properties.store'), $form)
        ->assertSessionHasErrors(['property_id' => 'Properti ini sudah punya data investasi.']);

    $this->actingAs($admin)->put(route('admin.investment-properties.update', $investment->id), ['price_per_lot' => 120000] + $form)
        ->assertSessionHasNoErrors();
    expect((int) DB::table('property_investments')->where('id', $investment->id)->value('price_per_lot'))->toBe(120000);
});
