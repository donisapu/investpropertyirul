<?php

use App\Models\InvestmentTransaction;
use App\Models\PropertyInvestment;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->withoutVite();
    $this->investor = User::forceCreate([
        'name' => 'Seller', 'email' => uniqid('sell').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $this->investor->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    $propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Villa Jual', 'property_location' => 'Bali', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Villa', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    $this->investment = PropertyInvestment::findOrFail(DB::table('property_investments')->insertGetId([
        'property_id' => $propertyId, 'asset_price' => 1000000, 'total_investment_value' => 1000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 10000, 'total_lot' => 100,
        'sold_lot' => 10, 'min_lot_size' => 1, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]));
    DB::table('investment_portfolios')->insert([
        'user_id' => $this->investor->id, 'investment_id' => $this->investment->id, 'total_lot' => 10,
        'created_at' => now(), 'updated_at' => now(),
    ]);
});

function sellLots(int $lot)
{
    return test()->actingAs(test()->investor)
        ->post(route('user.sell.investment', test()->investment->property_id), ['lot' => $lot]);
}

it('sends the investor back to the portfolio once the sell request is filed', function () {
    sellLots(4)
        ->assertRedirect(route('user.portfolio'))
        ->assertSessionHas('success', 'Permintaan jual 4 lot (Rp 40.000) terkirim. Dana masuk ke wallet setelah disetujui admin.');

    $sell = InvestmentTransaction::sole();
    expect($sell)->type->toBe('SELL')->status->toBe('PENDING')
        ->and((int) $sell->lot)->toBe(4)
        ->and((int) $sell->amount)->toBe(40000);
});

it('refuses more lots than are left after pending sells, as a form error', function () {
    sellLots(7);

    sellLots(4)->assertSessionHasErrors(['lot' => 'Lot tidak cukup atau sedang dalam proses penjualan.']);

    expect(InvestmentTransaction::count())->toBe(1);
});

it('opens the sell page the portfolio links to', function () {
    $this->actingAs($this->investor)
        ->get(route('investments.sell', $this->investment->property_id))
        ->assertOk();
});
