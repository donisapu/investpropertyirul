<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use App\Services\Withdrawal\WithdrawalRequestRejected;
use App\Services\Withdrawal\WithdrawalService;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/*
 * Real race: two processes submit at the same moment against one Wallet.
 * Needs a real database with row locks (Postgres), so it only runs when the
 * suite points at a *_test Postgres DB, e.g.:
 *   DB_CONNECTION=pgsql DB_DATABASE=invest_test ./vendor/bin/pest --group=concurrency
 * RefreshDatabase would hide the other process's view, so data is committed
 * and cleaned up by hand.
 */
it('lets only one of two truly concurrent submits pass', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    // Commit real rows so the forked processes can see them.
    DB::rollBack();
    if (! Schema::hasTable('withdrawals')) {
        $this->artisan('migrate');
    }
    Cache::put(BankChannelCatalog::CACHE_KEY, BankChannelCatalog::BUILT_IN, 600);
    WithdrawalSetting::current()->fill(['admin_fee' => 5000, 'min_amount' => 50000, 'max_amount' => null])->save();

    $user = User::forceCreate(['name' => 'Race', 'email' => uniqid('race').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));
    Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => '110000.00']);
    $account = UserBankAccount::forceCreate(['user_id' => $user->id, 'bank_code' => 'ID_BCA', 'account_number' => '1234567890', 'account_holder_name' => 'Race']);

    try {
        DB::disconnect();
        $pids = [];

        foreach ([1, 2] as $i) {
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    app(WithdrawalService::class)->request($user->fresh(), $account->id, 60000);
                    exit(0);
                } catch (WithdrawalRequestRejected) {
                    exit(3);
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
        sort($codes);

        DB::reconnect();

        expect($codes)->toBe([0, 3])
            ->and(Withdrawal::where('user_id', $user->id)->count())->toBe(1)
            ->and((string) Wallet::where('user_id', $user->id)->value('balance'))->toBe('45000.00');
    } finally {
        DB::table('wallet_transactions')->where('user_id', $user->id)->delete();
        Withdrawal::where('user_id', $user->id)->delete();
        UserBankAccount::withTrashed()->where('user_id', $user->id)->forceDelete();
        Wallet::where('user_id', $user->id)->delete();
        DB::table('user_roles')->where('user_id', $user->id)->delete();
        $user->delete();
        DB::beginTransaction(); // hand RefreshDatabase back the transaction it expects
    }
})->group('concurrency');
