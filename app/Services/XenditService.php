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

    /**
     * $description is what the payer (and Xendit's reviewers) see on the invoice, so name the
     * actual product, e.g. "Booking Fee - <property>" or "Deposit Lelang - <property>".
     */
    public function createInvoice($externalId, $amount, $email, string $description)
    {
        $create_invoice_request = new CreateInvoiceRequest([
            'external_id' => $externalId,
            'amount' => (float) $amount, // Pastikan float/double
            'payer_email' => $email,
            'description' => $description,
            'invoice_duration' => config('xendit.invoice_duration'),
            'currency' => 'IDR',
            'remember_me' => true,
            'success_redirect_url' => url('/user/transaction'), // Sesuaikan prefix user
            'failure_redirect_url' => url('/user/dashboard'),
        ]);

        return $this->invoiceApi->createInvoice($create_invoice_request);
    }
}
