<?php

namespace Database\Factories;

use App\Models\Properties;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $path = storage_path('app/public/properties/seed');
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        $filename = fake()->uuid() . '.jpg';
        $targetPath = $path . '/' . $filename;

        // Try to copy a sample image from public assets if available
        $sampleImages = glob(public_path('assets/img/elements/*.jpg'));
        
        if (!empty($sampleImages)) {
            $sourceImage = $sampleImages[array_rand($sampleImages)];
            copy($sourceImage, $targetPath);
        } else {
            // Fallback: Create a blank image if GD is available, otherwise just touch a file
            if (function_exists('imagecreatetruecolor')) {
                $image = imagecreatetruecolor(800, 600);
                $bg = imagecolorallocate($image, rand(200, 255), rand(200, 255), rand(200, 255));
                imagefill($image, 0, 0, $bg);
                
                // Add some text
                $text_color = imagecolorallocate($image, 50, 50, 50);
                imagestring($image, 5, 300, 280, "Property Image", $text_color);
                
                imagejpeg($image, $targetPath);
                imagedestroy($image);
            } else {
                // Last resort: just copy the favicon or create a dummy text file (won't display as image)
                touch($targetPath); 
            }
        }

        return [
            'property_id' => Properties::factory(),
            'image_url' => 'properties/seed/' . $filename,
        ];
    }
}
