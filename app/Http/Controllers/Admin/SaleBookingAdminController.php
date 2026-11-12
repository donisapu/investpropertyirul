<?php

namespace App\Http\Controllers\Admin;

use App\Models\SaleBooking;
use App\Services\Sale\BookingRejected;
use App\Services\Sale\SaleBookingService;
use Illuminate\Http\Request;

/**
 * Admin Bookings (mockup admin-booking.html): booking fees per status, and the
 * actions that settle them — mark sold, cancel (refund / keep), refund a double payment.
 */
class SaleBookingAdminController extends AdminController
{
    protected string $viewPath = 'sale_bookings';

    /** Tab => statuses shown in it. */
    public const TABS = [
        'paid' => ['label' => 'Dibooking', 'statuses' => [SaleBooking::PAID]],
        'pending' => ['label' => 'Menunggu bayar', 'statuses' => [SaleBooking::PENDING]],
        'conflict' => ['label' => 'Perlu tindakan', 'statuses' => [SaleBooking::CONFLICT]],
        'completed' => ['label' => 'Terjual', 'statuses' => [SaleBooking::COMPLETED]],
        'closed' => ['label' => 'Kedaluwarsa / Batal', 'statuses' => [SaleBooking::EXPIRED, SaleBooking::CANCELLED]],
    ];

    public function index(Request $request)
    {
        $filters = $request->validate([
            'tab' => ['nullable', 'in:'.implode(',', array_keys(self::TABS))],
            'q' => ['nullable', 'string', 'max:100'],
            'id' => ['nullable', 'integer'],
        ]);
        $tab = $filters['tab'] ?? 'paid';

        $search = function ($query) use ($filters) {
            $q = trim($filters['q'] ?? '');
            if ($q === '') {
                return;
            }
            // '!' escapes: sqlite has no default LIKE escape and mysql eats backslashes.
            $like = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], mb_strtolower($q)).'%';
            $op = "like ? escape '!'";
            $query->where(fn ($w) => $w
                ->whereHas('user', fn ($u) => $u->whereRaw("lower(name) $op", [$like])->orWhereRaw("lower(email) $op", [$like]))
                ->orWhereHas('property', fn ($p) => $p->whereRaw("lower(property_name) $op", [$like]))
                ->orWhereHas('payment', fn ($p) => $p->whereRaw("lower(external_id) $op", [$like])));
        };

        $queue = SaleBooking::with(['user:id,name,email', 'property', 'payment'])
            ->whereIn('status', self::TABS[$tab]['statuses'])
            ->tap($search)
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        $counts = SaleBooking::selectRaw('status, count(*) as n')->groupBy('status')->pluck('n', 'status');
        $tabs = collect(self::TABS)->map(fn ($t) => $t + ['count' => collect($t['statuses'])->sum(fn ($s) => $counts[$s] ?? 0)]);

        $selected = isset($filters['id'])
            ? SaleBooking::with(['user', 'property', 'payment', 'consignment'])->find($filters['id'])
            : $queue->first()?->load('consignment');

        return $this->view('index', [
            'title' => 'Bookings',
            'tab' => $tab,
            'tabs' => $tabs,
            'queue' => $queue,
            'selected' => $selected,
            'filters' => $filters,
            'heldTotal' => (int) SaleBooking::where('status', SaleBooking::PAID)->sum('amount'),
        ]);
    }

    public function complete(Request $request, SaleBooking $booking, SaleBookingService $bookings)
    {
        return $this->act(fn () => $bookings->complete($booking, $request->user()), $booking, 'Booking ditandai terjual.');
    }

    public function cancel(Request $request, SaleBooking $booking, SaleBookingService $bookings)
    {
        $data = $request->validate([
            'fee_outcome' => ['required', 'in:'.SaleBooking::FEE_REFUNDED.','.SaleBooking::FEE_FORFEITED],
            'reason' => ['required', 'string', 'max:500'],
            'deactivate_listing' => ['nullable', 'boolean'],
        ], [
            'fee_outcome.required' => 'Pilih perlakuan booking fee.',
            'fee_outcome.in' => 'Pilih perlakuan booking fee.',
            'reason.required' => 'Alasan pembatalan wajib diisi.',
        ]);

        return $this->act(
            fn () => $bookings->cancel($booking, $data['fee_outcome'], $data['reason'], $request->user(), (bool) ($data['deactivate_listing'] ?? false)),
            $booking,
            $data['fee_outcome'] === SaleBooking::FEE_REFUNDED ? 'Booking dibatalkan, booking fee dikembalikan ke saldo pembeli.' : 'Booking dibatalkan, booking fee hangus.',
        );
    }

    public function refund(Request $request, SaleBooking $booking, SaleBookingService $bookings)
    {
        return $this->act(fn () => $bookings->refundConflict($booking, $request->user()), $booking, 'Pembayaran ganda dikembalikan ke saldo pembeli.');
    }

    private function act(callable $action, SaleBooking $booking, string $done)
    {
        try {
            $action();
        } catch (BookingRejected $e) {
            return back()->withErrors(['booking' => $e->getMessage()]);
        }

        return redirect()->route('admin.bookings.index', ['tab' => $this->tabOf($booking->fresh()->status), 'id' => $booking->id])
            ->with('success', $done);
    }

    private function tabOf(string $status): string
    {
        return collect(self::TABS)->search(fn ($t) => in_array($status, $t['statuses'], true)) ?: 'paid';
    }
}
