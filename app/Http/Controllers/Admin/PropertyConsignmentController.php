<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyConsignment;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use App\Models\SaleBooking;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PropertyConsignmentController extends AdminController
{
    protected string $viewPath = 'property_consignment';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyConsignment::with('property')->select('id', 'property_id', 'listing_type', 'status');

        return $this->dataTable($query, 'pages.property_consignment.action');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->view('index', [
            'title' => 'Consignment Property',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Consignment Property',
            'action' => route('admin.consignment-properties.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validateBooking($request);

        DB::transaction(function () use ($request) {
            $consignment = PropertyConsignment::create($request->only([
                'property_id',
                'property_value',
                'ownership',
                'listing_type',
                'lease_term',
                'status',
                'market_value',
                'booking_fee_percent',
                'booking_terms',
            ]));
        });

        return redirect()->route('admin.consignment-properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyConsignment::with('property')->where('id', $id)->first();

        return $this->view('show', [
            'title' => 'consignment Property',
            'data' => $data,
            'img' => PropertyImage::where('property_id', $data->property_id)->get(),
            'doc' => PropertyDocument::where('property_id', $data->property_id)->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return $this->view('form', [
            'title' => 'Edit consignment Property',
            'data' => PropertyConsignment::with('property')->find($id),
            'action' => route('admin.consignment-properties.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $this->validateBooking($request);

        DB::transaction(function () use ($request, $id) {
            $property = PropertyConsignment::lockForUpdate()->findOrFail($id);

            // A booking fixes its amount when made, but the page must keep showing what the
            // buyer agreed to: house, price, % and status stay put until the booking is settled
            // (USE-CASES B2).
            $changed = (int) $request->input('property_id') !== (int) $property->property_id
                || $request->input('status') !== $property->status
                || (float) $request->input('property_value') !== (float) $property->property_value
                || (float) $request->input('booking_fee_percent') !== (float) $property->booking_fee_percent;

            if ($changed && $property->bookings()->holding()->exists()) {
                throw ValidationException::withMessages([
                    'booking_fee_percent' => 'Properti ini sedang dibooking: properti, status, harga dan booking fee tidak bisa diubah sampai booking selesai atau dibatalkan.',
                ]);
            }

            // Sold through a booking: reopening it would let a second buyer pay a fee.
            if ($request->input('status') !== 'sold' && $property->bookings()->where('status', SaleBooking::COMPLETED)->exists()) {
                throw ValidationException::withMessages([
                    'status' => 'Properti ini sudah terjual lewat booking, statusnya tetap Sold.',
                ]);
            }

            $property->update($request->only([
                'property_id',
                'property_value',
                'ownership',
                'listing_type',
                'lease_term',
                'status',
                'market_value',
                'booking_fee_percent',
                'booking_terms',
            ]));
        });

        return redirect()->route('admin.consignment-properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = DB::transaction(function () use ($id) {
            $property = PropertyConsignment::lockForUpdate()->findOrFail($id);

            // Bookings carry money history (and an expired one can still be paid late):
            // such a listing can only be set inactive (USE-CASES B14).
            if ($property->bookings()->exists()) {
                return false;
            }

            return $property->delete();
        });

        if (! $deleted) {
            return back()->withErrors(['booking' => 'Listing ini punya booking, jadi tidak bisa dihapus. Ubah statusnya ke Inactive.']);
        }

        return redirect()->route('admin.consignment-properties');
    }

    private function validateBooking(Request $request): void
    {
        $request->validate([
            'booking_fee_percent' => ['nullable', 'numeric', 'gt:0', 'max:100'],
            'booking_terms' => ['nullable', 'string', 'max:2000'],
        ], [
            'booking_fee_percent.*' => 'Booking fee diisi persen lebih dari 0 dan paling besar 100, atau dikosongkan untuk mematikan booking online.',
        ]);
    }
}
