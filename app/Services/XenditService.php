<?php

namespace App\Services;

use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use GuzzleHttp\Client;
use Xendit\Invoice\CreateInvoiceRequest;

class XenditService
{
    protected $invoiceApi;

    public function __construct()
    {
        $config = Configuration::getDefaultConfiguration()
            ->setApiKey(config('xendit.secret_key'));

        $this->invoiceApi = new InvoiceApi(
            new Client(),
            $config
        );
    }

    public function createInvoice($externalId, $amount, $email)
    {
        $create_invoice_request = new CreateInvoiceRequest([
            'external_id' => $externalId,
            'amount' => (float) $amount, // Pastikan float/double
            'payer_email' => $email,
            'description' => 'Investment Payment',
            'invoice_duration' => 86400,
            'currency' => 'IDR',
            'remember_me' => true,
            'success_redirect_url' => url('/user/transaction'), // Sesuaikan prefix user
            'failure_redirect_url' => url('/user/dashboard'),
        ]);

        return $this->invoiceApi->createInvoice($create_invoice_request);
    }
}
