<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends AdminController
{
    protected string $viewPath = 'admin';

    public function index()
    {
        return $this->view('index',[
            'title' => 'Dashboard'
        ]);
    }

}
