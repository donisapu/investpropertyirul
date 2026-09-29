<?php

namespace App\Services\Withdrawal;

use RuntimeException;

/**
 * A Withdrawal request the user can fix (balance, limits, bank). Nothing was
 * deducted. `field` is the form field the message belongs to.
 */
class WithdrawalRequestRejected extends RuntimeException
{
    public function __construct(public readonly string $field, string $message)
    {
        parent::__construct($message);
    }
}
