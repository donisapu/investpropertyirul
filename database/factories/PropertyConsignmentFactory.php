<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyConsignment>
 */
class PropertyConsignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ownership = fake()->randomElement(['Freehold', 'Leasehold']);
        
        return [
            'property_value' => fake()->numberBetween(1000000000, 50000000000), // 1 Billion to 50 Billion
            'ownership' => $ownership,
            'listing_type' => $ownership, // The migration restricts this to ['Freehold', 'Leasehold']
            'lease_term' => $ownership === 'Leasehold' ? fake()->numberBetween(10, 50) : null,
            'status' => fake()->randomElement(['active', 'sold', 'inactive']),
        ];
    }
}
