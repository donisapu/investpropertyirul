<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Single-row table. Amounts are whole IDR (Xendit payouts take integer IDR).
        Schema::create('withdrawal_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_fee')->default(5000);
            $table->unsignedBigInteger('min_amount')->default(50000);
            $table->unsignedBigInteger('max_amount')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        DB::table('withdrawal_settings')->insert([
            'admin_fee' => 5000,
            'min_amount' => 50000,
            'max_amount' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('withdrawal_settings');
    }
};
