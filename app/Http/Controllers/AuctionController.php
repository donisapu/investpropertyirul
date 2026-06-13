<?php

namespace App\Http\Controllers;

use App\Models\PropertyAuction;
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
            ->where('status', '!=', 'finished')
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

    public function show($id)
    {
        $auction = PropertyAuction::with(['property', 'property.images', 'property.documents', 'bids.user'])
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
            'settings' => $settings
        ]);
    }

    public function placeBid(Request $request, $id)
    {
        if (!Auth::check()) {
            return redirect()->back()->withErrors(['bid' => 'Anda harus login terlebih dahulu untuk melakukan bid.']);
        }

        $auction = PropertyAuction::findOrFail($id);
        $user = Auth::user();

        $today = now()->format('Y-m-d');
        if ($auction->status !== 'active' || $today < $auction->date_start || $today > $auction->date_finish) {
            return redirect()->back()->withErrors(['bid' => 'Lelang ini sedang tidak aktif atau sudah ditutup.']);
        }

        $highestBid = $auction->bids()->max('bid_amount');
        $currentBid = $highestBid ?? $auction->open_bid;

        $minRequired = $highestBid ? $currentBid + $auction->bid_increment : $auction->open_bid;

        $request->validate([
            'bid_amount' => [
                'required',
                'numeric',
                'min:' . $minRequired
            ]
        ], [
            'bid_amount.min' => 'Penawaran Anda harus minimal sebesar Rp ' . number_format($minRequired, 0, ',', '.'),
        ]);

        $auction->bids()->create([
            'user_id' => $user->id,
            'bid_amount' => $request->bid_amount
        ]);

        return redirect()->back()->with('success', 'Penawaran Anda berhasil ditempatkan!');
    }
}
