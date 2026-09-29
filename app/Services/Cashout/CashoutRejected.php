<?php

namespace App\Services\Cashout;

use RuntimeException;

/** A Cash-out that was refused before anything was sent or locked. */
class CashoutRejected extends RuntimeException
{
    public function __construct(string $message, public readonly ?int $total = null, public readonly ?int $max = null)
    {
        parent::__construct($message);
    }
}
