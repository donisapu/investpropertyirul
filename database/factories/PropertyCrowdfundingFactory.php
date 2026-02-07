<?php

namespace Database\Factories;

use App\Models\Properties;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyCrowdfunding>
 */
class PropertyCrowdfundingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fundingGoal = fake()->randomFloat(2, 100000000, 2000000000); // 100M - 2B
        $status = fake()->randomElement(['draft', 'open', 'success', 'inactive']);
        
        $collected = 0;
        if ($status === 'success') {
            $collected = $fundingGoal;
        } elseif ($status === 'open') {
            $collected = fake()->randomFloat(2, 0, $fundingGoal * 0.9); // 0 - 90%
        }

        return [
            'property_id' => Properties::factory(),
            'funding_goal' => $fundingGoal,
            'collected_amount' => $collected,
            'min_contribution' => fake()->randomElement([100000, 500000, 1000000, 5000000]),
            'estimated_roi' => fake()->randomFloat(2, 5, 20), // 5% - 20%
            'tenor' => fake()->randomElement([6, 12, 18, 24, 36]), // months
            'status' => $status,
        ];
    }
}
