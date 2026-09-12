<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyInvestment;
use App\Models\PropertyCrowdfunding;
use App\Models\PropertyConsignment;
use App\Models\PropertyAuction;
use App\Models\Properties;

class DashboardController extends AdminController
{
    protected string $viewPath = 'admin';

    public function index()
    {
        return $this->view('index', [
            'title' => 'Dashboard',
            'investment' => PropertyInvestment::count(),
            'crowdfunding' => PropertyCrowdfunding::count(),
            'property_for_sale' => PropertyConsignment::count(),
            'auctions' => PropertyAuction::count(),
            'properties' => Properties::count(),
        ]);
    }
}
