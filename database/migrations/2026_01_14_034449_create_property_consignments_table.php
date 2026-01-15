<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('property_consignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->decimal('property_value', 16, 2);
            $table->string('ownership');
            $table->enum('listing_type', ['Freehold', 'Leasehold']);
            $table->string('lease_term')->nullable();
            $table->enum('status', ['draft', 'active', 'sold', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_consignments');
    }
};
