<?php

namespace Database\Seeders;

use App\Models\Properties;
use App\Models\PropertyImage;
use App\Models\PropertyInvestment;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 properties with investments and images
        Properties::factory(10)
            ->create()
            ->each(function ($property) {
                // Create Investment details for each property
                PropertyInvestment::factory()->create([
                    'property_id' => $property->id,
                ]);

                // Create 3-5 images for each property
                PropertyImage::factory(rand(3, 5))->create([
                    'property_id' => $property->id,
                ]);
            });
    }
}
