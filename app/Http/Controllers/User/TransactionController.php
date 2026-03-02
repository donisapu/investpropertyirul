<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    public function index()
    {
        return view('user.transaction');
    }
}
