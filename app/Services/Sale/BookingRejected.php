<?php

namespace App\Services\Sale;

use RuntimeException;

/** A booking action that cannot happen; the message is shown to the person as is. */
class BookingRejected extends RuntimeException
{
}
