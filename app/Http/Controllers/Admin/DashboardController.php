<?php

namespace App\Http\Controllers\Admin;

class DashboardController extends AdminController
{
    protected string $viewPath = 'admin';

    public function index()
    {
        return $this->view('index', [
            'title' => 'Dashboard',
        ]);
    }
}
