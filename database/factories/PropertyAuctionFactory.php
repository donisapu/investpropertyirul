<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Properties;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyAuction>
 */
class PropertyAuctionFactory extends Factory
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
            'open_bid' => $this->faker->numberBetween(100000000, 1000000000),
            'bid_increment' => $this->faker->numberBetween(1000000, 10000000),
            'date_start' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_finish' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['scheduled', 'running', 'finished']),
            'type' => $this->faker->randomElement(['auction', 'cessie']),
        ];
    }
}
