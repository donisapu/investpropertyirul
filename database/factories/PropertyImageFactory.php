<?php

namespace Database\Factories;

use App\Models\Properties;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    private static $propertyImages = [
        'https://images.unsplash.com/photo-1600596542815-2a4d9f010b9a?w=800&q=80', // Modern House
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Villa
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Modern Interior
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Living Room
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', // Kitchen
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80', // Bedroom
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', // Luxury House
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', // Small House
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&q=80', // Garden
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', // House
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $path = storage_path('app/public/properties/seed');
        $cachePath = storage_path('app/public/properties/seed/cache');

        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }
        if (!file_exists($cachePath)) {
            mkdir($cachePath, 0755, true);
        }

        // Pick a random image source
        $url = fake()->randomElement(self::$propertyImages);
        $hash = md5($url);
        $cachedImage = $cachePath . '/' . $hash . '.jpg';

        // Download to cache if not exists
        if (!file_exists($cachedImage)) {
            try {
                $contents = file_get_contents($url);
                if ($contents !== false) {
                    file_put_contents($cachedImage, $contents);
                }
            } catch (\Exception $e) {
                // Fallback if download fails: Create a blank image if GD is available
                if (function_exists('imagecreatetruecolor')) {
                    $image = imagecreatetruecolor(800, 600);
                    $bg = imagecolorallocate($image, rand(200, 255), rand(200, 255), rand(200, 255));
                    imagefill($image, 0, 0, $bg);
                    
                    // Add some text
                    $text_color = imagecolorallocate($image, 50, 50, 50);
                    imagestring($image, 5, 300, 280, "Property Image (Offline)", $text_color);
                    
                    imagejpeg($image, $cachedImage);
                    imagedestroy($image);
                }
            }
        }

        // Create unique file for this record
        $filename = fake()->uuid() . '.jpg';
        $targetPath = $path . '/' . $filename;

        if (file_exists($cachedImage)) {
            copy($cachedImage, $targetPath);
        } else {
            // Last resort: just touch a file
            touch($targetPath); 
        }

        return [
            'property_id' => Properties::factory(),
            'image_url' => 'properties/seed/' . $filename,
        ];
    }
}
