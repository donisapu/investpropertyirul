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

it('sends only one payout when two admins approve at the same moment', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::rollBack();
    \Illuminate\Support\Facades\Notification::fake();
    // Slow Xendit: both admins are inside approve() at the same time.
    \Illuminate\Support\Facades\Http::fake(function () {
        usleep(300000);

        return \Illuminate\Support\Facades\Http::response(['id' => 'disb-race-'.getmypid(), 'status' => 'ACCEPTED']);
    });

    $admin = User::forceCreate(['name' => 'Admin race', 'email' => uniqid('adm').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $user = User::forceCreate(['name' => 'Race user', 'email' => uniqid('ru').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $account = UserBankAccount::forceCreate(['user_id' => $user->id, 'bank_code' => 'ID_BCA', 'account_number' => '1234567890', 'account_holder_name' => 'Race user']);
    $withdrawal = Withdrawal::forceCreate([
        'user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-RACE-'.uniqid(),
        'amount' => 60000, 'fee' => 5000, 'status' => 'pending',
    ]);

    try {
        DB::disconnect();
        $pids = [];
        foreach ([1, 2] as $i) {
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    $attempt = app(WithdrawalService::class)->approve($withdrawal, $admin);
                    exit($attempt->outcome === 'sent' ? 0 : 1);
                } catch (\App\Services\Withdrawal\WithdrawalActionRejected) {
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

        $fresh = $withdrawal->fresh();
        expect($codes)->toBe([0, 3])
            ->and($fresh->status)->toBe('processing')
            ->and($fresh->xendit_id)->toStartWith('disb-race-');
    } finally {
        Withdrawal::whereKey($withdrawal->id)->delete();
        UserBankAccount::withTrashed()->whereKey($account->id)->forceDelete();
        Wallet::whereIn('user_id', [$user->id, $admin->id])->delete();
        User::whereIn('id', [$user->id, $admin->id])->delete();
        DB::beginTransaction();
    }
})->group('concurrency');

it('lets only one of two concurrent cash-outs through when together they pass the limit', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::rollBack();
    // CASH 100M, no Reserve: each cash-out of 60M fits alone, both together do not.
    // Like real Xendit, a created payout leaves CASH at once. A file is the shared
    // state, because each admin runs in its own process.
    $paidOut = tempnam(sys_get_temp_dir(), 'paid');
    file_put_contents($paidOut, '0');
    \Illuminate\Support\Facades\Http::fake([
        'api.xendit.co/balance*' => function () use ($paidOut) {
            usleep(200000); // slow balance read: both admins are inside at once

            return \Illuminate\Support\Facades\Http::response(['balance' => 100000000 - (int) file_get_contents($paidOut)]);
        },
        'api.xendit.co/v2/payouts' => function (\Illuminate\Http\Client\Request $r) use ($paidOut) {
            $fp = fopen($paidOut, 'c+');
            flock($fp, LOCK_EX);
            $paid = (int) stream_get_contents($fp) + (int) $r['amount'];
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, (string) $paid);
            flock($fp, LOCK_UN);
            fclose($fp);

            return \Illuminate\Support\Facades\Http::response(['id' => 'disb-co-'.uniqid(), 'status' => 'ACCEPTED']);
        },
    ]);
    WithdrawalSetting::current()->fill(['company_bank_code' => 'ID_BCA', 'company_account_number' => '5410992291', 'company_account_holder' => 'PT Gain'])->save();
    $admin = User::forceCreate(['name' => 'Admin co', 'email' => uniqid('adm').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $mirror = app(\App\Services\Xendit\TransactionMirror::class);
    $ids = [];
    foreach ([1, 2] as $i) {
        $xid = 'txn_race_'.$i.'_'.uniqid();
        $mirror->upsert(['id' => $xid, 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'SETTLED', 'amount' => 60000000,
            'created' => now()->toIso8601String(), 'updated' => now()->toIso8601String()]);
        $ids[] = \App\Models\XenditTransaction::where('xendit_id', $xid)->value('id');
    }
    $walletsBefore = \App\Models\Wallet::where('balance', '>', 0)->count();

    try {
        expect($walletsBefore)->toBe(0); // the Reserve must be empty for this scenario
        DB::disconnect();
        $pids = [];
        foreach ($ids as $txnId) {
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    app(\App\Services\Cashout\CashoutService::class)->create($admin, [$txnId]);
                    exit(0);
                } catch (\App\Services\Cashout\CashoutRejected) {
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
            ->and(\App\Models\CompanyCashout::whereIn('created_by', [$admin->id])->count())->toBe(1);
    } finally {
        DB::table('company_cashout_transaction')->whereIn('xendit_transaction_id', $ids)->delete();
        \App\Models\CompanyCashout::where('created_by', $admin->id)->delete();
        \App\Models\XenditTransaction::whereKey($ids)->delete();
        User::whereKey($admin->id)->delete();
        @unlink($paidOut);
        DB::beginTransaction();
    }
})->group('concurrency');
