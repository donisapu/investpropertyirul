<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyDocument>
 */
class PropertyDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_name' => fake()->randomElement(['Prospectus', 'Whitepaper', 'Legal Opinion', 'Appraisal Report', 'Financial Projection']),
            'document_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF URL
            'property_id' => \App\Models\Properties::factory(),
        ];
    }
}
