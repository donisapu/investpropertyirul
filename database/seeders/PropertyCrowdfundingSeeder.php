<?php

namespace Database\Seeders;

use App\Models\Properties;
use App\Models\PropertyCrowdfunding;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use Illuminate\Database\Seeder;

class PropertyCrowdfundingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 properties with crowdfunding details and images
        Properties::factory(10)
            ->create()
            ->each(function ($property) {
                // Create Crowdfunding details for each property
                PropertyCrowdfunding::factory()->create([
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
