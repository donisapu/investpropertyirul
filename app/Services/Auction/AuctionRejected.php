<?php

namespace App\Services\Auction;

/** A participant or admin action the auction does not allow; the message is shown as is. */
class AuctionRejected extends \RuntimeException
{
}
