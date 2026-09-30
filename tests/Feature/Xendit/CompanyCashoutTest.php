<?php

use App\Models\CompanyCashout;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WithdrawalSetting;
use App\Models\XenditTransaction;
use App\Services\Cashout\CashoutService;
use App\Services\Xendit\TransactionMirror;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->admin = User::forceCreate(['name' => 'Irul', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $this->admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    WithdrawalSetting::current()->fill([
        'company_bank_code' => 'ID_BCA', 'company_account_number' => '5410992291', 'company_account_holder' => 'PT Gain Profit Indonesia',
    ])->save();
    config(['xendit.callback_token' => 'cb']);
});

/** A settled money-in row; net = amount - fee. */
function moneyIn(int $amount, int $fee = 0, array $overrides = []): XenditTransaction
{
    $id = 'txn_'.uniqid();
    app(TransactionMirror::class)->upsert(array_merge([
        'id' => $id, 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'SETTLED',
        'amount' => $amount, 'fee' => ['xendit_fee' => $fee, 'value_added_tax' => 0], 'reference_id' => 'INV-'.uniqid(),
        'created' => now()->subMinutes(random_int(1, 10000))->toIso8601String(), 'updated' => now()->toIso8601String(),
    ], $overrides));

    return XenditTransaction::where('xendit_id', $id)->firstOrFail();
}

function userMoney(int $walletBalance): void
{
    $u = User::forceCreate(['name' => 'Investor', 'email' => uniqid('i').'@example.com', 'password' => 'x']);
    Wallet::updateOrCreate(['user_id' => $u->id], ['balance' => $walletBalance]);
}

function fakeXendit(int $cash, $payout = null): void
{
    Http::fake([
        'api.xendit.co/balance*' => Http::response(['balance' => $cash]),
        'api.xendit.co/v2/payouts' => $payout ?? Http::response(['id' => 'disb-co-1', 'status' => 'ACCEPTED']),
        'api.xendit.co/transactions*' => Http::response(['has_more' => false, 'data' => []]),
        'api.xendit.co/payouts_channels*' => Http::response([
            ['channel_code' => 'ID_BCA', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Central Asia (BCA)', 'amount_limits' => ['minimum' => 1]],
        ]),
    ]);
}

function cashout(array $ids)
{
    return test()->actingAs(test()->admin)->post(route('admin.company-cashouts.store'), ['transaction_ids' => $ids]);
}

it('cashes out the selected net amount in one payout to the saved company account', function () {
    userMoney(10000000);
    $a = moneyIn(25000000, 4440);
    $b = moneyIn(15000000, 4440);
    fakeXendit(100000000);

    cashout([$a->id, $b->id])->assertSessionHas('success');

    $co = CompanyCashout::sole();
    expect($co->amount)->toBe(39991120)
        ->and($co->transaction_count)->toBe(2)
        ->and($co->status)->toBe('processing')
        ->and($co->xendit_id)->toBe('disb-co-1')
        ->and($co->created_by)->toBe($this->admin->id)
        ->and($co->balance_at_request)->toBe(100000000)
        ->and($co->reserve_at_request)->toBe(10000000)
        ->and($co->account_holder)->toBe('PT Gain Profit Indonesia')
        ->and($a->fresh()->company_cashout_id)->toBe($co->id)
        ->and($co->transactions()->count())->toBe(2);

    Http::assertSent(fn (Request $r) => str_ends_with($r->url(), '/v2/payouts')
        && $r->header('Idempotency-key')[0] === $co->external_id
        && $r['reference_id'] === $co->external_id
        && str_starts_with($co->external_id, 'CO-')
        && $r['channel_code'] === 'ID_BCA'
        && $r['channel_properties']['account_number'] === '5410992291'
        && $r['amount'] === 39991120);
});

it('blocks a cash-out that would touch the Reserve', function () {
    userMoney(60000000);
    $a = moneyIn(50000000);
    fakeXendit(100000000); // max = 100M - 60M = 40M

    cashout([$a->id])->assertSessionHas('error', fn ($m) => str_contains($m, 'Diblokir') && str_contains($m, 'Rp 40.000.000'));

    expect(CompanyCashout::count())->toBe(0)->and($a->fresh()->company_cashout_id)->toBeNull();
    Http::assertNotSent(fn (Request $r) => str_contains($r->url(), '/v2/payouts'));
});

it('counts open withdrawals and in-flight cash-outs in the limit', function () {
    userMoney(0);
    $u = User::first();
    $acc = \App\Models\UserBankAccount::forceCreate(['user_id' => $u->id, 'bank_code' => 'ID_BCA', 'account_number' => '1', 'account_holder_name' => 'x']);
    \App\Models\Withdrawal::forceCreate(['user_id' => $u->id, 'user_bank_account_id' => $acc->id, 'external_id' => 'WD-O', 'amount' => 30000000, 'fee' => 5000, 'status' => 'pending']);
    CompanyCashout::create(['external_id' => 'CO-INFLIGHT', 'amount' => 20000000, 'transaction_count' => 1, 'bank_code' => 'ID_BCA', 'account_number' => '1', 'account_holder' => 'x', 'status' => 'processing']);
    $a = moneyIn(50000000);
    fakeXendit(100000000); // 100M - 30.005M - 20M = 49.995M

    cashout([$a->id])->assertSessionHas('error', fn ($m) => str_contains($m, 'Rp 49.995.000'));
});

it('blocks when the CASH balance cannot be read (fail closed)', function (Closure $balance) {
    $a = moneyIn(1000000);
    Http::fake(['api.xendit.co/balance*' => $balance, 'api.xendit.co/v2/payouts' => Http::response(['id' => 'x', 'status' => 'ACCEPTED'])]);

    cashout([$a->id])->assertSessionHas('error', fn ($m) => str_contains($m, 'tidak bisa dibaca'));

    expect(CompanyCashout::count())->toBe(0);
    Http::assertNotSent(fn (Request $r) => str_contains($r->url(), '/v2/payouts'));
})->with([
    'timeout' => [fn () => throw new ConnectionException('timed out')],
    '503' => [fn () => Http::response('', 503)],
    'forbidden' => [fn () => Http::response(['error_code' => 'REQUEST_FORBIDDEN_ERROR'], 403)],
]);

it('never cashes out the same transaction twice', function () {
    $a = moneyIn(1000000);
    fakeXendit(100000000);

    cashout([$a->id])->assertSessionHas('success');
    cashout([$a->id])->assertSessionHas('error', fn ($m) => str_contains($m, 'sudah dicairkan'));

    expect(CompanyCashout::count())->toBe(1);
});

it('only accepts settled money-in rows', function (array $overrides) {
    $row = moneyIn(1000000, 0, $overrides);
    fakeXendit(100000000);

    cashout([$row->id])->assertSessionHas('error');

    expect(CompanyCashout::count())->toBe(0);
})->with([
    'holding' => [['settlement_status' => 'PENDING']],
    'money out' => [['cashflow' => 'MONEY_OUT', 'type' => 'DISBURSEMENT']],
    'failed' => [['status' => 'FAILED']],
]);

it('rejects an empty selection, unknown ids and a missing company account', function () {
    fakeXendit(100000000);
    $this->actingAs($this->admin)->post(route('admin.company-cashouts.store'), [])->assertSessionHasErrors('transaction_ids');
    cashout([999999])->assertSessionHas('error', fn ($m) => str_contains($m, 'tidak ditemukan'));

    WithdrawalSetting::current()->fill(['company_bank_code' => null, 'company_account_number' => null, 'company_account_holder' => null])->save();
    cashout([moneyIn(1000)->id])->assertSessionHas('error', fn ($m) => str_contains($m, 'Rekening perusahaan belum diatur'));
});

it('releases the rows when Xendit clearly refuses the payout', function () {
    $a = moneyIn(1000000);
    fakeXendit(100000000, Http::response(['error_code' => 'CHANNEL_CODE_NOT_SUPPORTED', 'message' => 'no'], 400));

    cashout([$a->id])->assertSessionHas('error');

    $co = CompanyCashout::sole();
    expect($co->status)->toBe('failed')->and($co->released_at)->not->toBeNull()
        ->and($a->fresh()->company_cashout_id)->toBeNull()
        ->and($co->transactions()->count())->toBe(1); // audit keeps which rows were used
});

it('keeps rows locked when the payout result is unknown', function () {
    $a = moneyIn(1000000);
    fakeXendit(100000000, fn () => throw new ConnectionException('timed out'));

    cashout([$a->id])->assertSessionHas('warning');

    expect(CompanyCashout::sole()->status)->toBe('processing')
        ->and($a->fresh()->company_cashout_id)->toBe(CompanyCashout::sole()->id);
});

it('routes payout webhooks for CO- references to the cash-out', function (string $status, string $expected, bool $released) {
    $a = moneyIn(1000000);
    fakeXendit(100000000);
    cashout([$a->id]);
    $co = CompanyCashout::sole();

    $this->postJson(route('xendit.webhook.payout'), ['event' => 'payout.x', 'data' => ['id' => 'disb-co-1', 'reference_id' => $co->external_id, 'status' => $status, 'failure_code' => 'TRANSFER_ERROR']],
        ['x-callback-token' => 'cb', 'webhook-id' => uniqid()])->assertOk()->assertJson(['result' => 'applied']);

    expect($co->fresh()->status)->toBe($expected)
        ->and($a->fresh()->company_cashout_id === null)->toBe($released);
})->with([
    'succeeded' => ['SUCCEEDED', 'succeeded', false],
    'failed' => ['FAILED', 'failed', true],
    'reversed' => ['REVERSED', 'reversed', true],
]);

it('lets released rows be cashed out again', function () {
    $a = moneyIn(1000000);
    fakeXendit(100000000);
    cashout([$a->id]);
    $first = CompanyCashout::sole();
    app(CashoutService::class)->applyPayoutResult($first, ['id' => 'disb-co-1', 'status' => 'FAILED']);

    cashout([$a->id])->assertSessionHas('success');

    expect(CompanyCashout::count())->toBe(2)->and($a->fresh()->company_cashout_id)->not->toBe($first->id);
});

it('auto-selects oldest first and never passes the max', function () {
    $old = moneyIn(40000000, 0, ['created' => '2026-01-01T00:00:00Z']);
    $mid = moneyIn(30000000, 0, ['created' => '2026-02-01T00:00:00Z']);
    $new = moneyIn(20000000, 0, ['created' => '2026-03-01T00:00:00Z']);
    moneyIn(5000000, 0, ['created' => '2026-01-15T00:00:00Z', 'settlement_status' => 'PENDING']);

    $pick = app(CashoutService::class)->autoSelect(65000000);

    expect($pick->modelKeys())->toBe([$old->id, $new->id]) // 40 + 20; 30 would pass 65
        ->and($pick->sum(fn ($t) => $t->netAmount()))->toBeLessThanOrEqual(65000000)
        ->and(app(CashoutService::class)->autoSelect(0))->toBeEmpty();
});

it('shows the selection page with the limit, eligible rows and the locked destination', function () {
    userMoney(112380000);
    $ok = moneyIn(25000000, 4440, ['reference_id' => 'INV-OK']);
    moneyIn(7500000, 0, ['reference_id' => 'INV-HOLD', 'settlement_status' => 'PENDING']);
    fakeXendit(184250000);

    $this->actingAs($this->admin)->get(route('admin.company-cashouts.create'))
        ->assertOk()
        ->assertSee('Batas Rp 71.870.000')
        ->assertSee('INV-OK')->assertSee('value="'.$ok->id.'"', false)
        ->assertSee('INV-HOLD')->assertSee('Belum bisa dipilih')
        ->assertSee('PT Gain Profit Indonesia')->assertSee('5410 •••• 2291');
});

it('shows the page as blocked when the balance cannot be read', function () {
    moneyIn(1000);
    Http::fake(fn () => Http::response('', 503));

    $this->actingAs($this->admin)->get(route('admin.company-cashouts.create'))
        ->assertOk()->assertSee('Saldo Xendit belum bisa dibaca');
});

it('keeps a full audit history with a status check', function () {
    $a = moneyIn(1000000);
    fakeXendit(100000000);
    cashout([$a->id]);
    $co = CompanyCashout::sole();
    Http::fake(['api.xendit.co/v2/payouts/disb-co-1' => Http::response(['id' => 'disb-co-1', 'status' => 'SUCCEEDED', 'reference_id' => $co->external_id])]);

    $this->actingAs($this->admin)->get(route('admin.company-cashouts.index', ['id' => $co->id]))
        ->assertOk()->assertSee($co->external_id)->assertSee('Irul')->assertSee('disb-co-1')->assertSee($a->xendit_id);

    $this->actingAs($this->admin)->post(route('admin.company-cashouts.check-status', $co))->assertSessionHas('success');
    expect($co->fresh()->status)->toBe('succeeded');
});

it('saves the company bank account in settings, all three fields or none', function () {
    fakeBankChannels();

    $this->actingAs($this->admin)->put(route('admin.withdrawal-settings.update'), [
        'admin_fee' => 5000, 'min_amount' => 50000,
        'company_bank_code' => 'id_bsi', 'company_account_number' => '7123 456 789', 'company_account_holder' => ' PT  Gain ',
    ])->assertSessionHasNoErrors();

    expect(WithdrawalSetting::current()->companyAccount())->toBe(['bank_code' => 'ID_BSI', 'account_number' => '7123456789', 'account_holder' => 'PT Gain']);

    $this->actingAs($this->admin)->put(route('admin.withdrawal-settings.update'), [
        'admin_fee' => 5000, 'min_amount' => 50000, 'company_bank_code' => 'ID_BCA',
    ])->assertSessionHasErrors(['company_account_number', 'company_account_holder']);

    $this->actingAs($this->admin)->put(route('admin.withdrawal-settings.update'), [
        'admin_fee' => 5000, 'min_amount' => 50000, 'company_bank_code' => 'ID_NOPE', 'company_account_number' => '12345', 'company_account_holder' => 'X',
    ])->assertSessionHasErrors('company_bank_code');
});

it('is admin only', function () {
    $u = User::forceCreate(['name' => 'U', 'email' => uniqid('u').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $u->roles()->attach(Role::firstOrCreate(['name' => 'user']));
    Http::fake();

    $this->actingAs($u)->get(route('admin.company-cashouts.create'))->assertForbidden();
    $this->actingAs($u)->post(route('admin.company-cashouts.store'), ['transaction_ids' => [1]])->assertForbidden();
    Http::assertNothingSent();
});
