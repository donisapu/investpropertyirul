<?php

return [
    'secret_key' => env('XENDIT_SECRET_KEY'),
    'callback_token' => env('XENDIT_CALLBACK_TOKEN'),
    'is_production' => env('XENDIT_IS_PRODUCTION', false),

    /*
    |--------------------------------------------------------------------------
    | HTTP client (App\Services\Xendit\XenditGateway)
    |--------------------------------------------------------------------------
    |
    | Test vs live mode is decided by the secret key prefix only; the host is
    | the same. Timeouts are in seconds. Xendit's own webhook timeout is 30s,
    | keep requests well below that so a slow call cannot pile up workers.
    |
    */
    'base_url' => env('XENDIT_BASE_URL', 'https://api.xendit.co'),
    'timeout' => (int) env('XENDIT_TIMEOUT', 20),
    'connect_timeout' => (int) env('XENDIT_CONNECT_TIMEOUT', 5),
];
