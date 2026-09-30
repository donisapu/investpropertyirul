<?php

namespace App\Services\Withdrawal;

/** Outcome of applying a Xendit Payout result to a Withdrawal. */
final class PayoutResult
{
    public const APPLIED = 'applied';

    public const IGNORED = 'ignored';

    /** Xendit has no Payout for this Withdrawal (never sent). */
    public const NOT_FOUND = 'not_found';
}
