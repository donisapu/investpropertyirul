<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use App\Services\Withdrawal\WithdrawalRequestRejected;
use App\Services\Withdrawal\WithdrawalService;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    fakeBankChannels();
    WithdrawalSetting::current()->fill(['admin_fee' => 5000, 'min_amount' => 50000, 'max_amount' => null])->save();
});

/** @return array{0: User, 1: UserBankAccount} */
function walletOwner(string $balance, string $bankCode = 'ID_BCA'): array
{
    $user = User::forceCreate([
        'name' => 'Investor', 'email' => uniqid('wd').'@example.com', 'password' => bcrypt('secret'),
        'phone' => '081234567890', 'email_verified_at' => now(),
    ]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));
    Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => $balance]);
    $account = UserBankAccount::forceCreate([
        'user_id' => $user->id, 'bank_code' => $bankCode, 'account_number' => '1234567890', 'account_holder_name' => 'Investor',
    ]);

    return [$user, $account];
}

function balanceOf(User $user): string
{
    // Normalize: sqlite returns decimals as "95000", pgsql as "95000.00".
    return number_format((float) Wallet::where('user_id', $user->id)->value('balance'), 2, '.', '');
}

function submitWithdrawal(User $user, UserBankAccount $account, mixed $amount, array $extra = [])
{
    return test()->actingAs($user)->post(route('user.withdrawals.store'), [
        'user_bank_account_id' => $account->id,
        'amount' => $amount,
        ...$extra,
    ]);
}

it('deducts amount + fee at once and writes a WITHDRAW ledger row', function () {
    [$user, $account] = walletOwner('200000.00');

    submitWithdrawal($user, $account, 100000)
        ->assertRedirect(route('user.wallet'))
        ->assertSessionHasNoErrors();

    $withdrawal = Withdrawal::sole();
    $ledger = WalletTransaction::sole();

    expect($withdrawal->status)->toBe('pending')
        ->and($withdrawal->amount)->toBe(100000)
        ->and($withdrawal->fee)->toBe(5000)
        ->and($withdrawal->external_id)->toStartWith('WD-')
        ->and(strlen($withdrawal->external_id))->toBeLessThanOrEqual(100)
        ->and(balanceOf($user))->toBe('95000.00')
        ->and($ledger->type)->toBe('WITHDRAW')
        ->and((int) $ledger->amount)->toBe(105000)
        ->and(number_format((float) $ledger->balance_after, 2, '.', ''))->toBe('95000.00')
        ->and($ledger->reference_type)->toBe(Withdrawal::class)
        ->and($ledger->reference_id)->toBe($withdrawal->id)
        ->and($ledger->user_id)->toBe($user->id);
});

it('allows withdrawing the whole balance, to the cent', function () {
    [$user, $account] = walletOwner('55000.00');

    submitWithdrawal($user, $account, 50000)->assertSessionHasNoErrors();

    expect(balanceOf($user))->toBe('0.00');
});

it('keeps cents in the balance exact', function () {
    [$user, $account] = walletOwner('100000.75');

    submitWithdrawal($user, $account, 50000)->assertSessionHasNoErrors();

    expect(balanceOf($user))->toBe('45000.75');
});

it('refuses when the balance cannot cover amount + fee', function () {
    [$user, $account] = walletOwner('54999.99');

    submitWithdrawal($user, $account, 50000)->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(0)
        ->and(WalletTransaction::count())->toBe(0)
        ->and(balanceOf($user))->toBe('54999.99');
});

it('lets only one of two submits through when the balance covers one', function () {
    [$user, $account] = walletOwner('110000.00');

    submitWithdrawal($user, $account, 60000)->assertSessionHasNoErrors();
    submitWithdrawal($user, $account, 60000)->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(1)
        ->and(WalletTransaction::count())->toBe(1)
        ->and(balanceOf($user))->toBe('45000.00');
});

it('creates one withdrawal for a repeated submit with the same request key', function () {
    [$user, $account] = walletOwner('1000000.00');

    submitWithdrawal($user, $account, 60000, ['request_key' => 'form-abc123'])->assertSessionHasNoErrors();
    submitWithdrawal($user, $account, 60000, ['request_key' => 'form-abc123'])->assertSessionHasNoErrors();

    expect(Withdrawal::count())->toBe(1)
        ->and(balanceOf($user))->toBe('935000.00');
});

it('refuses a disabled wallet', function () {
    [$user, $account] = walletOwner('1000000.00');
    Wallet::where('user_id', $user->id)->update(['status' => 'DISABLED']);

    submitWithdrawal($user, $account, 60000)->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(0);
});

it('enforces the bank\'s own minimum', function () {
    WithdrawalSetting::current()->fill(['min_amount' => 1000])->save();
    [$user, $account] = walletOwner('1000000.00', 'ID_BSI'); // BSI minimum is 10000 in the fake catalog

    submitWithdrawal($user, $account, 9999)->assertSessionHasErrors('amount');
    submitWithdrawal($user, $account, 10000)->assertSessionHasNoErrors();

    expect(Withdrawal::count())->toBe(1);
});

it('enforces the bank\'s own maximum and increment', function () {
    Cache::put(BankChannelCatalog::CACHE_KEY, [
        ['code' => 'ID_BCA', 'name' => 'BCA', 'min' => 10000, 'max' => 100000, 'increment' => 1000],
    ], 600);
    [$user, $account] = walletOwner('1000000.00');

    submitWithdrawal($user, $account, 100001)->assertSessionHasErrors('amount');
    submitWithdrawal($user, $account, 50500)->assertSessionHasErrors('amount');

    expect(Withdrawal::count())->toBe(0);
});

it('refuses a bank that is no longer supported', function () {
    [$user, $account] = walletOwner('1000000.00', 'ID_GONE');

    submitWithdrawal($user, $account, 60000)->assertSessionHasErrors('user_bank_account_id');

    expect(Withdrawal::count())->toBe(0);
});

it('rechecks settings inside the service too', function () {
    [$user, $account] = walletOwner('1000000.00');

    expect(fn () => app(WithdrawalService::class)->request($user, $account->id, 100))
        ->toThrow(WithdrawalRequestRejected::class);

    expect(Withdrawal::count())->toBe(0);
});

it('rejects a malformed request key', function () {
    [$user, $account] = walletOwner('1000000.00');

    submitWithdrawal($user, $account, 60000, ['request_key' => 'bad key; drop'])->assertSessionHasErrors('request_key');
});
