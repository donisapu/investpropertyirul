<?php

use App\Models\Payment;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Withdrawal;
use App\Models\XenditTransaction;
use App\Services\Xendit\TransactionMirror;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

function txn(array $overrides = []): array
{
    return array_replace_recursive([
        'id' => 'txn_'.uniqid(),
        'product_id' => 'inv_'.uniqid(),
        'type' => 'PAYMENT',
        'status' => 'SUCCESS',
        'channel_category' => 'VIRTUAL_ACCOUNT',
        'channel_code' => 'BCA',
        'reference_id' => 'INV-unlinked',
        'account_identifier' => null,
        'currency' => 'IDR',
        'amount' => 25000000,
        'cashflow' => 'MONEY_IN',
        'settlement_status' => 'SETTLED',
        'fee' => ['xendit_fee' => 4000, 'value_added_tax' => 440, 'status' => 'COMPLETED'],
        'created' => '2026-09-29T07:02:00.000Z',
        'updated' => '2026-09-29T07:05:00.000Z',
    ], $overrides);
}

function mirror(): TransactionMirror
{
    return app(TransactionMirror::class);
}

function investorWithPayment(): array
{
    $user = User::forceCreate(['name' => 'Budi Santoso', 'email' => uniqid('b').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Villa Canggu', 'property_location' => 'Bali', 'bedroom' => 2, 'bathroom' => 1, 'property_type' => 'Villa',
        'land_area' => 1, 'building_area' => 1, 'map_url' => 'x', 'created_at' => now(), 'updated_at' => now(),
    ]);
    $investmentId = DB::table('property_investments')->insertGetId([
        'property_id' => $propertyId, 'asset_price' => 1, 'total_investment_value' => 1, 'rental_yield' => 1, 'appreciation_rate' => 1,
        'price_per_lot' => 1, 'total_lot' => 1, 'min_lot_size' => 1, 'max_lot_size' => 1, 'projected_roi' => 1, 'roi_period_months' => 1,
        'status' => 'Open', 'created_at' => now(), 'updated_at' => now(),
    ]);
    $payment = Payment::forceCreate([
        'user_id' => $user->id, 'payable_type' => \App\Models\PropertyInvestment::class, 'payable_id' => $investmentId,
        'amount' => 25000000, 'external_id' => 'INV-INVEST-8841', 'status' => 'PAID',
    ]);

    return [$user, $payment];
}

it('inserts a transaction with fee = xendit fee + VAT', function () {
    expect(mirror()->upsert(txn(['id' => 'txn_1'])))->toBe('created');

    $row = XenditTransaction::sole();
    expect($row->xendit_id)->toBe('txn_1')
        ->and((float) $row->amount)->toBe(25000000.0)
        ->and((float) $row->fee)->toBe(4440.0)
        ->and($row->cashflow)->toBe('MONEY_IN')
        ->and($row->settlement_status)->toBe('SETTLED')
        ->and($row->xendit_created_at->utc()->toIso8601String())->toBe('2026-09-29T07:02:00+00:00')
        ->and($row->payload['channel_code'])->toBe('BCA');
});

it('updates an existing row when its status changes, never duplicates', function () {
    mirror()->upsert(txn(['id' => 'txn_2', 'type' => 'DISBURSEMENT', 'cashflow' => 'MONEY_OUT', 'status' => 'PENDING']));

    expect(mirror()->upsert(txn(['id' => 'txn_2', 'type' => 'DISBURSEMENT', 'cashflow' => 'MONEY_OUT', 'status' => 'SUCCESS', 'updated' => '2026-09-29T08:00:00Z'])))->toBe('updated');
    expect(mirror()->upsert(txn(['id' => 'txn_2', 'type' => 'DISBURSEMENT', 'cashflow' => 'MONEY_OUT', 'status' => 'REVERSED', 'updated' => '2026-09-30T08:00:00Z'])))->toBe('updated');

    expect(XenditTransaction::count())->toBe(1)
        ->and(XenditTransaction::sole()->status)->toBe('REVERSED');
});

it('never lets an older copy overwrite a newer one', function () {
    mirror()->upsert(txn(['id' => 'txn_3', 'status' => 'REVERSED', 'updated' => '2026-09-30T08:00:00Z']));

    expect(mirror()->upsert(txn(['id' => 'txn_3', 'status' => 'SUCCESS', 'updated' => '2026-09-29T08:00:00Z'])))->toBe('unchanged')
        ->and(XenditTransaction::sole()->status)->toBe('REVERSED');
});

it('links invoices to the Payment and payouts to the Withdrawal', function () {
    [$user, $payment] = investorWithPayment();
    $account = UserBankAccount::forceCreate(['user_id' => $user->id, 'bank_code' => 'ID_BCA', 'account_number' => '1', 'account_holder_name' => 'Budi']);
    $withdrawal = Withdrawal::forceCreate(['user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-LINK', 'amount' => 1, 'fee' => 0, 'status' => 'processing', 'xendit_id' => 'disb-link']);

    mirror()->upsert(txn(['id' => 'txn_in', 'reference_id' => 'INV-INVEST-8841']));
    mirror()->upsert(txn(['id' => 'txn_out', 'type' => 'DISBURSEMENT', 'cashflow' => 'MONEY_OUT', 'reference_id' => 'WD-LINK']));
    mirror()->upsert(txn(['id' => 'txn_by_product', 'type' => 'DISBURSEMENT', 'cashflow' => 'MONEY_OUT', 'reference_id' => 'other', 'product_id' => 'disb-link']));
    mirror()->upsert(txn(['id' => 'txn_none', 'reference_id' => 'nobody']));

    expect(XenditTransaction::where('xendit_id', 'txn_in')->first()->linkable->is($payment))->toBeTrue()
        ->and(XenditTransaction::where('xendit_id', 'txn_out')->first()->linkable->is($withdrawal))->toBeTrue()
        ->and(XenditTransaction::where('xendit_id', 'txn_by_product')->first()->linkable->is($withdrawal))->toBeTrue()
        ->and(XenditTransaction::where('xendit_id', 'txn_none')->first()->linkable)->toBeNull()
        ->and(XenditTransaction::where('xendit_id', 'txn_in')->first()->linkedUser()->name)->toBe('Budi Santoso');
});

it('syncs with cursor paging and then only asks for recent updates', function () {
    $calls = [];
    Http::fake(function (Request $r) use (&$calls) {
        $calls[] = $r->url();
        if (! str_contains($r->url(), 'after_id')) {
            return Http::response(['has_more' => true, 'data' => [txn(['id' => 'txn_a', 'updated' => '2026-09-29T09:00:00Z']), txn(['id' => 'txn_b'])]]);
        }

        return Http::response(['has_more' => false, 'data' => [txn(['id' => 'txn_c'])]]);
    });

    $result = mirror()->sync();

    expect($result)->toMatchArray(['created' => 3, 'pages' => 2, 'complete' => true])
        ->and(XenditTransaction::count())->toBe(3)
        ->and($calls[0])->toContain('limit=50')->not->toContain('updated')
        ->and($calls[1])->toContain('after_id=txn_b')
        ->and(mirror()->lastSyncedAt())->not->toBeNull();

    // Next run: incremental from the newest update seen, minus an overlap.
    $calls = [];
    Http::fake(function (Request $r) use (&$calls) {
        $calls[] = urldecode($r->url());

        return Http::response(['has_more' => false, 'data' => []]);
    });
    $this->travelTo('2026-09-29T12:00:00Z');
    mirror()->sync();

    // Xendit returns nothing for updated[gte] without updated[lte].
    expect(urldecode($calls[0]))->toContain('updated[gte]=2026-09-29T08:50:00.000Z')
        ->toContain('updated[lte]=2026-09-29T12:10:00.000Z');
});

it('keeps the same updated window when it resumes from a cursor', function () {
    mirror()->upsert(txn(['id' => 'txn_seen', 'updated' => '2026-09-29T09:00:00Z']));
    cache()->forever(TransactionMirror::STATE_KEY, ['max_updated' => '2026-09-29T09:00:00Z']);

    $urls = [];
    Http::fake(function (Request $r) use (&$urls) {
        $urls[] = urldecode($r->url());

        return Http::response(['has_more' => true, 'data' => [txn(['id' => 'txn_'.count($urls)])]]);
    });

    $this->travelTo('2026-09-29T12:00:00Z');
    mirror()->sync(1);
    $this->travelTo('2026-09-29T13:00:00Z');
    mirror()->sync(1);

    expect($urls[1])->toContain('after_id=txn_1')
        ->toContain('updated[gte]=2026-09-29T08:50:00.000Z')
        ->toContain('updated[lte]=2026-09-29T12:10:00.000Z');
});

it('resumes from its cursor when a run hits the page cap', function () {
    $urls = [];
    Http::fake(function (Request $r) use (&$urls) {
        $urls[] = $r->url();

        return Http::response(['has_more' => true, 'data' => [txn(['id' => 'txn_'.count($urls)])]]);
    });

    expect(mirror()->sync(2))->toMatchArray(['pages' => 2, 'complete' => false]);
    mirror()->sync(1);

    expect($urls[2])->toContain('after_id=txn_2');
});

it('does not run two syncs at once', function () {
    Http::fake();
    $lock = Cache::lock('xendit:transactions:sync-lock', 60);
    $lock->get();

    expect(mirror()->sync())->toMatchArray(['skipped' => true]);
    Http::assertNothingSent();
    $lock->release();
});

it('refreshes the mirror after a payout webhook', function () {
    config(['xendit.callback_token' => 'cb']);
    $user = User::forceCreate(['name' => 'X', 'email' => uniqid().'@example.com', 'password' => 'x']);
    $account = UserBankAccount::forceCreate(['user_id' => $user->id, 'bank_code' => 'ID_BCA', 'account_number' => '1', 'account_holder_name' => 'X']);
    $w = Withdrawal::forceCreate(['user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-HOOK', 'amount' => 1, 'fee' => 0, 'status' => 'processing', 'xendit_id' => 'disb-hook']);
    Http::fake(['api.xendit.co/transactions*' => Http::response(['has_more' => false, 'data' => [
        txn(['id' => 'txn_hook', 'type' => 'DISBURSEMENT', 'cashflow' => 'MONEY_OUT', 'reference_id' => 'WD-HOOK', 'product_id' => 'disb-hook']),
    ]])]);

    $this->postJson(route('xendit.webhook.payout'), ['data' => ['id' => 'disb-hook', 'reference_id' => 'WD-HOOK', 'status' => 'SUCCEEDED']], ['x-callback-token' => 'cb', 'webhook-id' => 'wh-m'])
        ->assertOk();

    expect(XenditTransaction::where('xendit_id', 'txn_hook')->first()?->linkable?->is($w))->toBeTrue();
    Http::assertSent(fn (Request $r) => str_contains($r->url(), 'product_id=disb-hook'));
});

it('refreshes the mirror after an invoice webhook', function () {
    config(['xendit.callback_token' => 'cb']);
    [, $payment] = investorWithPayment();
    $payment->update(['status' => 'PENDING']);
    Http::fake(['api.xendit.co/transactions*' => Http::response(['has_more' => false, 'data' => [txn(['id' => 'txn_inv', 'reference_id' => 'INV-INVEST-8841', 'product_id' => 'inv_abc'])]])]);

    $this->postJson('/xendit/webhook', ['id' => 'inv_abc', 'external_id' => 'INV-INVEST-8841', 'status' => 'EXPIRED'], ['x-callback-token' => 'cb'])->assertOk();

    expect(XenditTransaction::where('xendit_id', 'txn_inv')->exists())->toBeTrue();
});

it('keeps webhooks working when the mirror refresh fails', function () {
    config(['xendit.callback_token' => 'cb']);
    Http::fake(fn () => Http::response('', 503));

    $this->postJson(route('xendit.webhook.payout'), ['data' => ['id' => 'disb-z', 'reference_id' => 'WD-NONE', 'status' => 'SUCCEEDED']], ['x-callback-token' => 'cb', 'webhook-id' => 'wh-z'])
        ->assertOk();
});
