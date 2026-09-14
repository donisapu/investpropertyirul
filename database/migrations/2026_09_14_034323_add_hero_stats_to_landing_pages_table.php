<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Statistik hero (mis. "250+ Properties") sebelumnya di-hardcode di
     * Hero.jsx di bawah komentar "DUMMY BUSINESS STATS". Angka itu tidak
     * bisa dipertanggungjawabkan untuk produk finansial, jadi dipindah ke
     * database agar hanya tampil bila admin mengisinya dengan data nyata.
     *
     * Semua nullable: bila kosong, strip statistik tidak dirender sama sekali.
     */
    public function up(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->string('stat_1_value')->nullable();
            $table->string('stat_1_label')->nullable();
            $table->string('stat_2_value')->nullable();
            $table->string('stat_2_label')->nullable();
            $table->string('stat_3_value')->nullable();
            $table->string('stat_3_label')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->dropColumn([
                'stat_1_value',
                'stat_1_label',
                'stat_2_value',
                'stat_2_label',
                'stat_3_value',
                'stat_3_label',
            ]);
        });
    }
};
