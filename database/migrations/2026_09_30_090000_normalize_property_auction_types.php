<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * property_auctions.type had two value sets: the create migration made
 * Lelang/Cessie, a later one auction/cessie (skipped on fresh installs).
 * Depending on the database the admin form or the public pages broke.
 * One set from now on: auction | cessie (labels "Lelang" / "Cessie" in the UI).
 */
return new class extends Migration
{
    private const VALUES = ['auction', 'cessie'];

    private const LEGACY = ['Lelang' => 'auction', 'lelang' => 'auction', 'Auction' => 'auction', 'Cessie' => 'cessie'];

    public function up(): void
    {
        $this->setAllowedValues(self::VALUES, self::LEGACY, 'auction');
    }

    public function down(): void
    {
        // Back to what the create migration made.
        $this->setAllowedValues(['Lelang', 'Cessie'], ['auction' => 'Lelang', 'cessie' => 'Cessie'], 'Lelang');
    }

    private function setAllowedValues(array $values, array $renames, string $default): void
    {
        $driver = DB::connection()->getDriverName();
        $quote = fn (string $v) => DB::getPdo()->quote($v);
        $list = implode(', ', array_map($quote, $values));

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE "property_auctions" DROP CONSTRAINT IF EXISTS "property_auctions_type_check"');
            $this->rename($renames);
            DB::statement("ALTER TABLE \"property_auctions\" ADD CONSTRAINT \"property_auctions_type_check\" CHECK (\"type\" IN ({$list}))");
            DB::statement('ALTER TABLE "property_auctions" ALTER COLUMN "type" SET DEFAULT '.$quote($default));

            return;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            $wide = implode(', ', array_map($quote, array_unique([...$values, ...array_keys($renames)])));
            DB::statement("ALTER TABLE `property_auctions` MODIFY `type` ENUM({$wide}) NOT NULL DEFAULT ".$quote($default));
            $this->rename($renames);
            DB::statement("ALTER TABLE `property_auctions` MODIFY `type` ENUM({$list}) NOT NULL DEFAULT ".$quote($default));

            return;
        }

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA ignore_check_constraints = ON');
            $this->rename($renames);
            DB::statement('PRAGMA ignore_check_constraints = OFF');

            $sql = DB::selectOne("select sql from sqlite_master where type = 'table' and name = 'property_auctions'")->sql;
            $sql = preg_replace('/check \("type" in \([^)]*\)\)/i', 'check ("type" in ('.$list.'))', $sql, 1, $checks);
            // First "default '...'" after the type column (the CHECK list above contains commas).
            $sql = preg_replace('/("type" varchar.*?default )\'[^\']*\'/is', '$1'.$quote($default), $sql, 1);

            if ($checks !== 1) {
                throw new RuntimeException('Could not find the property_auctions.type CHECK constraint.');
            }

            $version = (int) DB::selectOne('PRAGMA schema_version')->schema_version;
            DB::statement('PRAGMA writable_schema = ON');
            DB::update("update sqlite_master set sql = ? where type = 'table' and name = 'property_auctions'", [$sql]);
            DB::statement('PRAGMA schema_version = '.($version + 1));
            DB::statement('PRAGMA writable_schema = OFF');

            return;
        }

        throw new RuntimeException("Unsupported database driver for this migration: {$driver}");
    }

    private function rename(array $renames): void
    {
        foreach ($renames as $from => $to) {
            DB::table('property_auctions')->where('type', $from)->update(['type' => $to]);
        }
    }
};
