<?php

use App\Models\AuctionDeposit;
use App\Models\Payment;
use App\Models\PropertyAuction;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Services\XenditService;
use Illuminate\Support\Facades\DB;
use Xendit\Invoice\Invoice;

/*
 * Lelang & Cessie: deposit (DP-) → bids → the scheduler closes → the winner settles (PL-).
 * See mockups/gainproperties/USE-CASES.md §C.
 */

beforeEach(function () {
    $this->withoutVite();
    config(['xendit.callback_token' => 'expected-token', 'xendit.invoice_duration' => 86400]);
    $this->invoices = [];
    $this->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')
        ->andReturnUsing(function ($externalId, $amount, $email, $description) {
            $this->invoices[] = compact('externalId', 'amount', 'email', 'description');

            return new Invoice(['invoice_url' => 'https://checkout-staging.xendit.co/web/'.$externalId]);
        }));
});

function lelBidder(): User
{
    $user = User::forceCreate([
        'name' => uniqid('Bidder '), 'email' => uniqid('bidder').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    return $user;
}

function lelAdmin(): User
{
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('adm').'@example.com', 'password' => bcrypt('x'), 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));

    return $admin;
}

// Limit Rp 1.800.000.000, increment Rp 10.000.000, deposit 5% = Rp 90.000.000 (the mockup's numbers).
function lelAuction(array $overrides = []): PropertyAuction
{
    $propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Gedung Sunter', 'property_location' => 'Jakarta Utara', 'bedroom' => 0, 'bathroom' => 2,
        'property_type' => 'Ruko', 'land_area' => 300, 'building_area' => 500, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);

    return PropertyAuction::create(array_merge([
        'property_id' => $propertyId, 'open_bid' => 1800000000, 'bid_increment' => 10000000, 'market_value' => 2500000000,
        'date_start' => now()->subHour(), 'date_finish' => now()->addDay(), 'status' => 'active', 'type' => 'auction',
        'deposit_percent' => 5, 'payment_days' => 7,
    ], $overrides));
}

function lelWebhook($test, string $externalId, string $status)
{
    return $test->postJson('/xendit/webhook', ['id' => 'inv_'.$externalId, 'external_id' => $externalId, 'status' => $status],
        ['x-callback-token' => 'expected-token']);
}

/** $user pays the deposit on $auction through the webhook. */
function lelDeposit($test, PropertyAuction $auction, User $user, string $status = 'PAID'): void
{
    $test->actingAs($user)->post(route('auctions.deposit', $auction->id))->assertSessionHasNoErrors();
    lelWebhook($test, end($test->invoices)['externalId'], $status)->assertOk();
}

function lelBid($test, PropertyAuction $auction, User $user, int $amount)
{
    return $test->actingAs($user)->post(route('auctions.bid', $auction->id), ['bid_amount' => $amount]);
}

function lelState($test, ?User $user, PropertyAuction $auction): array
{
    $user ? $test->actingAs($user) : auth()->logout();
    $props = [];
    $test->get(route('auctions.show', $auction->id))
        ->assertInertia(function ($page) use (&$props) { $props = $page->toArray()['props']['participation']; });

    return $props;
}

function lelBalance(User $user): int
{
    return (int) Wallet::where('user_id', $user->id)->value('balance');
}

// ---- Deposit ----

test('a member pays the deposit through a Xendit invoice', function () {
    $auction = lelAuction();

    $response = $this->actingAs(lelBidder())->post(route('auctions.deposit', $auction->id));

    expect($this->invoices)->toHaveCount(1)
        ->and($this->invoices[0]['amount'])->toEqual(90000000)
        ->and($this->invoices[0]['externalId'])->toStartWith('DP-')
        ->and($this->invoices[0]['description'])->toBe('Deposit Lelang - Gedung Sunter');
    $response->assertRedirect('https://checkout-staging.xendit.co/web/'.$this->invoices[0]['externalId']);
});

test('paying again while the deposit is pending reuses the invoice', function () {
    $auction = lelAuction();
    $bidder = lelBidder();

    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id));
    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id))
        ->assertRedirect('https://checkout-staging.xendit.co/web/'.$this->invoices[0]['externalId']);

    expect($this->invoices)->toHaveCount(1);
});

test('deposits open while upcoming and close an hour before the auction ends', function (array $auction, bool $open) {
    $this->actingAs(lelBidder())->post(route('auctions.deposit', lelAuction($auction)->id));

    expect($this->invoices)->toHaveCount($open ? 1 : 0);
})->with([
    'upcoming' => [['status' => 'upcoming', 'date_start' => now()->addDay(), 'date_finish' => now()->addDays(2)], true],
    'draft' => [['status' => 'draft'], false],
    'suspended' => [['status' => 'suspended'], false],
    'last hour' => [['date_finish' => now()->addMinutes(59)], false],
    'no deposit %' => [['deposit_percent' => null], false],
]);

test('a paid deposit lets the member bid', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder);

    expect(lelState($this, $bidder, $auction))->toMatchArray(['state' => 'bidding', 'minimum_bid' => 1800000000])
        ->and(lelState($this, $bidder, $auction)['deposit'])->toMatchArray(['status' => 'paid', 'amount' => 90000000]);
});

test('an expired deposit invoice can be paid again with a new one', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder, 'EXPIRED');

    expect(lelState($this, $bidder, $auction)['state'])->toBe('deposit');

    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id));
    expect($this->invoices)->toHaveCount(2);
});

test('a deposit paid after the auction ended goes back to the Wallet', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id));
    $auction->update(['status' => 'cancelled']);

    lelWebhook($this, $this->invoices[0]['externalId'], 'PAID');

    expect(lelBalance($bidder))->toBe(90000000)
        ->and(AuctionDeposit::sole()->status)->toBe('refunded');
});

// ---- Bids ----

test('a member without a paid deposit cannot bid', function () {
    $auction = lelAuction();

    lelBid($this, $auction, lelBidder(), 1800000000)->assertSessionHasErrors('bid');

    expect($auction->bids()->count())->toBe(0);
});

test('bids follow the limit, the increment and the top bid', function () {
    $auction = lelAuction();
    [$a, $b] = [lelBidder(), lelBidder()];
    lelDeposit($this, $auction, $a);
    lelDeposit($this, $auction, $b);

    lelBid($this, $auction, $a, 1790000000)->assertSessionHasErrors('bid');   // under the limit
    lelBid($this, $auction, $a, 1800000000)->assertSessionHasNoErrors();      // first bid = limit
    lelBid($this, $auction, $a, 1810000000)->assertSessionHasErrors('bid');   // cannot outbid yourself
    lelBid($this, $auction, $b, 1800000000)->assertSessionHasErrors('bid');   // same amount as the top bid
    lelBid($this, $auction, $b, 1815000000)->assertSessionHasErrors('bid');   // not a multiple of the increment
    lelBid($this, $auction, $b, 1830000000)->assertSessionHasNoErrors();

    expect(lelState($this, $a, $auction))->toMatchArray(['top_bid' => 1830000000, 'top_is_mine' => false, 'minimum_bid' => 1840000000]);
});

test('no bids before the auction opens or after it closes', function (array $times) {
    $auction = lelAuction(['status' => 'upcoming', 'date_start' => now()->addHour(), 'date_finish' => now()->addDay()]);
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder);
    $auction->update($times);

    lelBid($this, $auction, $bidder, 1800000000)->assertSessionHasErrors('bid');
})->with([
    'not opened yet' => [[]],
    'past the closing time' => [['status' => 'active', 'date_start' => now()->subDay(), 'date_finish' => now()->subMinute()]],
]);

test('a bid in the last minutes extends an anti-sniping auction', function () {
    $auction = lelAuction(['anti_sniping' => true, 'date_finish' => now()->addMinutes(2)]);
    $bidder = lelBidder();
    // Deposits close an hour before the end: this one was paid earlier.
    $auction->update(['date_finish' => now()->addDay()]);
    lelDeposit($this, $auction, $bidder);
    $auction->update(['date_finish' => now()->addMinutes(2)]);

    lelBid($this, $auction, $bidder, 1800000000)->assertSessionHasNoErrors();

    expect($auction->fresh()->date_finish->diffInSeconds(now()->addMinutes(5)))->toBeLessThan(5);
});

test('bidders are anonymous on the public page', function () {
    $auction = lelAuction();
    [$a, $b] = [lelBidder(), lelBidder()];
    lelDeposit($this, $auction, $a);
    lelDeposit($this, $auction, $b);
    lelBid($this, $auction, $a, 1800000000);
    lelBid($this, $auction, $b, 1810000000);

    $bids = lelState($this, $a, $auction)['bids'];

    expect(collect($bids)->pluck('who')->all())->toBe(['Peserta #2', 'Kamu'])
        ->and($bids[0]['top'])->toBeTrue();
    $this->get(route('auctions.show', $auction->id))->assertDontSee($b->email)->assertDontSee($b->name);
});

// ---- Closing (scheduler) ----

test('the scheduler opens an upcoming auction on time', function () {
    $auction = lelAuction(['status' => 'upcoming', 'date_start' => now()->addMinute()]);
    $this->travel(2)->minutes();

    $this->artisan('auctions:tick')->assertSuccessful();

    expect($auction->fresh()->status)->toBe('active');
});

test('closing picks the top bid, refunds the others and bills the winner the rest', function () {
    $auction = lelAuction();
    [$winner, $loser, $idle] = [lelBidder(), lelBidder(), lelBidder()];
    foreach ([$winner, $loser, $idle] as $user) {
        lelDeposit($this, $auction, $user);
    }
    lelBid($this, $auction, $loser, 1800000000);
    lelBid($this, $auction, $winner, 1950000000);
    $this->travel(25)->hours();

    $this->artisan('auctions:tick')->expectsOutputToContain('1 closed')->assertSuccessful();

    expect($auction->fresh()->status)->toBe('awaiting_payment')
        ->and(lelBalance($loser))->toBe(90000000)
        ->and(lelBalance($idle))->toBe(90000000)
        ->and(lelBalance($winner))->toBe(0)
        ->and(lelState($this, $loser, $auction)['state'])->toBe('lost');
    expect(lelState($this, $winner, $auction))->toMatchArray(['state' => 'won'])
        ->and(lelState($this, $winner, $auction)['settlement'])->toMatchArray(['price' => 1950000000, 'deposit_amount' => 90000000, 'amount' => 1860000000]);
});

test('an auction without bids closes with no winner and returns every deposit', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder);
    $this->travel(25)->hours();

    $this->artisan('auctions:tick')->assertSuccessful();

    expect($auction->fresh()->status)->toBe('no_winner')
        ->and(lelBalance($bidder))->toBe(90000000);
});

test('a suspended auction is not closed by the scheduler', function () {
    $auction = lelAuction(['status' => 'suspended']);
    $this->travel(25)->hours();

    $this->artisan('auctions:tick')->assertSuccessful();

    expect($auction->fresh()->status)->toBe('suspended');
});

/** An auction closed with $winner on top at Rp 1.950.000.000. */
function lelWon($test, User $winner): PropertyAuction
{
    $auction = lelAuction();
    lelDeposit($test, $auction, $winner);
    lelBid($test, $auction, $winner, 1950000000);
    $test->travel(25)->hours();
    $test->artisan('auctions:tick');

    return $auction->fresh();
}

// ---- Settlement ----

test('the winner pays the rest through Xendit and the auction completes', function () {
    $winner = lelBidder();
    $auction = lelWon($this, $winner);

    $this->actingAs($winner)->post(route('auctions.settle', $auction->id));
    $invoice = end($this->invoices);
    expect($invoice['amount'])->toEqual(1860000000)->and($invoice['externalId'])->toStartWith('PL-');

    lelWebhook($this, $invoice['externalId'], 'PAID')->assertOk();

    expect($auction->fresh()->status)->toBe('completed')
        ->and(AuctionDeposit::sole()->status)->toBe('applied')
        ->and(lelState($this, $winner, $auction)['state'])->toBe('paid');
});

test('only the winner can pay the settlement', function () {
    $auction = lelWon($this, lelBidder());

    $this->actingAs(lelBidder())->post(route('auctions.settle', $auction->id))->assertSessionHasErrors('settlement');
});

test('a winner who does not pay in time loses the deposit', function () {
    $winner = lelBidder();
    $auction = lelWon($this, $winner);
    $this->travel(8)->days();

    $this->artisan('auctions:tick')->expectsOutputToContain('1 defaulted')->assertSuccessful();

    expect($auction->fresh()->status)->toBe('defaulted')
        ->and(AuctionDeposit::sole()->status)->toBe('forfeited')
        ->and(lelBalance($winner))->toBe(0)
        ->and(lelState($this, $winner, $auction)['state'])->toBe('default');
});

test('a settlement paid after the default goes back to the Wallet', function () {
    $winner = lelBidder();
    $auction = lelWon($this, $winner);
    $this->actingAs($winner)->post(route('auctions.settle', $auction->id));
    $this->travel(8)->days();
    $this->artisan('auctions:tick');

    lelWebhook($this, end($this->invoices)['externalId'], 'PAID')->assertOk();

    expect($auction->fresh()->status)->toBe('defaulted')
        ->and(lelBalance($winner))->toBe(1860000000);
});

test('a failed deposit invoice that is paid anyway still counts', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    $this->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')->andThrow(new RuntimeException('timeout')));

    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id))->assertSessionHasErrors('deposit');
    lelWebhook($this, Payment::latest('id')->value('external_id'), 'PAID')->assertOk();

    expect(lelState($this, $bidder, $auction)['state'])->toBe('bidding');
});

test('only verified members get to deposit', function () {
    $auction = lelAuction();
    $unverified = lelBidder();
    $unverified->forceFill(['email_verified_at' => null])->save();

    expect(lelState($this, null, $auction)['viewer'])->toBe('guest')
        ->and(lelState($this, $unverified, $auction)['viewer'])->toBe('unverified')
        ->and(lelState($this, lelAdmin(), $auction)['viewer'])->toBe('staff');
    $this->actingAs(lelAdmin())->post(route('auctions.deposit', $auction->id))->assertForbidden();
});

// ---- Admin ----

function lelForm(PropertyAuction $auction, array $overrides = []): array
{
    return array_merge([
        'property_id' => $auction->property_id, 'type' => $auction->type, 'status' => $auction->status,
        'open_bid' => 1800000000, 'bid_increment' => 10000000, 'market_value' => 2500000000,
        'deposit_percent' => 5, 'payment_days' => 7,
        'date_start' => $auction->date_start->format('Y-m-d\TH:i'), 'date_finish' => $auction->date_finish->format('Y-m-d\TH:i'),
    ], $overrides);
}

test('the deposit must be at least 5% of the limit', function () {
    $auction = lelAuction();

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['deposit_percent' => 4]))
        ->assertSessionHasErrors('deposit_percent');
});

test('an admin schedules opening and closing with hours', function () {
    $auction = lelAuction(['status' => 'draft']);

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, [
        'status' => 'upcoming', 'date_start' => '2026-12-01T13:00', 'date_finish' => '2026-12-08T15:30', 'anti_sniping' => '1',
    ]))->assertSessionHasNoErrors();

    expect($auction->fresh())
        ->date_start->format('Y-m-d H:i')->toBe('2026-12-01 13:00')
        ->date_finish->format('Y-m-d H:i')->toBe('2026-12-08 15:30')
        ->anti_sniping->toBeTrue();
});

test('the terms of an auction are locked once a deposit is paid', function () {
    $auction = lelAuction();
    lelDeposit($this, $auction, lelBidder());

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['open_bid' => 1500000000, 'deposit_percent' => 10]))
        ->assertSessionHasErrors(['open_bid', 'deposit_percent']);
    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['market_value' => 2600000000]))
        ->assertSessionHasNoErrors();
});

test('a running auction can only close later, not earlier', function () {
    $auction = lelAuction();

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['date_finish' => now()->addHours(2)->format('Y-m-d\TH:i')]))
        ->assertSessionHasErrors('date_finish');
    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['date_finish' => now()->addDays(2)->format('Y-m-d\TH:i')]))
        ->assertSessionHasNoErrors();
});

test('the closing statuses cannot be set from the form', function () {
    $auction = lelAuction();

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['status' => 'completed']))
        ->assertSessionHasErrors('status');
});

test('an admin cancels an auction and every deposit goes back', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder);
    lelBid($this, $auction, $bidder, 1800000000);

    $this->actingAs(lelAdmin())->post(route('admin.auction-properties.cancel', $auction), ['reason' => 'Pemilik menarik objek lelang.'])
        ->assertRedirect(route('admin.auction-properties.show', $auction->id));

    expect($auction->fresh()->status)->toBe('cancelled')
        ->and(lelBalance($bidder))->toBe(90000000)
        ->and(lelState($this, $bidder, $auction))->toMatchArray(['state' => 'cancelled', 'cancel_reason' => 'Pemilik menarik objek lelang.']);
});

test('a closed auction cannot be cancelled', function () {
    $auction = lelWon($this, lelBidder());

    $this->actingAs(lelAdmin())->post(route('admin.auction-properties.cancel', $auction), ['reason' => 'x'])->assertSessionHasErrors('auction');
});

test('an admin records a settlement paid by bank transfer', function () {
    $winner = lelBidder();
    $auction = lelWon($this, $winner);

    $this->actingAs(lelAdmin())->post(route('admin.auction-properties.mark-paid', $auction), ['note' => 'BCA 14 Nov ref 123'])->assertSessionHasNoErrors();

    expect($auction->fresh()->status)->toBe('completed')
        ->and($auction->settlement->manual_note)->toBe('BCA 14 Nov ref 123');
});

test('an admin extends the settlement deadline', function () {
    $auction = lelWon($this, lelBidder());
    $due = $auction->settlement->due_at;

    $this->actingAs(lelAdmin())->post(route('admin.auction-properties.extend-due', $auction), ['days' => 3])->assertSessionHasNoErrors();

    expect($auction->settlement()->first()->due_at->equalTo($due->copy()->addDays(3)))->toBeTrue();
});

test('an auction with deposits cannot be deleted', function () {
    $auction = lelAuction();
    lelDeposit($this, $auction, lelBidder());

    $this->actingAs(lelAdmin())->delete(route('admin.auction-properties.destroy', $auction->id))->assertSessionHasErrors('auction');

    expect(PropertyAuction::find($auction->id))->not->toBeNull();
});

test('the admin detail shows participants, deposits and bids', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder);
    lelBid($this, $auction, $bidder, 1800000000);

    $this->actingAs(lelAdmin())->get(route('admin.auction-properties.show', $auction->id))
        ->assertOk()->assertSee($bidder->name)->assertSee('Ditahan')->assertSee('Rp 1.800.000.000');
});

test('members cannot use the auction admin actions', function () {
    $auction = lelAuction();

    $this->actingAs(lelBidder())->post(route('admin.auction-properties.cancel', $auction), ['reason' => 'x'])->assertForbidden();
});

test('a returned deposit shows in the Wallet history', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    lelDeposit($this, $auction, $bidder);
    $this->actingAs(lelAdmin())->post(route('admin.auction-properties.cancel', $auction), ['reason' => 'Batal.']);
    fakeBankChannels();

    $this->actingAs($bidder)->get(route('user.wallet'))->assertInertia(fn ($page) => $page
        ->where('history.0.title', 'Pengembalian deposit lelang: Gedung Sunter')
        ->where('history.0.amount', 90000000));
});

test('closing records the winning bid and when it closed', function () {
    $winner = lelBidder();
    $auction = lelWon($this, $winner);

    expect($auction->winnerBid->user_id)->toBe($winner->id)
        ->and($auction->closed_at)->not->toBeNull();
});

test('the public page does not carry bidder ids or the winner\'s invoice', function () {
    $winner = lelBidder();
    $auction = lelWon($this, $winner);
    $this->actingAs($winner)->post(route('auctions.settle', $auction->id));

    auth()->logout();
    $this->get(route('auctions.show', $auction->id))->assertInertia(function ($page) {
        $auction = $page->toArray()['props']['auction'];
        expect($auction)->not->toHaveKey('bids')->not->toHaveKey('settlement');
    })->assertDontSee('checkout-staging.xendit.co/web/PL-');
});

test('a late duplicate deposit is refunded and the held one still counts', function () {
    $auction = lelAuction();
    $bidder = lelBidder();
    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id));
    $first = $this->invoices[0]['externalId'];
    lelWebhook($this, $first, 'EXPIRED');
    lelDeposit($this, $auction, $bidder);       // second invoice, paid
    lelWebhook($this, $first, 'PAID');          // the expired one gets paid late

    expect(lelState($this, $bidder, $auction)['state'])->toBe('bidding')
        ->and(lelBalance($bidder))->toBe(90000000);
    $this->actingAs($bidder)->post(route('auctions.deposit', $auction->id))->assertSessionHasErrors('deposit');
});

test('a running auction cannot be moved back to upcoming or draft', function () {
    $auction = lelAuction();

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['status' => 'upcoming']))
        ->assertSessionHasErrors('status');
    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['status' => 'suspended']))
        ->assertSessionHasNoErrors();
});

test('the deposit cannot be the whole limit', function () {
    $auction = lelAuction(['status' => 'draft']);

    $this->actingAs(lelAdmin())->put(route('admin.auction-properties.update', $auction->id), lelForm($auction, ['deposit_percent' => 100]))
        ->assertSessionHasErrors('deposit_percent');
});

// ---- My Bids & Wallet "Deposit tertahan" ----

function lelMyBids($test, User $user): array
{
    $props = [];
    $test->actingAs($user)->get(route('user.bid'))
        ->assertInertia(function ($page) use (&$props) {
            $page->component('User/Bids');
            $props = $page->toArray()['props'];
        });

    return $props;
}

test('My Bids lists the auctions a member joined with their position', function () {
    [$me, $rival] = [lelBidder(), lelBidder()];
    $leading = lelAuction();
    $outbid = lelAuction();
    $notJoined = lelAuction();
    foreach ([$leading, $outbid] as $a) {
        lelDeposit($this, $a, $me);
    }
    lelDeposit($this, $outbid, $rival);
    lelBid($this, $leading, $me, 1800000000);
    lelBid($this, $outbid, $me, 1800000000);
    lelBid($this, $outbid, $rival, 1810000000);

    $props = lelMyBids($this, $me);
    $byId = collect($props['items'])->keyBy('id');

    expect($byId->keys()->sort()->values()->all())->toBe(collect([$leading->id, $outbid->id])->sort()->values()->all())
        ->and($byId[$leading->id])->toMatchArray(['state' => 'bidding', 'top_is_mine' => true, 'my_last_bid' => 1800000000, 'name' => 'Gedung Sunter'])
        ->and($byId[$outbid->id])->toMatchArray(['state' => 'bidding', 'top_is_mine' => false, 'top_bid' => 1810000000])
        ->and($byId[$outbid->id])->not->toHaveKey('bids')
        ->and($props['held'])->toBe(['amount' => 180000000, 'auctions' => 2]);
});

test('My Bids shows a pending deposit but not an expired unpaid one', function () {
    $me = lelBidder();
    $pending = lelAuction();
    $expired = lelAuction();
    $this->actingAs($me)->post(route('auctions.deposit', $pending->id));
    lelDeposit($this, $expired, $me, 'EXPIRED');

    $props = lelMyBids($this, $me);

    expect(collect($props['items'])->pluck('id')->all())->toBe([$pending->id])
        ->and($props['items'][0]['state'])->toBe('deposit_pending')
        ->and($props['held'])->toBe(['amount' => 0, 'auctions' => 0]);
});

test('a lost auction leaves My Bids held amount and refunds the deposit', function () {
    [$me, $winner] = [lelBidder(), lelBidder()];
    $auction = lelAuction();
    lelDeposit($this, $auction, $me);
    lelDeposit($this, $auction, $winner);
    lelBid($this, $auction, $me, 1800000000);
    lelBid($this, $auction, $winner, 1810000000);
    $this->travel(25)->hours();
    $this->artisan('auctions:tick');

    $props = lelMyBids($this, $me);

    expect($props['items'][0]['state'])->toBe('lost')
        ->and($props['held'])->toBe(['amount' => 0, 'auctions' => 0])
        ->and(lelBalance($me))->toBe(90000000);
});

test('the Wallet shows deposits held by running auctions', function () {
    fakeBankChannels();
    $me = lelBidder();
    lelDeposit($this, lelAuction(), $me);

    $this->actingAs($me)->get(route('user.wallet'))
        ->assertInertia(fn ($page) => $page->component('User/Wallet')
            ->where('held.amount', 90000000)->where('held.auctions', 1));
});

test('My Bids is for signed-in members only', function () {
    $this->get(route('user.bid'))->assertRedirect(route('login'));
});

test('a won auction no longer counts as a held deposit', function () {
    $me = lelBidder();
    lelWon($this, $me);

    $props = lelMyBids($this, $me);

    expect($props['items'][0]['state'])->toBe('won')
        ->and($props['held'])->toBe(['amount' => 0, 'auctions' => 0]);
});

test('an ended auction with only an unpaid deposit invoice is left out of My Bids', function () {
    $me = lelBidder();
    $auction = lelAuction();
    $this->actingAs($me)->post(route('auctions.deposit', $auction->id));
    $this->travel(25)->hours();
    $this->artisan('auctions:tick');

    expect(lelMyBids($this, $me)['items'])->toBe([]);
});
