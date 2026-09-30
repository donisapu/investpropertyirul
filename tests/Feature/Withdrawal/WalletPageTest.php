<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    fakeBankChannels();
});

function walletPageUser(): array
{
    $user = User::forceCreate([
        'name' => 'Siti', 'email' => uniqid('wp').'@example.com', 'password' => bcrypt('x'),
        'phone' => '0812', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));
    Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => '7345000.00']);
    $account = UserBankAccount::forceCreate([
        'user_id' => $user->id, 'bank_code' => 'ID_BCA', 'account_number' => '1234564578', 'account_holder_name' => 'Siti Rahma',
    ]);

    return [$user, $account];
}

function ledgerFor(User $user, string $type, int $amount, ?Withdrawal $withdrawal = null): void
{
    WalletTransaction::create([
        'user_id' => $user->id, 'type' => $type, 'amount' => $amount,
        'reference_type' => $withdrawal ? Withdrawal::class : null, 'reference_id' => $withdrawal?->id,
    ]);
}

it('shows balance, summary and a history with withdrawal statuses', function () {
    [$user, $account] = walletPageUser();

    $open = Withdrawal::forceCreate([
        'user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-1',
        'amount' => 5000000, 'fee' => 5000, 'status' => 'processing',
    ]);
    ledgerFor($user, 'WITHDRAW', 5005000, $open);

    $failed = Withdrawal::forceCreate([
        'user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-2',
        'amount' => 3000000, 'fee' => 5000, 'status' => 'failed', 'failure_code' => 'ACCOUNT_NAME_MISMATCH',
    ]);
    ledgerFor($user, 'WITHDRAW', 3005000, $failed);
    ledgerFor($user, 'WITHDRAW_REFUND', 3005000, $failed);
    ledgerFor($user, 'PROFIT', 1820000);

    $this->actingAs($user)->get(route('user.wallet'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('User/Wallet')
            ->where('balance', 7345000)
            ->where('summary.processing', 5005000)
            ->where('summary.profit_this_month', 1820000)
            ->has('history', 4)
            ->where('history.0.kind', 'profit')
            ->where('history.0.amount', 1820000)
            ->where('history.1.kind', 'refund')
            ->where('history.1.fix_account', true)
            ->where('history.1.subtitle', 'Nama rekening tidak cocok dengan data bank')
            ->where('history.1.status.tone', 'danger')
            ->where('history.3.title', 'Tarik ke BCA •••• 4578')
            ->where('history.3.amount', -5005000)
            ->where('history.3.status', ['label' => 'Diproses', 'tone' => 'info'])
            ->where('bankAccounts.0.bank_name', 'BCA')
            ->where('bankAccounts.0.bank_badge', 'BCA')
            ->where('bankAccounts.0.last4', '4578')
            ->where('bankAccounts.0.last_failure', 'Nama rekening tidak cocok dengan data bank'));
});

it('never sends full account numbers to the page', function () {
    [$user] = walletPageUser();

    $this->actingAs($user)->get(route('user.wallet'))
        ->assertOk()
        ->assertDontSee('1234564578');
});

it('shows only the user\'s own history', function () {
    [$user] = walletPageUser();
    [$other] = walletPageUser();
    ledgerFor($other, 'PROFIT', 999);

    $this->actingAs($user)->get(route('user.wallet'))
        ->assertInertia(fn (Assert $page) => $page->has('history', 0));
});

it('shares the success flash after a withdrawal', function () {
    [$user, $account] = walletPageUser();

    $this->actingAs($user)
        ->followingRedirects()
        ->post(route('user.withdrawals.store'), ['user_bank_account_id' => $account->id, 'amount' => 100000])
        ->assertInertia(fn (Assert $page) => $page
            ->where('flash.success', 'Permintaan penarikan berhasil dibuat!')
            ->has('history', 1)
            ->where('history.0.status.label', 'Menunggu admin'));
});

it('marks an account an open withdrawal still uses, so the page explains instead of offering delete', function () {
    [$user, $account] = walletPageUser();
    $free = UserBankAccount::forceCreate([
        'user_id' => $user->id, 'bank_code' => 'ID_BNI', 'account_number' => '5550001111', 'account_holder_name' => 'Siti Rahma',
    ]);
    Withdrawal::forceCreate([
        'user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-'.uniqid(),
        'amount' => 100000, 'fee' => 5000, 'status' => 'processing',
    ]);

    $this->actingAs($user)->get(route('user.wallet'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('bankAccounts', fn ($accounts) => collect($accounts)->firstWhere('id', $account->id)['in_use'] === true
                && collect($accounts)->firstWhere('id', $free->id)['in_use'] === false));
});
