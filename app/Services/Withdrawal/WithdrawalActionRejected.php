<?php

namespace App\Services\Withdrawal;

use RuntimeException;

/** An admin action that is not allowed in the Withdrawal's current state. Nothing changed. */
class WithdrawalActionRejected extends RuntimeException {}
