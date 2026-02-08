<?php

namespace Database\Seeders;

use App\Models\Properties;
use App\Models\PropertyAuction;
use App\Models\PropertyImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertyAuctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 20 new properties specifically for auctions
        $properties = Properties::factory(20)->create();

        foreach ($properties as $property) {
            // Create 3-5 images for each property
            PropertyImage::factory(rand(3, 5))->create([
                'property_id' => $property->id,
            ]);

            PropertyAuction::factory()->create([
                'property_id' => $property->id,
                'status' => 'running', // Ensure we have running auctions to display
                'type' => collect(['auction', 'cessie'])->random(),
            ]);
        }
    }
}
