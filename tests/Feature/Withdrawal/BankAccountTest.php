<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Withdrawal;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => $this->withoutVite());

function investor(): User
{
    $user = User::forceCreate([
        'name' => 'Investor',
        'email' => uniqid('inv').'@example.com',
        'password' => bcrypt('secret'),
        'phone' => '081234567890',
        'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    return $user;
}

function bankAccountFor(User $user, array $attributes = []): UserBankAccount
{
    return UserBankAccount::forceCreate(array_merge([
        'user_id' => $user->id,
        'bank_code' => 'ID_BCA',
        'account_number' => '1234567890',
        'account_holder_name' => 'Investor',
    ], $attributes));
}

function withdrawalFor(UserBankAccount $account, string $status): Withdrawal
{
    return Withdrawal::forceCreate([
        'user_id' => $account->user_id,
        'user_bank_account_id' => $account->id,
        'external_id' => uniqid('WD-'),
        'amount' => 50000,
        'fee' => 5000,
        'status' => $status,
    ]);
}

it('gives the Wallet page the Xendit bank list without e-wallets', function () {
    fakeBankChannels();

    $this->actingAs(investor())->get(route('user.wallet'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('banks', 3)
            ->where('banks.0', ['code' => 'ID_BCA', 'name' => 'Bank Central Asia (BCA)', 'min' => 1, 'max' => 999999999999])
            ->where('banks.1.code', 'ID_PERMATA'));
});

it('still renders the Wallet page with the built-in banks when Xendit is down', function () {
    Http::fake(fn () => Http::response([], 503));

    $this->actingAs(investor())->get(route('user.wallet'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('banks', 5));
});

it('saves a bank account with a Xendit channel code, including banks beyond the old 5', function () {
    fakeBankChannels();
    $user = investor();

    $this->actingAs($user)->post(route('user.bank-accounts.store'), [
        'bank_code' => 'id_bsi',
        'account_number' => ' 7123-456 789 ',
        'account_holder_name' => '  Siti   Aminah ',
    ])->assertSessionHasNoErrors();

    $account = $user->bankAccounts()->sole();

    expect($account->bank_code)->toBe('ID_BSI')
        ->and($account->account_number)->toBe('7123456789')
        ->and($account->account_holder_name)->toBe('Siti Aminah')
        ->and($account->bank_name)->toBe('Bank Syariah Indonesia (BSI)');
});

it('rejects an unsupported bank code or a bad account', function (array $input, string $field) {
    fakeBankChannels();
    $user = investor();

    $this->actingAs($user)->post(route('user.bank-accounts.store'), array_merge([
        'bank_code' => 'ID_BCA',
        'account_number' => '1234567890',
        'account_holder_name' => 'Investor',
    ], $input))->assertSessionHasErrors($field);

    expect($user->bankAccounts()->count())->toBe(0);
})->with([
    'unknown bank' => [['bank_code' => 'ID_NOPE'], 'bank_code'],
    'e-wallet' => [['bank_code' => 'ID_OVO'], 'bank_code'],
    'legacy code' => [['bank_code' => 'BCA'], 'bank_code'],
    'letters in number' => [['account_number' => '12345abc'], 'account_number'],
    'too short' => [['account_number' => '1234'], 'account_number'],
    'scientific notation' => [['account_number' => '1e10'], 'account_number'],
    'holder name too long' => [['account_holder_name' => str_repeat('a', 101)], 'account_holder_name'],
]);

it('rejects the same account twice', function () {
    fakeBankChannels();
    $user = investor();
    bankAccountFor($user);

    $this->actingAs($user)->post(route('user.bank-accounts.store'), [
        'bank_code' => 'ID_BCA',
        'account_number' => '1234567890',
        'account_holder_name' => 'Investor',
    ])->assertSessionHasErrors('account_number');

    expect($user->bankAccounts()->count())->toBe(1);
});

it('lets the owner delete an account and keeps it on old withdrawals', function () {
    $user = investor();
    $account = bankAccountFor($user);
    $done = withdrawalFor($account, 'succeeded');

    $this->actingAs($user)->delete(route('user.bank-accounts.destroy', $account->id))
        ->assertSessionHasNoErrors();

    expect($user->bankAccounts()->count())->toBe(0)
        ->and(UserBankAccount::withTrashed()->find($account->id)->trashed())->toBeTrue()
        ->and(Withdrawal::find($done->id))->not->toBeNull()
        ->and(Withdrawal::find($done->id)->bankAccount->account_number)->toBe('1234567890');
});

it('blocks deleting an account an open withdrawal still uses', function (string $status) {
    $user = investor();
    $account = bankAccountFor($user);
    withdrawalFor($account, $status);

    $this->actingAs($user)->delete(route('user.bank-accounts.destroy', $account->id))
        ->assertSessionHasErrors('bank_account');

    expect($user->bankAccounts()->count())->toBe(1);
})->with(Withdrawal::OPEN_STATUSES);

it('does not let a user delete someone else\'s account', function () {
    $owner = investor();
    $account = bankAccountFor($owner);

    $this->actingAs(investor())->delete(route('user.bank-accounts.destroy', $account->id))
        ->assertNotFound();

    expect($owner->bankAccounts()->count())->toBe(1);
});

it('refuses a withdrawal to a deleted or foreign account', function (Closure $accountFor) {
    $user = investor();
    \App\Models\Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => 1000000]);
    $account = $accountFor($user);

    $this->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => 60000,
    ])->assertSessionHasErrors('user_bank_account_id');

    expect(Withdrawal::count())->toBe(0);
})->with([
    'deleted' => [function (User $user) {
        $account = bankAccountFor($user);
        $account->delete();

        return $account;
    }],
    'someone else\'s' => [fn (User $user) => bankAccountFor(investor())],
]);
