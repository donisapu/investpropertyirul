<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * PF-07: a paid invoice that no longer fits its product is refunded into the user's Wallet.
 * payments.refunded_at is set once, so a refund can never happen twice.
 */
return new class extends Migration
{
    private const LEDGER_TYPES = ['TOPUP', 'WITHDRAW', 'WITHDRAW_REFUND', 'INVEST_BUY', 'INVEST_SELL', 'PROFIT', 'PAYMENT_REFUND'];

    private const OLD_LEDGER_TYPES = ['TOPUP', 'WITHDRAW', 'WITHDRAW_REFUND', 'INVEST_BUY', 'INVEST_SELL', 'PROFIT'];

    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->timestamp('refunded_at')->nullable()->after('needs_refund');
        });

        $this->setAllowedValues('wallet_transactions', 'type', self::LEDGER_TYPES);
    }

    public function down(): void
    {
        if (DB::table('wallet_transactions')->where('type', 'PAYMENT_REFUND')->exists()) {
            throw new RuntimeException('Wallet ledger has PAYMENT_REFUND rows; refusing to drop the type.');
        }

        $this->setAllowedValues('wallet_transactions', 'type', self::OLD_LEDGER_TYPES);

        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('refunded_at');
        });
    }

    /**
     * Replace the allowed values of an enum column (a CHECK constraint on pgsql/sqlite,
     * a native ENUM on mysql). Same approach as 2026_09_29_140000_withdrawal_state_machine.
     */
    private function setAllowedValues(string $table, string $column, array $values): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE \"{$table}\" DROP CONSTRAINT IF EXISTS \"{$table}_{$column}_check\"");
            $list = implode(', ', array_map(fn ($v) => DB::getPdo()->quote($v), $values));
            DB::statement("ALTER TABLE \"{$table}\" ADD CONSTRAINT \"{$table}_{$column}_check\" CHECK (\"{$column}\" IN ({$list}))");

            return;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            $list = implode(', ', array_map(fn ($v) => DB::getPdo()->quote($v), $values));
            DB::statement("ALTER TABLE `{$table}` MODIFY `{$column}` ENUM({$list}) NOT NULL");

            return;
        }

        if ($driver === 'sqlite') {
            // SQLite cannot alter a CHECK constraint: rewrite it in the stored schema.
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
};
