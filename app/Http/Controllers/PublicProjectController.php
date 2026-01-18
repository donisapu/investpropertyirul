<?php

namespace App\Http\Controllers;

class PublicProjectController extends Controller
{
    public function show(string $slug)
    {
        return view('projects.show', [
            'slug' => $slug,
        ]);
    }
}
