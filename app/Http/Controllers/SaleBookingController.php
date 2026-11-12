<?php

namespace App\Http\Controllers;

use App\Services\Sale\BookingRejected;
use App\Services\Sale\SaleBookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleBookingController extends Controller
{
    public function store(Request $request, int $id, SaleBookingService $bookings)
    {
        try {
            $payment = $bookings->book($id, $request->user());
        } catch (BookingRejected $e) {
            return back()->withErrors(['booking' => $e->getMessage()]);
        }

        return Inertia::location($payment->invoice_url);
    }
}
