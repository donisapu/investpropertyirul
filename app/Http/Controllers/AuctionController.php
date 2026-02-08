<?php

namespace App\Http\Controllers;

use App\Models\PropertyAuction;
use Illuminate\Http\Request;
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

        return Inertia::render('Auctions/Index', [
            'auctions' => $auctions
        ]);
    }

    public function show($id)
    {
        $auction = PropertyAuction::with(['property', 'property.images', 'property.documents'])
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

        return Inertia::render('Auctions/Show', [
            'auction' => $auction
        ]);
    }
}
