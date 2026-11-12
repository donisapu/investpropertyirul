<?php

namespace App\Services\Sale;

use App\Models\Payment;
use App\Models\PropertyConsignment;
use App\Models\SaleBooking;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\Wallet\WalletCredit;
use App\Services\XenditService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Booking fee for a property for sale (USE-CASES.md §B). One holding booking per
 * property: pending until its invoice expires, or paid until an admin completes
 * or cancels it.
 */
class SaleBookingService
{
    public function __construct(private XenditService $xendit)
    {
    }

    /**
     * Returns the Payment whose invoice_url the buyer pays. Booking again while the
     * same booking is still pending reuses its invoice (B5).
     */
    public function book(int $consignmentId, User $user): Payment
    {
        $payment = DB::transaction(function () use ($consignmentId, $user) {
            // The row lock makes two buyers of the same property take turns (B4).
            $listing = PropertyConsignment::with('property')->lockForUpdate()->findOrFail($consignmentId);

            if (! $listing->acceptsBooking()) {
                throw new BookingRejected('Properti ini tidak bisa dibooking online.');
            }

            $holding = $listing->bookings()->holding()->latest('id')->first();

            if ($holding) {
                if ($holding->user_id !== $user->id) {
                    throw new BookingRejected('Properti ini sedang dibooking pembeli lain.');
                }

                if ($holding->status === SaleBooking::PAID) {
                    throw new BookingRejected('Kamu sudah membooking properti ini.');
                }

                if ($holding->payment?->invoice_url) {
                    return $holding->payment;
                }

                // Another request (double click, second tab) is still creating its invoice.
                throw new BookingRejected('Tagihan pembayaran sedang dibuat. Muat ulang halaman sebentar lagi.');
            }

            $booking = SaleBooking::create([
                'property_consignment_id' => $listing->id,
                'property_id' => $listing->property_id,
                'user_id' => $user->id,
                'price' => $listing->property_value,
                'fee_percent' => $listing->booking_fee_percent,
                'amount' => $listing->bookingFee(),
                'status' => SaleBooking::PENDING,
                'expires_at' => now()->addSeconds(config('xendit.invoice_duration')),
            ]);

            return Payment::create([
                'user_id' => $user->id,
                'payable_type' => SaleBooking::class,
                'payable_id' => $booking->id,
                'amount' => $booking->amount,
                // Random tail: staging and production share one Xendit test account.
                'external_id' => sprintf('BK-%s-%05d-%s', now()->format('ym'), $booking->id, Str::lower(Str::random(4))),
                'status' => 'PENDING',
            ]);
        });

        if ($payment->invoice_url) {
            return $payment;
        }

        $booking = $payment->payable;

        try {
            $invoice = $this->xendit->createInvoice(
                $payment->external_id,
                (int) $payment->amount,
                $user->email,
                'Booking Fee - '.$booking->consignment->property->property_name,
            );
            $url = $invoice->getInvoiceUrl() ?: throw new \RuntimeException('Xendit returned no invoice URL');
        } catch (\Throwable $e) {
            // Free the property again, but keep both rows: after a timeout Xendit may still have
            // made the invoice, and a late PAID webhook must find its booking (markPaid takes expired).
            DB::transaction(function () use ($payment, $booking) {
                $payment->update(['status' => 'FAILED']);
                $this->markExpired($booking);
            });
            Log::error('Xendit booking invoice failed: '.$e->getMessage(), ['external_id' => $payment->external_id]);

            throw new BookingRejected('Gagal membuat tagihan pembayaran. Coba lagi beberapa saat lagi.');
        }

        $payment->update(['invoice_url' => $url]);

        return $payment;
    }

    /**
     * The booking fee arrived (webhook, inside its transaction). It only books the property
     * when nobody else holds it by now; otherwise it waits for an admin refund (B8).
     */
    public function markPaid(SaleBooking $booking): void
    {
        $listing = PropertyConsignment::lockForUpdate()->find($booking->property_consignment_id);
        $booking = SaleBooking::lockForUpdate()->find($booking->id);

        if (! in_array($booking->status, [SaleBooking::PENDING, SaleBooking::EXPIRED], true)) {
            return;
        }

        $someoneElseHolds = $listing->bookings()->holding()->whereKeyNot($booking->id)->exists();

        $booking->update([
            'status' => $someoneElseHolds || $listing->status !== 'active' ? SaleBooking::CONFLICT : SaleBooking::PAID,
            'paid_at' => now(),
        ]);

        if ($booking->status === SaleBooking::CONFLICT) {
            Log::warning('Booking fee paid for a property that is no longer free', ['sale_booking_id' => $booking->id]);
        }
    }

    public function markExpired(SaleBooking $booking): void
    {
        SaleBooking::whereKey($booking->id)->where('status', SaleBooking::PENDING)
            ->update(['status' => SaleBooking::EXPIRED, 'updated_at' => now()]);
    }

    /**
     * What the property page shows about booking, for this visitor (null = guest).
     *
     * @return array{state: string, fee_percent: ?float, fee_amount: int, terms: ?string, booking: ?array}
     */
    public function stateFor(PropertyConsignment $listing, ?User $user): array
    {
        $mine = $user ? $listing->bookings()->where('user_id', $user->id)->latest('id')->first() : null;
        $othersHold = $listing->bookings()->holding()->when($user, fn ($q) => $q->where('user_id', '!=', $user->id))->exists();

        $state = match (true) {
            $mine?->isHolding() => $mine->status === SaleBooking::PAID ? 'mine_paid' : 'mine_pending',
            $mine?->status === SaleBooking::CONFLICT => 'mine_conflict',
            $mine?->status === SaleBooking::COMPLETED => 'mine_completed',
            $othersHold => 'taken',
            $listing->status === 'sold' => 'sold',
            ! $listing->acceptsBooking() => 'unavailable',
            $mine && in_array($mine->status, [SaleBooking::PENDING, SaleBooking::EXPIRED], true) => 'mine_expired',
            $mine?->status === SaleBooking::CANCELLED => 'mine_cancelled',
            default => 'available',
        };

        return [
            'state' => $state,
            'fee_percent' => $listing->booking_fee_percent,
            'fee_amount' => $listing->bookingFee(),
            'terms' => $listing->booking_terms,
            'invoice_hours' => (int) round(config('xendit.invoice_duration') / 3600),
            // Who may press "Booking": only verified members (the route's role:user + verified).
            'viewer' => match (true) {
                $user === null => 'guest',
                ! $user->hasRole('user') => 'staff',
                ! $user->hasVerifiedEmail() => 'unverified',
                default => 'buyer',
            },
            'booking' => $mine && str_starts_with($state, 'mine_') ? [
                'code' => $mine->payment?->external_id,
                'amount' => (int) $mine->amount,
                'price' => (int) $mine->price,
                'invoice_url' => $state === 'mine_pending' ? $mine->payment?->invoice_url : null,
                'expires_at' => $mine->expires_at?->toIso8601String(),
                'paid_at' => $mine->paid_at?->toIso8601String(),
                'fee_outcome' => $mine->fee_outcome,
                'cancel_reason' => $mine->cancel_reason,
            ] : null,
        ];
    }

    /** The sale went through (outside the website): the property is sold (B12). */
    public function complete(SaleBooking $booking, User $admin): void
    {
        DB::transaction(function () use ($booking, $admin) {
            $booking = $this->lockIn($booking, [SaleBooking::PAID], 'Hanya booking yang sudah dibayar yang bisa ditandai terjual.');

            $booking->update(['status' => SaleBooking::COMPLETED, 'completed_at' => now(), 'resolved_by' => $admin->id]);
            $booking->consignment()->update(['status' => 'sold']);
        });
    }

    /**
     * Cancel a paid booking: the fee goes back to the buyer's Wallet or is kept, per the
     * booking terms (B10, B11). The property is free again unless the owner withdrew it.
     */
    public function cancel(SaleBooking $booking, string $feeOutcome, string $reason, User $admin, bool $deactivateListing = false): void
    {
        DB::transaction(function () use ($booking, $feeOutcome, $reason, $admin, $deactivateListing) {
            $booking = $this->lockIn($booking, [SaleBooking::PAID], 'Hanya booking yang sudah dibayar yang bisa dibatalkan.');

            $this->close($booking, $feeOutcome, $reason, $admin);

            if ($deactivateListing) {
                $booking->consignment()->update(['status' => 'inactive']);
            }
        });
    }

    /** A double payment (B8): the whole fee goes back to the late buyer's Wallet. */
    public function refundConflict(SaleBooking $booking, User $admin): void
    {
        DB::transaction(function () use ($booking, $admin) {
            $booking = $this->lockIn($booking, [SaleBooking::CONFLICT], 'Booking ini bukan pembayaran ganda.');

            $this->close($booking, SaleBooking::FEE_REFUNDED, 'Properti sudah dibooking pembeli lain saat pembayaranmu masuk.', $admin);
        });
    }

    /** Pending bookings whose invoice ran out without a webhook (B6). Returns how many. */
    public function expireOverdue(): int
    {
        return SaleBooking::where('status', SaleBooking::PENDING)->where('expires_at', '<=', now())
            ->update(['status' => SaleBooking::EXPIRED, 'updated_at' => now()]);
    }

    private function close(SaleBooking $booking, string $feeOutcome, string $reason, User $admin): void
    {
        $booking->update([
            'status' => SaleBooking::CANCELLED,
            'cancelled_at' => now(),
            'fee_outcome' => $feeOutcome,
            'cancel_reason' => $reason,
            'resolved_by' => $admin->id,
        ]);

        if ($feeOutcome === SaleBooking::FEE_REFUNDED) {
            app(WalletCredit::class)->credit($booking->user_id, (int) $booking->amount, WalletTransaction::TYPE_BOOKING_REFUND, $booking);
        }
    }

    /** @param  list<string>  $statuses */
    private function lockIn(SaleBooking $booking, array $statuses, string $message): SaleBooking
    {
        $booking = SaleBooking::lockForUpdate()->findOrFail($booking->id);

        if (! in_array($booking->status, $statuses, true)) {
            throw new BookingRejected($message);
        }

        return $booking;
    }
}
