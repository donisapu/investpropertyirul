<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use Inertia\Testing\AssertableInertia as Assert;

function userWithRole(string $role, array $attributes = []): User
{
    $user = User::forceCreate(array_merge([
        'name' => ucfirst($role),
        'email' => $role.uniqid().'@example.com',
        'password' => bcrypt('secret'),
        'phone' => '081234567890',
        'email_verified_at' => now(),
    ], $attributes));

    $user->roles()->attach(Role::firstOrCreate(['name' => $role]));

    return $user;
}

function investorWithBalance(int $balance): array
{
    $user = userWithRole('user');
    Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => $balance]);
    $account = UserBankAccount::forceCreate([
        'user_id' => $user->id,
        'bank_code' => 'ID_BCA',
        'account_number' => '1234567890',
        'account_holder_name' => 'Investor',
    ]);

    return [$user, $account];
}

function setWithdrawalRules(int $fee, int $min, ?int $max = null): void
{
    WithdrawalSetting::current()->fill(['admin_fee' => $fee, 'min_amount' => $min, 'max_amount' => $max])->save();
}

beforeEach(function () {
    $this->withoutVite();
    fakeBankChannels();
});

it('ships with defaults 5000 fee / 50000 min / no max', function () {
    expect(WithdrawalSetting::count())->toBe(1)
        ->and(WithdrawalSetting::current()->toFrontend())
        ->toBe(['admin_fee' => 5000, 'min_amount' => 50000, 'max_amount' => null]);
});

it('lets an admin view and update the settings', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)->get(route('admin.withdrawal-settings.edit'))
        ->assertOk()
        ->assertSee('Withdrawal Settings')
        ->assertSee('value="5000"', false);

    $this->actingAs($admin)->put(route('admin.withdrawal-settings.update'), [
        'admin_fee' => 7500,
        'min_amount' => 100000,
        'max_amount' => 10000000,
    ])->assertRedirect(route('admin.withdrawal-settings.edit'))->assertSessionHasNoErrors();

    $setting = WithdrawalSetting::current();

    expect($setting->toFrontend())->toBe(['admin_fee' => 7500, 'min_amount' => 100000, 'max_amount' => 10000000])
        ->and($setting->updated_by)->toBe($admin->id)
        ->and(WithdrawalSetting::count())->toBe(1);
});

it('clears the max when left empty', function () {
    setWithdrawalRules(5000, 50000, 999999);

    $this->actingAs(userWithRole('admin'))->put(route('admin.withdrawal-settings.update'), [
        'admin_fee' => 5000, 'min_amount' => 50000, 'max_amount' => '',
    ])->assertSessionHasNoErrors();

    expect(WithdrawalSetting::current()->max_amount)->toBeNull();
});

it('rejects invalid settings', function (array $input, string $field) {
    $this->actingAs(userWithRole('admin'))
        ->put(route('admin.withdrawal-settings.update'), array_merge(['admin_fee' => 5000, 'min_amount' => 50000, 'max_amount' => null], $input))
        ->assertSessionHasErrors($field);

    expect(WithdrawalSetting::current()->toFrontend())->toBe(['admin_fee' => 5000, 'min_amount' => 50000, 'max_amount' => null]);
})->with([
    'max below min' => [['max_amount' => 10000], 'max_amount'],
    'negative fee' => [['admin_fee' => -1], 'admin_fee'],
    'zero min' => [['min_amount' => 0], 'min_amount'],
    'decimal fee' => [['admin_fee' => '5000.5'], 'admin_fee'],
    'absurd min' => [['min_amount' => WithdrawalSetting::MAX_CONFIGURABLE_AMOUNT + 1], 'min_amount'],
]);

it('does not let a non-admin change the settings', function () {
    $this->actingAs(userWithRole('user'))
        ->put(route('admin.withdrawal-settings.update'), ['admin_fee' => 0, 'min_amount' => 1])
        ->assertForbidden();

    expect(WithdrawalSetting::current()->admin_fee)->toBe(5000);
});

it('passes the same settings to the Withdraw form', function () {
    setWithdrawalRules(2500, 20000, 5000000);
    [$user] = investorWithBalance(100000);

    $this->actingAs($user)->get(route('user.wallet'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('User/Wallet')
            ->where('withdrawalSettings', ['admin_fee' => 2500, 'min_amount' => 20000, 'max_amount' => 5000000]));
});

it('charges the configured admin fee on submit', function () {
    setWithdrawalRules(7500, 10000);
    [$user, $account] = investorWithBalance(100000);

    $this->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => 20000,
    ])->assertSessionHasNoErrors();

    $withdrawal = Withdrawal::sole();

    expect((int) $withdrawal->amount)->toBe(20000)
        ->and((int) $withdrawal->fee)->toBe(7500)
        ->and((int) Wallet::where('user_id', $user->id)->value('balance'))->toBe(100000 - 27500);
});

it('enforces the configured min and max on submit', function (int $amount) {
    setWithdrawalRules(5000, 30000, 60000);
    [$user, $account] = investorWithBalance(1000000);

    $this->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => $amount,
    ])->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(0)
        ->and((int) Wallet::where('user_id', $user->id)->value('balance'))->toBe(1000000);
})->with(['below min' => 29999, 'above max' => 60001]);

it('accepts an amount the old hard-coded minimum would have refused', function () {
    setWithdrawalRules(1000, 10000);
    [$user, $account] = investorWithBalance(100000);

    $this->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => 10000,
    ])->assertSessionHasNoErrors();

    expect(Withdrawal::count())->toBe(1);
});

it('refuses a non-integer amount', function () {
    [$user, $account] = investorWithBalance(1000000);

    $this->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => '60000.50',
    ])->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(0);
});

it('counts the configured fee in the balance check', function () {
    setWithdrawalRules(10000, 50000);
    [$user, $account] = investorWithBalance(55000);

    $this->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => 50000,
    ])->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(0);
});
