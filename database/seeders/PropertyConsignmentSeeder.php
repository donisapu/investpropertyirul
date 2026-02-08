<?php

namespace Database\Seeders;

use App\Models\Properties;
use App\Models\PropertyConsignment;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use Illuminate\Database\Seeder;

class PropertyConsignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 20 properties with consignment details and images
        Properties::factory(20)
            ->create()
            ->each(function ($property) {
                // Create Consignment details for each property
                PropertyConsignment::factory()->create([
                    'property_id' => $property->id,
                ]);

                // Create 3-5 images for each property
                PropertyImage::factory(rand(3, 5))->create([
                    'property_id' => $property->id,
                ]);

                // Create 1-3 documents for each property
                PropertyDocument::factory(rand(1, 3))->create([
                    'property_id' => $property->id,
                ]);
            });
    }
}
