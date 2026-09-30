<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Full Withdrawal state machine (spec 02, "Withdrawal state machine"):
 *
 *   pending --approve--> processing --payout.succeeded--> succeeded --payout.reversed--> reversed
 *      |                      \--payout.failed/cancelled--> failed
 *      \--reject--> rejected
 *
 * "completed" is renamed to "succeeded". Also adds WITHDRAW_REFUND to the wallet ledger.
 */
return new class extends Migration
{
    private const STATUSES = ['pending', 'processing', 'succeeded', 'failed', 'rejected', 'reversed'];

    private const OLD_STATUSES = ['pending', 'completed', 'failed'];

    private const LEDGER_TYPES = ['TOPUP', 'WITHDRAW', 'WITHDRAW_REFUND', 'INVEST_BUY', 'INVEST_SELL', 'PROFIT'];

    private const OLD_LEDGER_TYPES = ['TOPUP', 'WITHDRAW', 'INVEST_BUY', 'INVEST_SELL', 'PROFIT'];

    public function up(): void
    {
        Schema::table('withdrawals', function (Blueprint $table) {
            $table->string('failure_code')->nullable()->after('failure_reason');
            $table->string('payout_status')->nullable()->after('xendit_id');
            $table->foreignId('approved_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->timestamp('processed_at')->nullable()->after('approved_at');
            // Set once when the Wallet is refunded, so a refund can never happen twice.
            $table->timestamp('refunded_at')->nullable()->after('processed_at');
            // Client-generated key per submit: a double click cannot create two Withdrawals.
            $table->string('request_key', 64)->nullable()->after('external_id');
            $table->unique(['user_id', 'request_key']);
            $table->index('status');
        });

        $this->setAllowedValues('withdrawals', 'status', self::STATUSES, ['completed' => 'succeeded'], 'pending');
        $this->setAllowedValues('wallet_transactions', 'type', self::LEDGER_TYPES);
    }

    public function down(): void
    {
        $this->setAllowedValues('wallet_transactions', 'type', self::OLD_LEDGER_TYPES, ['WITHDRAW_REFUND' => 'TOPUP']);
        $this->setAllowedValues('withdrawals', 'status', self::OLD_STATUSES, [
            'succeeded' => 'completed',
            'processing' => 'pending',
            'rejected' => 'failed',
            'reversed' => 'failed',
        ], 'pending');

        Schema::table('withdrawals', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropUnique(['user_id', 'request_key']);
            $table->dropConstrainedForeignId('approved_by');
            $table->dropColumn(['failure_code', 'payout_status', 'approved_at', 'processed_at', 'refunded_at', 'request_key']);
        });
    }

    /**
     * Replace the allowed values of an enum column (Laravel stores it as a CHECK
     * constraint on pgsql/sqlite and a native ENUM on mysql), renaming values first.
     */
    private function setAllowedValues(string $table, string $column, array $values, array $renames = [], ?string $default = null): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE \"{$table}\" DROP CONSTRAINT IF EXISTS \"{$table}_{$column}_check\"");
            $this->rename($table, $column, $renames);
            $list = implode(', ', array_map(fn ($v) => DB::getPdo()->quote($v), $values));
            DB::statement("ALTER TABLE \"{$table}\" ADD CONSTRAINT \"{$table}_{$column}_check\" CHECK (\"{$column}\" IN ({$list}))");

            return;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            $list = implode(', ', array_map(fn ($v) => DB::getPdo()->quote($v), array_unique([...$values, ...array_keys($renames)])));
            DB::statement("ALTER TABLE `{$table}` MODIFY `{$column}` ENUM({$list}) NOT NULL".($default ? ' DEFAULT '.DB::getPdo()->quote($default) : ''));
            $this->rename($table, $column, $renames);
            $list = implode(', ', array_map(fn ($v) => DB::getPdo()->quote($v), $values));
            DB::statement("ALTER TABLE `{$table}` MODIFY `{$column}` ENUM({$list}) NOT NULL".($default ? ' DEFAULT '.DB::getPdo()->quote($default) : ''));

            return;
        }

        if ($driver === 'sqlite') {
            // SQLite cannot alter a CHECK constraint: rewrite it in the stored schema.
            $this->rename($table, $column, $renames, withoutCheck: true);
            $sql = DB::selectOne('select sql from sqlite_master where type = ? and name = ?', ['table', $table])->sql;
            $list = implode(', ', array_map(fn ($v) => "'".str_replace("'", "''", $v)."'", $values));
            $newSql = preg_replace('/check \("'.preg_quote($column, '/').'" in \([^)]*\)\)/i', "check (\"{$column}\" in ({$list}))", $sql, 1, $count);

            if ($count !== 1) {
                throw new RuntimeException("Could not find the {$table}.{$column} CHECK constraint to replace.");
            }

            $version = (int) DB::selectOne('PRAGMA schema_version')->schema_version;
            DB::statement('PRAGMA writable_schema = ON');
            DB::update('update sqlite_master set sql = ? where type = ? and name = ?', [$newSql, 'table', $table]);
            // Bumping schema_version makes SQLite reload the schema, so the new CHECK applies now.
            DB::statement('PRAGMA schema_version = '.($version + 1));
            DB::statement('PRAGMA writable_schema = OFF');

            return;
        }

        throw new RuntimeException("Unsupported database driver for this migration: {$driver}");
    }

    private function rename(string $table, string $column, array $renames, bool $withoutCheck = false): void
    {
        if ($withoutCheck && $renames !== []) {
            DB::statement('PRAGMA ignore_check_constraints = ON');
        }

        foreach ($renames as $from => $to) {
            DB::table($table)->where($column, $from)->update([$column => $to]);
        }

        if ($withoutCheck && $renames !== []) {
            DB::statement('PRAGMA ignore_check_constraints = OFF');
        }
    }
};
