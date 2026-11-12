<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Lelang & Cessie (USE-CASES.md §C): a deposit % per auction, opening/closing times with
 * hours (C3), the closing statuses, deposits per participant and the winner's settlement.
 */
return new class extends Migration
{
    private const STATUSES = ['draft', 'upcoming', 'active', 'closed', 'awaiting_payment', 'completed', 'no_winner', 'defaulted', 'cancelled', 'suspended'];

    private const OLD_STATUSES = ['draft', 'upcoming', 'active', 'closed', 'suspended'];

    public function up(): void
    {
        Schema::table('property_auctions', function (Blueprint $table) {
            // % of open_bid (the limit); at least 5 (client, 7 Nov 2026).
            $table->decimal('deposit_percent', 5, 2)->nullable();
            $table->unsignedSmallInteger('payment_days')->default(7);
            $table->text('terms')->nullable();
            // A bid in the last 5 minutes pushes the closing time to 5 minutes after it (C13).
            $table->boolean('anti_sniping')->default(false);
            $table->foreignId('winner_bid_id')->nullable()->constrained('auction_bids')->nullOnDelete();
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancel_reason')->nullable();
        });

        Schema::create('auction_deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_auction_id')->constrained()->cascadeOnDelete();
            // Copied from the auction: a plain belongsTo for screens that eager-load payable.property.
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('percent', 5, 2);
            $table->decimal('amount', 16, 2);
            // pending | paid (held) | refunded (to the Wallet) | applied (to the settlement) | forfeited | expired
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('auction_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_auction_id')->constrained()->cascadeOnDelete();
            // Copied from the auction: a plain belongsTo for screens that eager-load payable.property.
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('auction_deposit_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('price', 16, 2);
            $table->decimal('deposit_amount', 16, 2);
            // What is left to pay: price minus the deposit.
            $table->decimal('amount', 16, 2);
            // pending | paid | defaulted
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('due_at');
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('paid_manually_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('manual_note')->nullable();
            $table->timestamps();
        });

        // Deposit is mandatory, at least 5% (client): existing auctions get the minimum.
        DB::table('property_auctions')->whereNull('deposit_percent')->update(['deposit_percent' => 5]);

        $this->datesWithHours();
        $this->setStatuses(self::STATUSES);
    }

    public function down(): void
    {
        DB::table('property_auctions')->whereNotIn('status', self::OLD_STATUSES)->update(['status' => 'closed']);
        $this->setStatuses(self::OLD_STATUSES);

        Schema::dropIfExists('auction_settlements');
        Schema::dropIfExists('auction_deposits');
        Schema::table('property_auctions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('winner_bid_id');
            $table->dropColumn(['deposit_percent', 'payment_days', 'terms', 'anti_sniping', 'closed_at', 'cancelled_at', 'cancel_reason']);
        });
        // date_start / date_finish stay DATETIME: narrowing them would drop the hours.
    }

    /** DATE → DATETIME. An old auction opens at 00:00 and closes at 23:59:59 on its dates. */
    private function datesWithHours(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE "property_auctions" ALTER COLUMN "date_start" TYPE timestamp(0) without time zone USING "date_start"::timestamp');
            DB::statement('ALTER TABLE "property_auctions" ALTER COLUMN "date_finish" TYPE timestamp(0) without time zone USING ("date_finish"::timestamp + interval \'23 hours 59 minutes 59 seconds\')');

            return;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement('ALTER TABLE `property_auctions` MODIFY `date_start` DATETIME NOT NULL, MODIFY `date_finish` DATETIME NOT NULL');
            DB::statement("UPDATE `property_auctions` SET `date_finish` = ADDTIME(`date_finish`, '23:59:59') WHERE TIME(`date_finish`) = '00:00:00'");

            return;
        }

        if ($driver === 'sqlite') {
            DB::statement("update property_auctions set date_start = date_start || ' 00:00:00' where length(date_start) = 10");
            DB::statement("update property_auctions set date_finish = date_finish || ' 23:59:59' where length(date_finish) = 10");
            $this->rewriteSqliteSchema(fn ($sql) => preg_replace('/"(date_start|date_finish)" date /i', '"$1" datetime ', $sql, -1));

            return;
        }

        throw new RuntimeException("Unsupported database driver for this migration: {$driver}");
    }

    private function setStatuses(array $values): void
    {
        $driver = DB::connection()->getDriverName();
        $list = implode(', ', array_map(fn ($v) => DB::getPdo()->quote($v), $values));

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE "property_auctions" DROP CONSTRAINT IF EXISTS "property_auctions_status_check"');
            DB::statement("ALTER TABLE \"property_auctions\" ADD CONSTRAINT \"property_auctions_status_check\" CHECK (\"status\" IN ({$list}))");

            return;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE `property_auctions` MODIFY `status` ENUM({$list}) NOT NULL DEFAULT 'draft'");

            return;
        }

        if ($driver === 'sqlite') {
            $this->rewriteSqliteSchema(function ($sql) use ($list) {
                $new = preg_replace('/check \("status" in \([^)]*\)\)/i', 'check ("status" in ('.$list.'))', $sql, 1, $count);
                if ($count !== 1) {
                    throw new RuntimeException('Could not find the property_auctions.status CHECK constraint.');
                }

                return $new;
            });

            return;
        }

        throw new RuntimeException("Unsupported database driver for this migration: {$driver}");
    }

    /** SQLite cannot alter a column: rewrite the stored CREATE TABLE (as in 2026_09_30_090000). */
    private function rewriteSqliteSchema(callable $rewrite): void
    {
        $sql = DB::selectOne("select sql from sqlite_master where type = 'table' and name = 'property_auctions'")->sql;
        $version = (int) DB::selectOne('PRAGMA schema_version')->schema_version;
        DB::statement('PRAGMA writable_schema = ON');
        DB::update("update sqlite_master set sql = ? where type = 'table' and name = 'property_auctions'", [$rewrite($sql)]);
        DB::statement('PRAGMA schema_version = '.($version + 1));
        DB::statement('PRAGMA writable_schema = OFF');
    }
};
