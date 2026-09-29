<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Codes the old 5-bank dropdown saved, mapped to Xendit payout channel codes. */
    private const LEGACY_CODES = [
        'BCA' => 'ID_BCA',
        'MANDIRI' => 'ID_MANDIRI',
        'BRI' => 'ID_BRI',
        'BNI' => 'ID_BNI',
        'CIMB' => 'ID_CIMB',
    ];

    public function up(): void
    {
        // Soft delete: withdrawals reference bank accounts with ON DELETE CASCADE,
        // so a hard delete would wipe the user's withdrawal history.
        Schema::table('user_bank_accounts', function (Blueprint $table) {
            $table->softDeletes();
            $table->index(['user_id', 'deleted_at']);
        });

        foreach (self::LEGACY_CODES as $legacy => $channelCode) {
            DB::table('user_bank_accounts')->where('bank_code', $legacy)->update(['bank_code' => $channelCode]);
        }
    }

    public function down(): void
    {
        foreach (self::LEGACY_CODES as $legacy => $channelCode) {
            DB::table('user_bank_accounts')->where('bank_code', $channelCode)->update(['bank_code' => $legacy]);
        }

        Schema::table('user_bank_accounts', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'deleted_at']);
            $table->dropSoftDeletes();
        });
    }
};
