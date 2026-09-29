<?php

namespace App\Http\Controllers\Admin;

use App\Services\Xendit\XenditOverview;

/**
 * Admin Xendit Dashboard (mockup "Admin · Xendit Dashboard"). Always renders:
 * when Xendit is down the balances fall back to the last known values.
 */
class XenditDashboardController extends AdminController
{
    protected string $viewPath = 'xendit_dashboard';

    public function index(XenditOverview $overview)
    {
        return $this->view('index', [
            'title' => 'Xendit Dashboard',
            ...$overview->build(),
        ]);
    }
}
