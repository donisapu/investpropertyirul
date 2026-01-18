<?php

namespace App\Http\Controllers;

use App\Models\Properties;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;

class PublicPropertyController extends Controller
{
    public function show(Properties $property)
    {
        $images = PropertyImage::where('property_id', $property->id)->get();
        $docs = PropertyDocument::where('property_id', $property->id)->get();

        return view('public.property.show', [
            'property' => $property,
            'images' => $images,
            'docs' => $docs,
        ]);
    }
}
