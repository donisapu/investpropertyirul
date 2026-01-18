<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    protected string $viewPath = '';

    protected function view(string $view, array $data = [])
    {
        // Build the view path only if $this->viewPath is not empty
        $path = $this->viewPath ? "pages.{$this->viewPath}.{$view}" : "pages.{$view}";
        return view($path, $data);
    }
}
