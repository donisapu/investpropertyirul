<?php

namespace Database\Factories;

use App\Models\Properties;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyInvestment>
 */
class PropertyInvestmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Properties::factory(),
            'property_value' => fake()->randomFloat(2, 500000000, 5000000000), // 500M - 5B
            'price_perlot' => fake()->randomFloat(2, 1000000, 10000000), // 1M - 10M
            'total_lot' => fake()->numberBetween(100, 1000),
            'min_lot_size' => 1,
            'max_lot_size' => 10,
            'estimated_roi' => fake()->randomFloat(2, 8, 25), // 8% - 25%
            'roi_period' => fake()->numberBetween(12, 60), // months
            'status' => fake()->randomElement(['Open', 'Running', 'Closed', 'Finished']),
        ];
    }
}
