<?php

namespace App\Http\Controllers;

use App\Models\PropertyAuction;
use App\Services\Auction\AuctionRejected;
use App\Services\Auction\AuctionService;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AuctionController extends Controller
{
    public function index()
    {
        $auctions = PropertyAuction::with(['property', 'property.images'])
            ->whereNotIn('status', ['draft', 'cancelled'])
            ->orderBy('date_start', 'asc')
            ->paginate(9);

        $auctions->through(function ($auction) {
            if ($auction->property && $auction->property->images) {
                $auction->property->images->each(function ($image) {
                    $image->image_url = Storage::url($image->image_url);
                });
            }
            return $auction;
        });

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Auctions/Index', [
            'auctions' => $auctions,
            'settings' => $settings
        ]);
    }

    public function show($id, AuctionService $auctions)
    {
        // Not bids.user: bidders stay anonymous on the public page (C22, see participation.bids).
        $auction = PropertyAuction::with(['property', 'property.images', 'property.documents'])
            ->where('status', '!=', 'draft')
            ->findOrFail($id);

        if ($auction->property) {
            if ($auction->property->images) {
                $auction->property->images->each(function ($image) {
                    $image->image_url = Storage::url($image->image_url);
                });
            }
            if ($auction->property->documents) {
                $auction->property->documents->each(function ($document) {
                    $document->document_url = Storage::url($document->document_url);
                });
            }
        }

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Auctions/Show', [
            'auction' => $auction,
            'settings' => $settings,
            'participation' => $auctions->stateFor($auction, Auth::user()),
        ]);
    }

    public function deposit(int $id, AuctionService $auctions)
    {
        return $this->toInvoice(fn () => $auctions->payDeposit($id, Auth::user()), 'deposit');
    }

    public function settle(int $id, AuctionService $auctions)
    {
        return $this->toInvoice(fn () => $auctions->paySettlement($id, Auth::user()), 'settlement');
    }

    public function placeBid(Request $request, int $id, AuctionService $auctions)
    {
        $request->validate(
            ['bid_amount' => ['required', 'integer', 'min:1', 'max:999999999999999']],
            ['bid_amount.*' => 'Masukkan nominal penawaran dalam rupiah, tanpa titik atau koma.'],
        );

        try {
            $auctions->placeBid($id, Auth::user(), (int) $request->input('bid_amount'));
        } catch (AuctionRejected $e) {
            return back()->withErrors(['bid' => $e->getMessage()]);
        }

        return back()->with('success', 'Penawaranmu diterima.');
    }

    private function toInvoice(callable $pay, string $errorKey)
    {
        try {
            return Inertia::location($pay()->invoice_url);
        } catch (AuctionRejected $e) {
            return back()->withErrors([$errorKey => $e->getMessage()]);
        }
    }
}
