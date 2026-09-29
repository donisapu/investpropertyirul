<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Xendit\Configuration;
use Xendit\BalanceAndTransaction\BalanceApi;
use Xendit\Invoice\InvoiceApi;

class XenditDashboardController extends Controller
{
    protected BalanceApi $balanceApi;
    protected InvoiceApi $invoiceApi;

    public function __construct()
    {
        Configuration::setXenditKey(config('xendit.secret_key'));
        $this->balanceApi = new BalanceApi();
        $this->invoiceApi = new InvoiceApi();
    }

    public function index()
    {
        $balance = null;
        $invoices = [];
        $xenditError = null;

        try {
            $balance = $this->balanceApi->getBalance(
                'CASH',
                'IDR',
                null,
                null
            );

            $invoices = $this->invoiceApi->getInvoices(
                null,
                null,
                null,
                10,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
        } catch (\Throwable $e) {
            $xenditError = $e->getMessage();
        }

        return view('pages.admin.xendit', [
            'balance' => $balance?->getBalance(),
            'invoices' => $invoices,
            'xenditError' => $xenditError,
            'title' => 'Xendit Dashboard',
        ]);
    }
}
