<?php

use App\Models\Campaign;
use App\Models\Role;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

/*
 * gainproperties.id runs Sale + Auction only: Investment and Crowdfunding are hidden behind
 * config/features.php. phpunit.xml turns both on for the rest of the suite; these tests turn
 * them off (or one of them) and check nothing of the hidden product is reachable or shown.
 */

beforeEach(function () {
    $this->withoutVite();
    fakeBankChannels();
    config(['features.investment' => false, 'features.crowdfunding' => false]);

    $this->member = User::forceCreate([
        'name' => 'Member', 'email' => uniqid('ff').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $this->member->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    $this->admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('ffa').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $this->admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
});

function flagsProperty(): int
{
    return DB::table('properties')->insertGetId([
        'property_name' => 'Margasari', 'property_location' => 'Karawang', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Rumah', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
}

function flagsInvestment(): int
{
    return DB::table('property_investments')->insertGetId([
        'property_id' => flagsProperty(), 'asset_price' => 10000000, 'total_investment_value' => 10000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 100000, 'total_lot' => 100,
        'sold_lot' => 10, 'min_lot_size' => 2, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]);
}

function flagsCampaignFor(int $propertyId): Campaign
{
    return Campaign::create([
        'property_id' => $propertyId, 'title' => 'Promo', 'discount_percent' => 10,
        'start_date' => now()->subDay(), 'end_date' => now()->addDay(), 'status' => 'active',
    ]);
}

it('answers 404 on every public investment and crowdfunding page', function (string $uri) {
    $this->get($uri)->assertNotFound();
})->with([
    '/investments', '/investments/1', '/investments/purchase/1', '/investments/sell/1',
    '/crowdfunding', '/crowdfunding/project', '/crowdfunding/1', '/crowdfunding/purchase/1',
    '/how-to-invest',
]);

it('keeps sale and auction pages open', function (string $uri) {
    $this->get($uri)->assertOk();
})->with(['/', '/property-for-sale', '/auctions']);

it('refuses investment payments and lot sales without reaching Xendit', function () {
    $this->mock(XenditService::class, fn ($mock) => $mock->shouldNotReceive('createInvoice'));
    $investment = flagsInvestment();

    $this->actingAs($this->member)->post(route('user.payment.investment', $investment), ['lot' => 2])->assertNotFound();
    $this->actingAs($this->member)->post(route('user.payment.crowdfunding', 1), ['amount' => 1000000])->assertNotFound();
    $this->actingAs($this->member)->post(route('user.sell.investment', 1), ['lot' => 1])->assertNotFound();
    $this->actingAs($this->member)->get(route('user.portfolio'))->assertNotFound();

    expect(DB::table('payments')->count())->toBe(0);
});

it('hides the investment and crowdfunding admin pages', function (string $routeName) {
    $this->actingAs($this->admin)->get(route($routeName))->assertNotFound();
})->with(['admin.investment-properties', 'admin.financials', 'admin.sell-request', 'admin.crowdfunding-properties', 'admin.cw_financials']);

it('drops Investment and Crowdfunding from the admin sidebar', function () {
    $html = $this->actingAs($this->admin)->get(route('admin.withdrawal-settings.edit'))->assertOk()->getContent();

    expect($html)->not->toContain('>Investment<')
        ->and($html)->not->toContain('>Crowdfunding<')
        ->and($html)->toContain('>Property For Sale<')
        ->and($html)->toContain('>Auctions<');
});

it('shares the flags with the frontend and drops campaigns of hidden products', function () {
    $investment = flagsInvestment();
    $campaign = flagsCampaignFor(DB::table('property_investments')->where('id', $investment)->value('property_id'));

    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->where('features', ['investment' => false, 'crowdfunding' => false])
        ->where('campaigns', [])
    );

    $this->get(route('campaigns.detail', $campaign))->assertNotFound();
});

it('shows a campaign again once its product is back on', function () {
    config(['features.investment' => true]);
    $investment = flagsInvestment();
    flagsCampaignFor(DB::table('property_investments')->where('id', $investment)->value('property_id'));

    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->where('features.investment', true)
        ->has('campaigns', 1)
    );
});

it('opens only the product that is switched on', function () {
    config(['features.crowdfunding' => true]);

    $this->get('/crowdfunding')->assertOk();
    $this->get('/how-to-invest')->assertOk();
    $this->get('/investments')->assertNotFound();
});

it('leaves hidden products out of the old blade header', function () {
    // The blade member pages read the site settings row the seeder normally creates.
    \Illuminate\Support\Facades\Cache::forget('website_settings');
    DB::table('website_settings')->insert(['site_name' => 'GAIN Properties', 'created_at' => now(), 'updated_at' => now()]);

    // No route renders the blade member layout any more; render it as a signed-in member.
    $this->actingAs($this->member);
    $html = view('user.layout')->render();

    expect($html)->not->toContain('INVESTMENT')
        ->and($html)->not->toContain('CROWDFUNDING')
        ->and($html)->not->toContain('HOW TO INVEST')
        ->and($html)->not->toContain(route('user.portfolio'))
        ->and($html)->toContain(route('user.profile.edit'));
});
