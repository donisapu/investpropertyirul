<?php

use App\Models\PropertyAuction;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    $this->admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $this->admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    $this->propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Rumah Lelang', 'property_location' => 'Bandung', 'bedroom' => 3, 'bathroom' => 2, 'property_type' => 'Rumah',
        'land_area' => 120, 'building_area' => 90, 'map_url' => 'https://maps.example', 'created_at' => now(), 'updated_at' => now(),
    ]);
});

function auctionRow(int $propertyId, array $overrides = []): int
{
    return DB::table('property_auctions')->insertGetId(array_merge([
        'property_id' => $propertyId, 'open_bid' => 500000000, 'bid_increment' => 5000000, 'market_value' => 800000000,
        'date_start' => now()->subDay()->toDateString(), 'date_finish' => now()->addWeek()->toDateString(),
        'status' => 'active', 'created_at' => now(), 'updated_at' => now(),
    ], $overrides));
}

function auctionForm(int $propertyId, array $overrides = []): array
{
    return array_merge([
        'property_id' => $propertyId, 'open_bid' => 500000000, 'bid_increment' => 5000000, 'market_value' => 800000000,
        'date_start' => now()->toDateString(), 'date_finish' => now()->addWeek()->toDateString(), 'status' => 'active', 'type' => 'cessie',
    ], $overrides);
}

it('accepts only auction / cessie and defaults to auction', function () {
    $id = auctionRow($this->propertyId);
    expect(DB::table('property_auctions')->where('id', $id)->value('type'))->toBe('auction');

    auctionRow($this->propertyId, ['type' => 'cessie']);
    expect(fn () => auctionRow($this->propertyId, ['type' => 'Lelang']))->toThrow(QueryException::class);
});

it('converts the old Lelang / Cessie values', function () {
    $migration = require database_path('migrations/2026_09_30_090000_normalize_property_auction_types.php');

    $migration->down(); // the old schema: Lelang / Cessie
    $lelang = auctionRow($this->propertyId, ['type' => 'Lelang']);
    $cessie = auctionRow($this->propertyId, ['type' => 'Cessie']);
    $migration->up();

    expect(DB::table('property_auctions')->where('id', $lelang)->value('type'))->toBe('auction')
        ->and(DB::table('property_auctions')->where('id', $cessie)->value('type'))->toBe('cessie');
    expect(fn () => auctionRow($this->propertyId, ['type' => 'Cessie']))->toThrow(QueryException::class);
});

it('lets an admin create and edit an auction of each type', function () {
    $this->actingAs($this->admin)->post(route('admin.auction-properties.store'), auctionForm($this->propertyId, ['type' => 'cessie']))
        ->assertRedirect(route('admin.auction-properties'))->assertSessionHasNoErrors();

    $auction = PropertyAuction::sole();
    expect($auction->type)->toBe('cessie')->and($auction->type_label)->toBe('Cessie');

    $this->actingAs($this->admin)->put(route('admin.auction-properties.update', $auction->id), auctionForm($this->propertyId, ['type' => 'auction']))
        ->assertSessionHasNoErrors();

    expect($auction->fresh()->type)->toBe('auction')->and($auction->fresh()->type_label)->toBe('Lelang');
});

it('rejects the old or unknown values from the form', function (array $input, string $field) {
    $this->actingAs($this->admin)->post(route('admin.auction-properties.store'), auctionForm($this->propertyId, $input))
        ->assertSessionHasErrors($field);

    expect(PropertyAuction::count())->toBe(0);
})->with([
    'old Lelang' => [['type' => 'Lelang'], 'type'],
    'old Cessie' => [['type' => 'Cessie'], 'type'],
    'status not in the enum' => [['status' => 'running'], 'status'],
]);

it('shows the type labels in the admin form and table', function () {
    $id = auctionRow($this->propertyId, ['type' => 'cessie']);

    $this->actingAs($this->admin)->get(route('admin.auction-properties.edit', $id))
        ->assertOk()
        ->assertSee('<option value="cessie" selected>Cessie</option>', false)
        ->assertSee('<option value="auction" >Lelang</option>', false);

    $this->actingAs($this->admin)->getJson(route('admin.auction-properties.data'))
        ->assertOk()->assertJsonPath('data.0.type_label', 'Cessie');
});

it('gives the public pages the value and the label', function () {
    auctionRow($this->propertyId, ['type' => 'cessie']);

    $this->get(route('auctions.index'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('auctions.data.0.type', 'cessie')->where('auctions.data.0.type_label', 'Cessie'));

    $this->get(route('property-for-sale.index', ['category' => 'auction']))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('properties.data.0.cek', 'cessie')->where('properties.data.0.ownership', 'Auction / Cessie'));
});
