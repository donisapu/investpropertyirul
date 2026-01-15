<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected string $viewPath = '';

    protected function view(string $view, array $data = [])
    {
        return view("pages.{$this->viewPath}.{$view}", $data);
    }
}
