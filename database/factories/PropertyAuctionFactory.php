<?php

namespace Database\Factories;

use App\Models\Properties;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            'status' => $this->faker->randomElement(['upcoming', 'active', 'closed']),
            'type' => $this->faker->randomElement(array_keys(\App\Models\PropertyAuction::TYPES)),
        ];
    }
}
