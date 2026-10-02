<?php

use App\Models\CrowdfundingFinancial;
use App\Models\PropertyFinancial;
use App\Models\Role;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

function historyInvestor(): User
{
    $user = User::forceCreate([
        'name' => 'Citra', 'email' => uniqid('th').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    return $user;
}

function historyProperty(string $name): int
{
    return DB::table('properties')->insertGetId([
        'property_name' => $name, 'property_location' => 'Bandung', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Rumah', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
}

function historySeed(User $user): void
{
    $investmentId = DB::table('property_investments')->insertGetId([
        'property_id' => historyProperty('bukit dago'), 'asset_price' => 1000000, 'total_investment_value' => 1000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 10000, 'total_lot' => 100,
        'sold_lot' => 10, 'min_lot_size' => 1, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]);
    $crowdfundingId = DB::table('property_crowdfundings')->insertGetId([
        'property_id' => historyProperty('margasari'), 'funding_goal' => 100000000, 'min_contribution' => 1000000,
        'estimated_roi' => 12, 'collected_amount' => 1000000, 'tenor' => 12, 'status' => 'Open',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    $paymentId = DB::table('payments')->insertGetId([
        'user_id' => $user->id, 'payable_type' => 'x', 'payable_id' => 1, 'amount' => 1000000,
        'external_id' => uniqid('INV-'), 'status' => 'PAID', 'created_at' => now(), 'updated_at' => now(),
    ]);

    $tx = ['user_id' => $user->id, 'investment_id' => $investmentId, 'price_per_lot' => 10000, 'created_at' => now(), 'updated_at' => now()];
    DB::table('investment_transactions')->insert([
        $tx + ['type' => 'BUY', 'status' => 'APPROVED', 'lot' => 10, 'amount' => 100000, 'transacted_at' => now()->subDays(5)],
        $tx + ['type' => 'SELL', 'status' => 'APPROVED', 'lot' => 2, 'amount' => 20000, 'transacted_at' => now()->subDays(3)],
    ]);
    DB::table('crowdfunding_transactions')->insert([
        'user_id' => $user->id, 'crowdfunding_id' => $crowdfundingId, 'payment_id' => $paymentId,
        'amount' => 1000000, 'transacted_at' => now()->subDays(4), 'created_at' => now(), 'updated_at' => now(),
    ]);

    $propertyFinancialId = DB::table('property_financials')->insertGetId([
        'property_investment_id' => $investmentId, 'year' => 2026, 'month' => 9, 'net_profit' => 500000,
        'status' => 'FINAL', 'is_distributed' => true, 'created_at' => now(), 'updated_at' => now(),
    ]);
    $crowdfundingFinancialId = DB::table('crowdfunding_financials')->insertGetId([
        'crowdfunding_id' => $crowdfundingId, 'net_profit' => 120000, 'status' => 'FINAL', 'is_distributed' => true,
        'created_at' => now(), 'updated_at' => now(),
    ]);

    $wt = ['user_id' => $user->id, 'updated_at' => now()];
    DB::table('wallet_transactions')->insert([
        $wt + ['type' => 'PROFIT', 'amount' => 50000, 'reference_type' => PropertyFinancial::class, 'reference_id' => $propertyFinancialId, 'created_at' => now()->subDays(2)],
        $wt + ['type' => 'PROFIT', 'amount' => 1120000, 'reference_type' => CrowdfundingFinancial::class, 'reference_id' => $crowdfundingFinancialId, 'created_at' => now()->subDay()],
        // Withdrawals move money from the wallet to the bank; not part of this history.
        $wt + ['type' => 'WITHDRAW', 'amount' => 55000, 'reference_type' => Withdrawal::class, 'reference_id' => 1, 'created_at' => now()],
    ]);
}

it('counts wallet profit as money in', function () {
    $user = historyInvestor();
    historySeed($user);

    $this->actingAs($user)->get(route('user.transaction'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('User/Transaction')
            ->has('transactions', 5)
            ->where('totalIn', fn ($v) => (float) $v === 20000.0 + 50000 + 1120000)
            ->where('totalOut', fn ($v) => (float) $v === 100000.0 + 1000000)
            ->where('netCashflow', fn ($v) => (float) $v === 1190000.0 - 1100000)
            ->where('transactions.0.trans_type', 'PROFIT')
            ->where('transactions.0.category', 'Profit Crowdfunding')
            ->where('transactions.0.title', 'margasari')
            ->where('transactions.1.category', 'Profit Investment')
            ->where('transactions.1.title', 'bukit dago'));
});

it('gives every row a key that is unique across sources', function () {
    $user = historyInvestor();
    historySeed($user);

    $this->actingAs($user)->get(route('user.transaction'))
        ->assertInertia(fn (Assert $page) => $page->where('transactions', fn ($rows) => collect($rows)->pluck('uid')->unique()->count() === 5));
});

it('only shows the signed-in investor their own profit', function () {
    historySeed(historyInvestor());

    $this->actingAs(historyInvestor())->get(route('user.transaction'))
        ->assertInertia(fn (Assert $page) => $page->has('transactions', 0)->where('netCashflow', 0));
});

it('runs the app in WIB', function () {
    expect(config('app.timezone'))->toBe('Asia/Jakarta')
        ->and(now()->getTimezone()->getName())->toBe('Asia/Jakarta');
});
