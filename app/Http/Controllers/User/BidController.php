<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\Auction\AuctionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** My Bids: the auctions and cessie the member joined (mockups/gainproperties/my-bids.html). */
class BidController extends Controller
{
    public function index(Request $request, AuctionService $auctions)
    {
        return Inertia::render('User/Bids', [
            'items' => $auctions->participationsOf($request->user()),
            'held' => $auctions->heldDepositsOf($request->user()),
        ]);
    }
}
