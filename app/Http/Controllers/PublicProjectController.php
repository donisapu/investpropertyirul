<?php

namespace App\Http\Controllers;

use App\Models\DeveloperProject;
use App\Models\DeveloperProjectImage;
use App\Models\Partner;
use App\Models\WebsiteSetting;

class PublicProjectController extends Controller
{
    public function show(string $slug)
    {
        $project = DeveloperProject::where('slug',$slug)->first();
        $image   = DeveloperProjectImage::where('project_id',$project->id)->get();
        $partner = Partner::all();
        $settings = WebsiteSetting::getSettings();
        return view('projects.show', [
            'slug' => $slug,
            'project' => $project,
            'image'   => $image,
            'partner' => $partner,
            'setting' => $settings
        ]);
    }
}
