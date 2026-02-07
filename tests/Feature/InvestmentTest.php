<?php

namespace Tests\Feature;

use App\Models\Properties;
use App\Models\PropertyInvestment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InvestmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_investment_index_calculation()
    {
        $property = Properties::create([
            'property_name' => 'Test Property',
            'property_location' => 'Test Location',
            'detail' => 'Detail',
            'property_type' => 'Villa',
            'building_area' => 100,
            'land_area' => 150,
            'bedroom' => 2,
            'bathroom' => 1,
            'map_url' => 'http://map.url',
            'listing_url' => 'http://listing.url',
        ]);

        $investment = PropertyInvestment::create([
            'property_id' => $property->id,
            'property_value' => 100000,
            'price_perlot' => 100,
            'total_lot' => 1000,
            'sold_lot' => 200,
            'min_lot_size' => 1,
            'max_lot_size' => 10,
            'estimated_roi' => 10,
            'roi_period' => 12,
            'status' => 'Open',
        ]);

        $response = $this->get('/investments');

        $response->assertStatus(200);
        
        // Assert Inertia data
        $page = $response->viewData('page');
        $props = $page['props'];
        $properties = $props['properties']['data'];
        
        $this->assertCount(1, $properties);
        $this->assertEquals('800', $properties[0]['tokens']); // 1000 - 200
        $this->assertEquals(20, $properties[0]['progress']); // 200/1000 * 100
        $this->assertFalse($properties[0]['sold']);
    }

    public function test_investment_show_calculation()
    {
        $property = Properties::create([
            'property_name' => 'Test Property',
            'property_location' => 'Test Location',
            'detail' => 'Detail',
            'property_type' => 'Villa',
            'building_area' => 100,
            'land_area' => 150,
            'bedroom' => 2,
            'bathroom' => 1,
            'map_url' => 'http://map.url',
            'listing_url' => 'http://listing.url',
        ]);

        $investment = PropertyInvestment::create([
            'property_id' => $property->id,
            'property_value' => 100000,
            'price_perlot' => 100,
            'total_lot' => 1000,
            'sold_lot' => 500,
            'min_lot_size' => 1,
            'max_lot_size' => 10,
            'estimated_roi' => 10,
            'roi_period' => 12,
            'status' => 'Open',
        ]);

        $response = $this->get('/investments/' . $property->id);

        $response->assertStatus(200);

        $page = $response->viewData('page');
        $props = $page['props'];
        $prop = $props['property'];

        $this->assertEquals(500, $prop['financials']['tokens_left']); // 1000 - 500
        $this->assertEquals(50, $prop['financials']['progress']); // 500/1000 * 100
    }
}
