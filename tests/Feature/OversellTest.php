<?php

use App\Models\CrowdfundingTransaction;
use App\Models\InvestmentTransaction;
use App\Models\Payment;
use App\Models\PropertyCrowdfunding;
use App\Models\PropertyInvestment;
use App\Models\Role;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Testing\AssertableInertia as Assert;
use Xendit\Invoice\Invoice;

/*
 * PF-06: an open invoice holds its lots / amount until it expires, so the
 * invoices that can still be paid never add up to more than is left. The
 * webhook re-checks under a row lock as a safety net.
 */

beforeEach(function () {
    $this->withoutVite();
    config(['xendit.callback_token' => 'expected-token', 'xendit.invoice_duration' => 86400]);
    $this->investor = oversellUser();
    $this->mock(XenditService::class, fn ($mock) => $mock->shouldReceive('createInvoice')
        ->andReturn(new Invoice(['invoice_url' => 'https://checkout-staging.xendit.co/web/inv_1'])));
});

function oversellUser(): User
{
    $user = User::forceCreate([
        'name' => 'Investor', 'email' => uniqid('os').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    return $user;
}

function oversellProperty(): int
{
    return DB::table('properties')->insertGetId([
        'property_name' => 'Villa A', 'property_location' => 'Bali', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Villa', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
}

// 100 lots of 10.000, 90 sold, 1-50 per purchase.
function oversellInvestment(array $overrides = []): PropertyInvestment
{
    $id = DB::table('property_investments')->insertGetId(array_merge([
        'property_id' => oversellProperty(), 'asset_price' => 1000000, 'total_investment_value' => 1000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 10000, 'total_lot' => 100,
        'sold_lot' => 90, 'min_lot_size' => 1, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ], $overrides));

    return PropertyInvestment::findOrFail($id);
}

// Goal 100jt, 90jt collected, minimum 1jt.
function oversellCrowdfunding(array $overrides = []): PropertyCrowdfunding
{
    $id = DB::table('property_crowdfundings')->insertGetId(array_merge([
        'property_id' => oversellProperty(), 'funding_goal' => 100000000, 'min_contribution' => 1000000,
        'estimated_roi' => 12, 'collected_amount' => 90000000, 'tenor' => 12, 'status' => 'Open',
        'created_at' => now(), 'updated_at' => now(),
    ], $overrides));

    return PropertyCrowdfunding::findOrFail($id);
}

function openInvoice($payable, array $overrides = []): Payment
{
    return Payment::forceCreate(array_merge([
        'user_id' => oversellUser()->id, 'payable_type' => $payable::class, 'payable_id' => $payable->id,
        'lot' => $payable instanceof PropertyInvestment ? 5 : null, 'amount' => 50000,
        'external_id' => uniqid('INV-'), 'status' => 'PENDING',
    ], $overrides));
}

function paidWebhook(Payment $payment)
{
    return test()->postJson('/xendit/webhook', ['id' => 'inv_'.$payment->id, 'external_id' => $payment->external_id, 'status' => 'PAID'],
        ['x-callback-token' => 'expected-token']);
}

// Reserving at invoice creation

it('counts the lots of open invoices as taken', function () {
    $investment = oversellInvestment();
    openInvoice($investment, ['lot' => 8]);

    $this->actingAs($this->investor)->post(route('user.payment.investment', $investment->property_id), ['lot' => 3])
        ->assertSessionHasErrors(['lot' => 'Sisa lot tinggal 2.']);

    $this->actingAs($this->investor)->post(route('user.payment.investment', $investment->property_id), ['lot' => 2])
        ->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');
});

it('tells the buyer when every lot left is held by open invoices', function () {
    $investment = oversellInvestment();
    openInvoice($investment, ['lot' => 10]);

    $this->actingAs($this->investor)->post(route('user.payment.investment', $investment->property_id), ['lot' => 1])
        ->assertSessionHasErrors(['error' => 'Sisa lot sedang dipesan investor lain. Coba lagi nanti.']);
});

it('frees the lots of invoices that expired or failed', function (array $invoice) {
    $investment = oversellInvestment();
    openInvoice($investment, ['lot' => 10] + $invoice);

    $this->actingAs($this->investor)->post(route('user.payment.investment', $investment->property_id), ['lot' => 10])
        ->assertRedirect('https://checkout-staging.xendit.co/web/inv_1');
})->with([
    'EXPIRED webhook' => [['status' => 'EXPIRED']],
    'FAILED webhook' => [['status' => 'FAILED']],
    'PENDING past the invoice duration' => [['created_at' => now()->subSeconds(86401)]],
]);

it('counts the amount of open crowdfunding invoices as taken', function () {
    $crowdfunding = oversellCrowdfunding();
    openInvoice($crowdfunding, ['amount' => 7000000]);

    $this->actingAs($this->investor)->post(route('user.payment.crowdfunding', $crowdfunding->id), ['total_amount' => 3000001])
        ->assertSessionHasErrors(['total_amount' => 'Sisa target pendanaan tinggal Rp 3.000.000.']);

    openInvoice($crowdfunding, ['amount' => 3000000]);

    $this->actingAs($this->investor)->post(route('user.payment.crowdfunding', $crowdfunding->id), ['total_amount' => 1000000])
        ->assertSessionHasErrors(['error' => 'Sisa target sedang dipesan investor lain. Coba lagi nanti.']);
});

it('shows only what is not held by open invoices on the purchase pages', function () {
    $investment = oversellInvestment();
    openInvoice($investment, ['lot' => 4]);
    $crowdfunding = oversellCrowdfunding();
    openInvoice($crowdfunding, ['amount' => 4000000]);

    $this->get('/investments/purchase/'.$investment->property_id)
        ->assertInertia(fn (Assert $page) => $page->where('property.financials.max_lot', 6)->where('property.financials.is_open', true));
    $this->actingAs($this->investor)->get('/crowdfunding/purchase/'.$crowdfunding->id)
        ->assertInertia(fn (Assert $page) => $page->where('property.remaining', 6000000));
});

// Webhook safety net

it('books the last lots and closes the investment', function () {
    $investment = oversellInvestment();
    $payment = openInvoice($investment, ['lot' => 10, 'amount' => 100000]);

    paidWebhook($payment)->assertOk();

    expect($investment->fresh())->sold_lot->toBe(100)->status->toBe('FullyFunded')
        ->and($payment->fresh()->needs_refund)->toBeFalse();
});

it('books the last amount and closes the crowdfunding', function () {
    $crowdfunding = oversellCrowdfunding();
    $payment = openInvoice($crowdfunding, ['amount' => 10000000]);

    paidWebhook($payment)->assertOk();

    expect($crowdfunding->fresh())->status->toBe('Funded')
        ->and((int) $crowdfunding->fresh()->collected_amount)->toBe(100000000);
});

it('does not book a paid invoice that no longer fits, and flags it for refund', function () {
    $investment = oversellInvestment();
    $payment = openInvoice($investment, ['lot' => 10, 'amount' => 100000]);
    $investment->update(['total_lot' => 95]); // admin lowered the lots while the invoice was open
    Log::spy();

    paidWebhook($payment)->assertOk();

    expect($payment->fresh())->status->toBe('PAID')->needs_refund->toBeTrue()
        ->and($investment->fresh()->sold_lot)->toBe(90)
        ->and(InvestmentTransaction::count())->toBe(0);
    Log::shouldHaveReceived('error')->withArgs(fn ($message, $context) => str_contains($message, 'needs refund') && $context['left'] === 5)->once();

    paidWebhook($payment)->assertOk(); // a retry changes nothing
    expect($investment->fresh()->sold_lot)->toBe(90);
});

it('does not book crowdfunding money beyond the goal', function () {
    $crowdfunding = oversellCrowdfunding();
    $payment = openInvoice($crowdfunding, ['amount' => 10000001]);

    paidWebhook($payment)->assertOk();

    expect($payment->fresh()->needs_refund)->toBeTrue()
        ->and((int) $crowdfunding->fresh()->collected_amount)->toBe(90000000)
        ->and(CrowdfundingTransaction::count())->toBe(0);
});

// Real races (Postgres row locks)

function forkEach(array $jobs): array
{
    DB::disconnect();
    $pids = [];
    foreach ($jobs as $job) {
        $pid = pcntl_fork();
        if ($pid === 0) {
            DB::reconnect();
            try {
                exit($job());
            } catch (Throwable) {
                exit(1);
            }
        }
        $pids[] = $pid;
    }
    $codes = [];
    foreach ($pids as $pid) {
        pcntl_waitpid($pid, $status);
        $codes[] = pcntl_wexitstatus($status);
    }
    DB::reconnect();
    sort($codes);

    return $codes;
}

function cleanupRace(array $userIds, array $propertyIds): void
{
    DB::table('investment_portfolios')->whereIn('user_id', $userIds)->delete();
    DB::table('investment_transactions')->whereIn('user_id', $userIds)->delete();
    DB::table('payments')->whereIn('user_id', $userIds)->delete();
    DB::table('property_investments')->whereIn('property_id', $propertyIds)->delete();
    DB::table('properties')->whereIn('id', $propertyIds)->delete();
    DB::table('user_roles')->whereIn('user_id', $userIds)->delete();
    DB::table('users')->whereIn('id', $userIds)->delete();
}

it('reserves the last lots for only one of two buyers at the same moment', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::rollBack(); // the forked processes must see committed rows
    $buyers = [oversellUser(), oversellUser()];
    $investment = oversellInvestment(['sold_lot' => 95]);
    // Widen the gap between counting and inserting so an unlocked check would let both through.
    Payment::creating(fn () => usleep(300000));

    try {
        $codes = forkEach(array_map(fn ($buyer) => function () use ($buyer, $investment) {
            $response = $this->actingAs($buyer)->post(route('user.payment.investment', $investment->property_id), ['lot' => 5]);

            return $response->isRedirect('https://checkout-staging.xendit.co/web/inv_1') ? 0 : 3;
        }, $buyers));

        expect($codes)->toBe([0, 3])
            ->and(Payment::where('payable_id', $investment->id)->where('payable_type', PropertyInvestment::class)->sum('lot'))->toBe(5);
    } finally {
        cleanupRace(array_map(fn ($b) => $b->id, [...$buyers, $this->investor]), [$investment->property_id]);
        DB::beginTransaction();
    }
})->group('concurrency');

it('books only one of two paid invoices that race for the last lots', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::rollBack();
    $investment = oversellInvestment(['sold_lot' => 95]);
    // Created before the reservation rule (or after an admin change): together they overshoot.
    $payments = [openInvoice($investment, ['lot' => 5]), openInvoice($investment, ['lot' => 5])];
    $userIds = [$this->investor->id, ...array_map(fn ($p) => $p->user_id, $payments)];

    try {
        $codes = forkEach(array_map(fn ($payment) => fn () => paidWebhook($payment)->isOk() ? 0 : 1, $payments));

        expect($codes)->toBe([0, 0])
            ->and($investment->fresh()->sold_lot)->toBe(100)
            ->and(Payment::whereIn('id', array_map(fn ($p) => $p->id, $payments))->where('needs_refund', true)->count())->toBe(1)
            ->and(InvestmentTransaction::where('investment_id', $investment->id)->count())->toBe(1);
    } finally {
        cleanupRace($userIds, [$investment->property_id]);
        DB::beginTransaction();
    }
})->group('concurrency');

it('applies a webhook delivered twice at the same moment only once', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::rollBack();
    $investment = oversellInvestment();
    $payment = openInvoice($investment, ['lot' => 5]);

    try {
        $codes = forkEach([fn () => paidWebhook($payment)->isOk() ? 0 : 1, fn () => paidWebhook($payment)->isOk() ? 0 : 1]);

        expect($codes)->toBe([0, 0])
            ->and($investment->fresh()->sold_lot)->toBe(95)
            ->and(InvestmentTransaction::where('payment_id', $payment->id)->count())->toBe(1);
    } finally {
        cleanupRace([$this->investor->id, $payment->user_id], [$investment->property_id]);
        DB::beginTransaction();
    }
})->group('concurrency');
