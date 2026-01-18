<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class VillaController extends Controller
{
    public function show(string $slug)
    {
        return view('villas.show', [
            'slug' => $slug,
        ]);
    }
}
