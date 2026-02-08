<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Developer>
 */
class DeveloperFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->paragraph(),
            'image_path' => null, // We can set a default image or leave it null
            'phone' => $this->faker->phoneNumber(),
            'youtube_url' => 'https://youtube.com/@' . $this->faker->slug(),
            'facebook_url' => 'https://facebook.com/' . $this->faker->slug(),
            'instagram_url' => 'https://instagram.com/' . $this->faker->slug(),
            'tiktok_url' => 'https://tiktok.com/@' . $this->faker->slug(),
            'status' => $this->faker->randomElement(['draft', 'published']),
        ];
    }
}
