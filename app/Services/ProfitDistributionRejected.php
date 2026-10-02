<?php

namespace App\Services;

use RuntimeException;

/** A profit distribution the admin can fix (status, amount, investors). Nothing was paid. */
class ProfitDistributionRejected extends RuntimeException {}
