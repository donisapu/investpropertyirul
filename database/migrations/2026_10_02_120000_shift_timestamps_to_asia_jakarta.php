<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * app.timezone moved from UTC to Asia/Jakarta. Every timestamp column was
 * written by now() in UTC (none is user-entered), so shift existing values
 * by +7 hours to keep them correct when read back as WIB.
 *
 * Run with the app in maintenance mode, so no row is written in WIB before
 * the shift and then moved a second time.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->shift('+');
    }

    public function down(): void
    {
        $this->shift('-');
    }

    private function shift(string $sign): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        $columns = DB::select(<<<'SQL'
            select table_name, column_name
            from information_schema.columns
            where table_schema = current_schema()
              and data_type = 'timestamp without time zone'
              and table_name <> 'migrations'
            order by table_name, column_name
        SQL);

        DB::transaction(function () use ($columns, $sign) {
            foreach ($columns as $c) {
                DB::statement(sprintf(
                    'update "%s" set "%s" = "%s" %s interval \'7 hours\' where "%s" is not null',
                    $c->table_name, $c->column_name, $c->column_name, $sign, $c->column_name,
                ));
            }
        });
    }
};
