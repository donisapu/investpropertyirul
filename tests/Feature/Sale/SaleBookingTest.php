<?php

use App\Models\Payment;
use App\Models\PropertyConsignment;
use App\Models\Role;
use App\Models\SaleBooking;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Support\Facades\DB;
use Xendit\Invoice\Invoice;

/*
 * Penjualan: a buyer pays a booking fee (admin-set % of the price) through Xendit.
 * A pending or paid booking holds the property; see mockups/gainproperties/USE-CASES.md §B.
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

function saleBuyer(): User
{
    $user = User::forceCreate([
        'name' => 'Pembeli', 'email' => uniqid('buyer').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    return $user;
}

// Rp 2.450.000.000 with a 2% booking fee = Rp 49.000.000 (the mockup's numbers).
function saleListing(array $overrides = []): PropertyConsignment
{
    $propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Rumah Bintaro', 'property_location' => 'Tangerang Selatan', 'bedroom' => 4, 'bathroom' => 3,
        'property_type' => 'Villa', 'land_area' => 150, 'building_area' => 180, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);

    return PropertyConsignment::forceCreate(array_merge([
        'property_id' => $propertyId, 'property_value' => 2450000000, 'market_value' => 2700000000,
        'ownership' => 'SHM', 'listing_type' => 'Freehold', 'status' => 'active', 'booking_fee_percent' => 2,
    ], $overrides));
}

test('a member books an available property and is sent to the Xendit invoice for the booking fee', function () {
    $listing = saleListing();

    $response = $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id));

    expect($this->invoices)->toHaveCount(1)
        ->and($this->invoices[0]['amount'])->toEqual(49000000)
        ->and($this->invoices[0]['externalId'])->toStartWith('BK-')
        ->and($this->invoices[0]['description'])->toBe('Booking Fee - Rumah Bintaro');
    $response->assertRedirect('https://checkout-staging.xendit.co/web/'.$this->invoices[0]['externalId']);
});

test('a second buyer cannot book a property while the first booking is waiting for payment', function () {
    $listing = saleListing();
    $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id));

    $this->actingAs(saleBuyer())->from('/property-for-sale/'.$listing->id)
        ->post(route('property-for-sale.book', $listing->id))
        ->assertRedirect('/property-for-sale/'.$listing->id)
        ->assertSessionHasErrors(['booking' => 'Properti ini sedang dibooking pembeli lain.']);

    expect($this->invoices)->toHaveCount(1);
});

test('booking again while the booking is pending sends the buyer to the same invoice', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $first = $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id));

    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id))
        ->assertRedirect($first->headers->get('Location'));

    expect($this->invoices)->toHaveCount(1);
});

test('a property without a booking fee cannot be booked online', function (array $listing) {
    $listing = saleListing($listing);

    $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id))
        ->assertSessionHasErrors(['booking' => 'Properti ini tidak bisa dibooking online.']);

    expect($this->invoices)->toBeEmpty();
})->with([
    'no fee set' => [['booking_fee_percent' => null]],
    'listing not active' => [['status' => 'draft']],
]);

test('once the unpaid invoice has expired another buyer can book the property', function () {
    $listing = saleListing();
    $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id));

    $this->travel(86401)->seconds();

    $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id))->assertSessionHasNoErrors();
    expect($this->invoices)->toHaveCount(2);
});

function bookingWebhook($test, string $externalId, string $status)
{
    return $test->postJson('/xendit/webhook', ['id' => 'inv_'.$externalId, 'external_id' => $externalId, 'status' => $status],
        ['x-callback-token' => 'expected-token']);
}

function bookingStateFor($test, ?User $user, PropertyConsignment $listing): array
{
    $user ? $test->actingAs($user) : auth()->logout();
    $props = [];
    $test->get(route('property-for-sale.show', $listing->id))
        ->assertInertia(function ($page) use (&$props) { $props = $page->toArray()['props']['booking']; });

    return $props;
}

test('a paid booking fee locks the property for everyone else', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id));

    bookingWebhook($this, $this->invoices[0]['externalId'], 'PAID')->assertOk();
    $this->travel(2)->days();

    expect(bookingStateFor($this, $buyer, $listing))->toMatchArray(['state' => 'mine_paid', 'fee_amount' => 49000000])
        ->and(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('taken')
        ->and(bookingStateFor($this, null, $listing)['state'])->toBe('taken');
});

test('an expired invoice frees the property straight away', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id));

    bookingWebhook($this, $this->invoices[0]['externalId'], 'EXPIRED')->assertOk();

    expect(bookingStateFor($this, $buyer, $listing)['state'])->toBe('mine_expired')
        ->and(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('available');
});

test('a payment that arrives after someone else booked the property is held for an admin to refund', function () {
    $listing = saleListing();
    $late = saleBuyer();
    $this->actingAs($late)->post(route('property-for-sale.book', $listing->id));
    $this->travel(86401)->seconds();
    $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id));
    bookingWebhook($this, $this->invoices[1]['externalId'], 'PAID');

    bookingWebhook($this, $this->invoices[0]['externalId'], 'PAID')->assertOk();

    expect(SaleBooking::where('user_id', $late->id)->value('status'))->toBe(SaleBooking::CONFLICT)
        ->and(bookingStateFor($this, $late, $listing)['state'])->toBe('mine_conflict');
});

function saleAdmin(): User
{
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('adm').'@example.com', 'password' => bcrypt('x'), 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));

    return $admin;
}

/** A booking for $listing whose fee went through the webhook with $status. */
function settledBooking($test, PropertyConsignment $listing, User $buyer, string $status = 'PAID'): SaleBooking
{
    $test->actingAs($buyer)->post(route('property-for-sale.book', $listing->id));
    bookingWebhook($test, end($test->invoices)['externalId'], $status);

    return SaleBooking::where('user_id', $buyer->id)->latest('id')->firstOrFail();
}

function saleWalletBalance(User $user): float
{
    return (float) \App\Models\Wallet::where('user_id', $user->id)->value('balance');
}

test('an admin marks a booked property as sold', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $booking = settledBooking($this, $listing, $buyer);

    $this->actingAs(saleAdmin())->post(route('admin.bookings.complete', $booking))->assertSessionHasNoErrors();

    expect(bookingStateFor($this, $buyer, $listing)['state'])->toBe('mine_completed')
        ->and(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('sold');
});

test('an admin cancels a paid booking and returns the fee to the buyer\'s Wallet', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $booking = settledBooking($this, $listing, $buyer);

    $this->actingAs(saleAdmin())->post(route('admin.bookings.cancel', $booking), [
        'fee_outcome' => 'refunded', 'reason' => 'Pemilik menunda penjualan.',
    ])->assertSessionHasNoErrors();

    expect(saleWalletBalance($buyer))->toBe(49000000.0)
        ->and(bookingStateFor($this, $buyer, $listing))->toMatchArray(['state' => 'mine_cancelled'])
        ->and(bookingStateFor($this, $buyer, $listing)['booking'])->toMatchArray(['fee_outcome' => 'refunded', 'cancel_reason' => 'Pemilik menunda penjualan.'])
        ->and(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('available');
});

test('an admin cancels a paid booking and keeps the fee', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $booking = settledBooking($this, $listing, $buyer);

    $this->actingAs(saleAdmin())->post(route('admin.bookings.cancel', $booking), [
        'fee_outcome' => 'forfeited', 'reason' => 'Pembeli mundur.',
    ])->assertSessionHasNoErrors();

    expect(saleWalletBalance($buyer))->toBe(0.0)
        ->and(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('available');
});

test('cancelling because the owner withdrew the property takes the listing offline', function () {
    $listing = saleListing();
    $booking = settledBooking($this, $listing, saleBuyer());

    $this->actingAs(saleAdmin())->post(route('admin.bookings.cancel', $booking), [
        'fee_outcome' => 'refunded', 'reason' => 'Pemilik menarik properti.', 'deactivate_listing' => '1',
    ])->assertSessionHasNoErrors();

    expect(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('unavailable');
});

test('a cancellation needs a reason and a fee outcome', function () {
    $booking = settledBooking($this, saleListing(), saleBuyer());

    $this->actingAs(saleAdmin())->post(route('admin.bookings.cancel', $booking), ['fee_outcome' => 'kept'])
        ->assertSessionHasErrors(['reason', 'fee_outcome']);
    expect($booking->fresh()->status)->toBe(SaleBooking::PAID);
});

test('an admin refunds a double payment to the late buyer\'s Wallet', function () {
    $listing = saleListing();
    $late = saleBuyer();
    $this->actingAs($late)->post(route('property-for-sale.book', $listing->id));
    $this->travel(86401)->seconds();
    settledBooking($this, $listing, saleBuyer());
    bookingWebhook($this, $this->invoices[0]['externalId'], 'PAID');
    $conflict = SaleBooking::where('user_id', $late->id)->firstOrFail();

    $this->actingAs(saleAdmin())->post(route('admin.bookings.refund', $conflict))->assertSessionHasNoErrors();

    expect(saleWalletBalance($late))->toBe(49000000.0)
        ->and(bookingStateFor($this, $late, $listing)['state'])->toBe('taken');
});

test('only bookings in the right status can be completed or cancelled', function () {
    $listing = saleListing();
    $this->actingAs(saleBuyer())->post(route('property-for-sale.book', $listing->id));
    $pending = SaleBooking::firstOrFail();
    $admin = saleAdmin();

    $this->actingAs($admin)->post(route('admin.bookings.complete', $pending))->assertSessionHasErrors('booking');
    $this->actingAs($admin)->post(route('admin.bookings.refund', $pending))->assertSessionHasErrors('booking');
    expect($pending->fresh()->status)->toBe(SaleBooking::PENDING);
});

test('members cannot use the booking admin', function () {
    $booking = settledBooking($this, saleListing(), saleBuyer());

    $this->actingAs(saleBuyer())->post(route('admin.bookings.complete', $booking))->assertForbidden();
});

test('the scheduler expires bookings whose invoice ran out without a webhook', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id));
    $this->travel(86401)->seconds();

    $this->artisan('sales:expire-bookings')->expectsOutputToContain('1 booking')->assertSuccessful();

    $this->actingAs(saleAdmin())->get(route('admin.bookings.index', ['tab' => 'closed']))
        ->assertOk()->assertSee('Rumah Bintaro')->assertSee('Kedaluwarsa');
});

test('a refunded booking fee shows in the buyer\'s Wallet history', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $booking = settledBooking($this, $listing, $buyer);
    $this->actingAs(saleAdmin())->post(route('admin.bookings.cancel', $booking), ['fee_outcome' => 'refunded', 'reason' => 'Batal.']);
    fakeBankChannels();

    $this->actingAs($buyer)->get(route('user.wallet'))->assertInertia(fn ($page) => $page
        ->where('history.0.title', 'Pengembalian booking fee: Rumah Bintaro')
        ->where('history.0.amount', 49000000));
});

function listingForm(PropertyConsignment $listing, array $overrides = []): array
{
    return array_merge([
        'property_id' => $listing->property_id, 'property_value' => 2450000000, 'market_value' => 2700000000,
        'ownership' => 'SHM', 'listing_type' => 'Freehold', 'status' => 'active',
        'booking_fee_percent' => 2, 'booking_terms' => null,
    ], $overrides);
}

test('an admin sets the booking fee and its terms per property', function () {
    $listing = saleListing(['booking_fee_percent' => null]);

    $this->actingAs(saleAdmin())->put(route('admin.consignment-properties.update', $listing->id), listingForm($listing, [
        'booking_fee_percent' => '2.5', 'booking_terms' => 'Booking fee dipotong dari harga saat pelunasan.',
    ]))->assertSessionHasNoErrors();

    expect(bookingStateFor($this, saleBuyer(), $listing))
        ->toMatchArray(['state' => 'available', 'fee_amount' => 61250000, 'terms' => 'Booking fee dipotong dari harga saat pelunasan.']);
});

test('the booking fee must be a percentage above zero', function (string $value) {
    $listing = saleListing();

    $this->actingAs(saleAdmin())->put(route('admin.consignment-properties.update', $listing->id), listingForm($listing, ['booking_fee_percent' => $value]))
        ->assertSessionHasErrors('booking_fee_percent');
})->with(['0', '-1', '101', 'abc']);

test('price and booking fee are locked while someone holds the property', function () {
    $listing = saleListing();
    settledBooking($this, $listing, saleBuyer());

    $this->actingAs(saleAdmin())->put(route('admin.consignment-properties.update', $listing->id), listingForm($listing, [
        'property_value' => 2000000000, 'booking_fee_percent' => 5,
    ]))->assertSessionHasErrors('booking_fee_percent');

    expect($listing->fresh())->property_value->toEqual(2450000000)->booking_fee_percent->toEqual(2);
});

test('a listing with bookings cannot be deleted', function () {
    $listing = saleListing();
    settledBooking($this, $listing, saleBuyer());

    $this->actingAs(saleAdmin())->delete(route('admin.consignment-properties.destroy', $listing->id))->assertSessionHasErrors('booking');

    expect(PropertyConsignment::find($listing->id))->not->toBeNull();
});

test('a guest who wants to book logs in and lands back on the property', function () {
    $listing = saleListing();

    $this->get(route('property-for-sale.book.login', $listing->id))->assertRedirect(route('login'));

    $this->actingAs(saleBuyer())->get(route('property-for-sale.book.login', $listing->id))
        ->assertRedirect(route('property-for-sale.show', $listing->id));
});

test('the listing page marks a booked property and shows its booking fee', function () {
    $listing = saleListing();
    settledBooking($this, $listing, saleBuyer());

    $this->get(route('property-for-sale.index', ['listing_category' => 'sale']))->assertInertia(fn ($page) => $page
        ->where('properties.data.0.booked', true)
        ->where('properties.data.0.booking_fee_percent', 2));
});

test('a booking fee paid after the invoice call failed still books the property', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    // Xendit made the invoice but the response timed out on our side.
    $this->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')->andThrow(new RuntimeException('cURL timeout')));

    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id))->assertSessionHasErrors('booking');
    expect(bookingStateFor($this, saleBuyer(), $listing)['state'])->toBe('available');

    bookingWebhook($this, Payment::latest('id')->value('external_id'), 'PAID')->assertOk();

    expect(bookingStateFor($this, $buyer, $listing)['state'])->toBe('mine_paid');
});

test('a second click while the invoice is still being made does not open a second booking', function () {
    $listing = saleListing();
    $buyer = saleBuyer();
    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id));
    Payment::query()->update(['invoice_url' => null]);

    $this->actingAs($buyer)->post(route('property-for-sale.book', $listing->id))->assertSessionHasErrors('booking');

    expect(SaleBooking::count())->toBe(1);
});

test('the house and status of a held listing cannot be changed', function (array $change) {
    $listing = saleListing();
    settledBooking($this, $listing, saleBuyer());
    $otherHouse = saleListing()->property_id;

    $this->actingAs(saleAdmin())->put(route('admin.consignment-properties.update', $listing->id),
        listingForm($listing, array_map(fn ($v) => $v === 'other-house' ? $otherHouse : $v, $change)))
        ->assertSessionHasErrors('booking_fee_percent');

    expect($listing->fresh())->property_id->toBe($listing->property_id)->status->toBe('active');
})->with([[['property_id' => 'other-house']], [['status' => 'sold']]]);

test('a property sold through a booking cannot be reopened for booking', function () {
    $listing = saleListing();
    $booking = settledBooking($this, $listing, saleBuyer());
    $this->actingAs(saleAdmin())->post(route('admin.bookings.complete', $booking));

    $this->actingAs(saleAdmin())->put(route('admin.consignment-properties.update', $listing->id), listingForm($listing, ['status' => 'active']))
        ->assertSessionHasErrors('status');

    expect($listing->fresh()->status)->toBe('sold');
});

test('a listing whose only booking expired still cannot be deleted', function () {
    $listing = saleListing();
    settledBooking($this, $listing, saleBuyer(), 'EXPIRED');

    $this->actingAs(saleAdmin())->delete(route('admin.consignment-properties.destroy', $listing->id))->assertSessionHasErrors('booking');

    expect(PropertyConsignment::find($listing->id))->not->toBeNull();
});

test('admin payment screens can load the property of a booking payment', function () {
    settledBooking($this, saleListing(), saleBuyer());

    // The eager load used by Xendit Transactions, Company Cash-out and the Xendit dashboard.
    $payment = Payment::with('payable.property:id,property_name')->sole();

    expect($payment->payable->property->property_name)->toBe('Rumah Bintaro');
});

test('only verified members are offered the booking button', function () {
    $listing = saleListing();
    $unverified = saleBuyer();
    $unverified->forceFill(['email_verified_at' => null])->save();

    expect(bookingStateFor($this, null, $listing)['viewer'])->toBe('guest')
        ->and(bookingStateFor($this, saleBuyer(), $listing)['viewer'])->toBe('buyer')
        ->and(bookingStateFor($this, $unverified, $listing)['viewer'])->toBe('unverified')
        ->and(bookingStateFor($this, saleAdmin(), $listing)['viewer'])->toBe('staff');
});

test('the booking admin search treats % and _ literally', function () {
    settledBooking($this, saleListing(), saleBuyer());

    $this->actingAs(saleAdmin())->get(route('admin.bookings.index', ['q' => 'bintaro']))->assertSee('Rumah Bintaro');
    $this->actingAs(saleAdmin())->get(route('admin.bookings.index', ['q' => 'bin_aro']))->assertDontSee('Rumah Bintaro');
});
