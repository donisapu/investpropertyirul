<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Properties>
 */
class PropertiesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_name' => fake()->words(3, true),
            'property_location' => fake()->city() . ', ' . fake()->country(),
            'bedroom' => fake()->numberBetween(1, 8),
            'bathroom' => fake()->numberBetween(1, 6),
            'property_type' => fake()->randomElement(['Villa', 'House']),
            'land_area' => fake()->numberBetween(100, 1000),
            'building_area' => fake()->numberBetween(80, 800),
            'listing_url' => fake()->url(),
            'detail' => fake()->paragraph(),
            'financial' => fake()->paragraph(),
            'market' => fake()->paragraph(),
            'timeline' => fake()->paragraph(),
            'map_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.996464522964!2d115.13262797455855!3d-8.691888488538747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd246a367500001%3A0x80352220d912061e!2sCanggu%2C%20Kuta%20Utara%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1705389082000!5m2!1sen!2sid',
        ];
    }
}
