<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\Withdrawal;
use App\Services\Wallet\WalletReserve;
use App\Services\Xendit\TransactionMirror;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $this->admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
});

function investorWith(string $balance, array $withdrawals = []): User
{
    $u = User::forceCreate(['name' => 'Inv '.uniqid(), 'email' => uniqid('i').'@example.com', 'password' => 'x']);
    Wallet::updateOrCreate(['user_id' => $u->id], ['balance' => $balance]);
    $a = UserBankAccount::forceCreate(['user_id' => $u->id, 'bank_code' => 'ID_BCA', 'account_number' => '1', 'account_holder_name' => 'x']);
    foreach ($withdrawals as [$status, $amount, $fee]) {
        Withdrawal::forceCreate(['user_id' => $u->id, 'user_bank_account_id' => $a->id, 'external_id' => 'WD-'.uniqid(), 'amount' => $amount, 'fee' => $fee, 'status' => $status]);
    }

    return $u;
}

function fakeBalances(int|float $cash, int|float $holding): void
{
    Http::fake([
        'api.xendit.co/balance?account_type=CASH*' => Http::response(['balance' => $cash]),
        'api.xendit.co/balance?account_type=HOLDING*' => Http::response(['balance' => $holding]),
    ]);
}

it('computes the Reserve as all wallet balances plus open withdrawals (amount + fee)', function () {
    investorWith('1000000.00', [['pending', 500000, 5000], ['processing', 200000, 5000], ['succeeded', 999999, 5000], ['failed', 888888, 5000], ['rejected', 777777, 5000]]);
    investorWith('250000.40');
    investorWith('0.00');

    expect(app(WalletReserve::class)->breakdown())->toBe([
        'wallets' => 1250001, // cents round up: never understate the Reserve
        'open_withdrawals' => 710000,
        'open_withdrawal_count' => 2,
        'total' => 1960001,
    ]);
});

it('never lets max Cash-out go below zero', function () {
    investorWith('5000000.00');

    expect(app(WalletReserve::class)->maxCashout(8000000))->toBe(3000000)
        ->and(app(WalletReserve::class)->maxCashout(4000000))->toBe(0);
});

it('shows live balances, Reserve and max Cash-out', function () {
    investorWith('112380000.00');
    fakeBalances(184250000, 12400000);

    $this->actingAs($this->admin)->get(route('admin.xendit-dashboard'))
        ->assertOk()
        ->assertSee('Rp 184.250.000')->assertSee('Rp 12.400.000')
        ->assertSee('Rp 112.380.000')->assertSee('Rp 71.870.000')
        ->assertDontSee('tidak bisa dihubungi');
});

it('still renders with the last known values and a banner when Xendit is down', function () {
    investorWith('1000000.00');
    fakeBalances(9000000, 100000);
    $this->actingAs($this->admin)->get(route('admin.xendit-dashboard'))->assertOk();

    $this->app->forgetInstance(\Illuminate\Http\Client\Factory::class);
    Http::swap(new \Illuminate\Http\Client\Factory);
    Http::preventStrayRequests();
    Http::fake(fn () => Http::response('', 503));

    $this->actingAs($this->admin)->get(route('admin.xendit-dashboard'))
        ->assertOk()
        ->assertSee('Xendit sedang tidak bisa dihubungi')
        ->assertSee('nilai terakhir yang diketahui')
        ->assertSee('Rp 9.000.000')->assertSee('Rp 8.000.000');
});

it('renders without any known balance instead of crashing', function () {
    Http::fake(fn () => throw new \Illuminate\Http\Client\ConnectionException('down'));

    $this->actingAs($this->admin)->get(route('admin.xendit-dashboard'))
        ->assertOk()
        ->assertSee('Saldo belum pernah terbaca')
        ->assertSee('—');
});

it('sums money in / out and fees from the mirror, and lists the latest 10', function () {
    fakeBalances(0, 0);
    $m = app(TransactionMirror::class);
    $now = now()->utc();
    $m->upsert(['id' => 'txn_today_in', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'SETTLED', 'amount' => 25000000, 'reference_id' => 'INV-TODAY',
        'fee' => ['xendit_fee' => 4000, 'value_added_tax' => 440], 'created' => $now->toIso8601String(), 'updated' => $now->toIso8601String()]);
    $m->upsert(['id' => 'txn_today_out', 'type' => 'DISBURSEMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_OUT', 'amount' => 4995000, 'reference_id' => 'WD-TODAY',
        'created' => $now->toIso8601String(), 'updated' => $now->toIso8601String()]);
    $m->upsert(['id' => 'txn_failed', 'type' => 'DISBURSEMENT', 'status' => 'FAILED', 'cashflow' => 'MONEY_OUT', 'amount' => 777, 'reference_id' => 'WD-FAILED',
        'created' => $now->toIso8601String(), 'updated' => $now->toIso8601String()]);
    foreach (range(1, 11) as $i) {
        $t = $now->copy()->subYears(1)->subMinutes($i);
        $m->upsert(['id' => 'txn_old_'.$i, 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'amount' => 1, 'reference_id' => 'OLD-'.$i, 'created' => $t->toIso8601String(), 'updated' => $t->toIso8601String()]);
    }

    $response = $this->actingAs($this->admin)->get(route('admin.xendit-dashboard'))->assertOk();

    $response->assertSee('+ Rp 25.000.000')->assertSee('− Rp 4.995.000')->assertSee('Rp 4.440')
        ->assertSee('INV-TODAY')->assertSee('WD-FAILED')
        ->assertSee('OLD-7')->assertDontSee('OLD-8'); // 3 recent + 7 old = 10 rows
});

it('counts what needs action and links to it', function () {
    fakeBalances(0, 0);
    investorWith('0', [['pending', 38500000, 5000], ['pending', 1000, 5000]]);
    $stuck = investorWith('0', [['processing', 5000000, 5000]]);
    Withdrawal::where('user_id', $stuck->id)->update(['approved_at' => now()->subDays(2)]);
    investorWith('0', [['processing', 1, 0]]); // approved just now: not stuck
    app(TransactionMirror::class)->upsert(['id' => 'txn_ready', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'SETTLED', 'amount' => 1, 'created' => now()->toIso8601String(), 'updated' => now()->toIso8601String()]);
    app(TransactionMirror::class)->upsert(['id' => 'txn_holding', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'PENDING', 'amount' => 1, 'created' => now()->toIso8601String(), 'updated' => now()->toIso8601String()]);

    $data = app(\App\Services\Xendit\XenditOverview::class)->build()['actions'];

    expect($data['pending_count'])->toBe(2)
        ->and($data['pending_total'])->toBe(38501000)
        ->and($data['stuck_count'])->toBe(1)
        ->and($data['cashout_ready_count'])->toBe(1);

    $this->actingAs($this->admin)->get(route('admin.xendit-dashboard'))
        ->assertSee(route('admin.user-withdrawals', ['tab' => 'pending']), false)
        ->assertSee(route('admin.user-withdrawals', ['tab' => 'processing']), false)
        ->assertSee(route('admin.xendit-transactions'), false);
});

it('is admin only', function () {
    $u = User::forceCreate(['name' => 'U', 'email' => uniqid('u').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $u->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    $this->actingAs($u)->get(route('admin.xendit-dashboard'))->assertForbidden();
});
