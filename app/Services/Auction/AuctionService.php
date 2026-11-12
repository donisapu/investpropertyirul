<?php

namespace App\Services\Auction;

use App\Models\AuctionBid;
use App\Models\AuctionDeposit;
use App\Models\AuctionSettlement;
use App\Models\Payment;
use App\Models\PropertyAuction;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\Wallet\WalletCredit;
use App\Services\XenditService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Lelang & Cessie (USE-CASES.md §C): deposit → bids → closing → the winner's settlement.
 * Every step locks the auction row first, so bids, closing and webhooks take turns.
 */
class AuctionService
{
    public function __construct(private XenditService $xendit, private WalletCredit $wallet)
    {
    }

    /**
     * Returns the Payment whose invoice_url the participant pays. Paying again while the
     * deposit is still pending reuses its invoice (C5).
     */
    public function payDeposit(int $auctionId, User $user): Payment
    {
        $payment = DB::transaction(function () use ($auctionId, $user) {
            $auction = PropertyAuction::with('property')->lockForUpdate()->findOrFail($auctionId);

            if (! $auction->acceptsDeposits()) {
                throw new AuctionRejected('Deposit untuk lelang ini sedang tidak dibuka.');
            }

            if ($auction->deposits()->where('user_id', $user->id)->where('status', AuctionDeposit::PAID)->exists()) {
                throw new AuctionRejected('Deposit kamu untuk lelang ini sudah diterima.');
            }

            $mine = $auction->deposits()->where('user_id', $user->id)->latest('id')->first();

            if ($mine?->isOpen()) {
                return $mine->payment?->invoice_url
                    ? $mine->payment
                    : throw new AuctionRejected('Tagihan deposit sedang dibuat. Muat ulang halaman sebentar lagi.');
            }

            $deposit = $auction->deposits()->create([
                'property_id' => $auction->property_id,
                'user_id' => $user->id,
                'percent' => $auction->deposit_percent,
                'amount' => $auction->depositAmount(),
                'status' => AuctionDeposit::PENDING,
                'expires_at' => now()->addSeconds(config('xendit.invoice_duration')),
            ]);

            return $this->newPayment($deposit, $user, 'DP');
        });

        return $this->withInvoice($payment, $user, 'Deposit '.$this->label($payment->payable->auction), function () use ($payment) {
            $payment->payable->update(['status' => AuctionDeposit::EXPIRED]);
        });
    }

    /**
     * A deposit arrived (webhook, inside its transaction). Paid after the auction ended, or a
     * second deposit for the same person: straight back to the Wallet (C7).
     */
    public function markDepositPaid(AuctionDeposit $deposit): void
    {
        $auction = PropertyAuction::lockForUpdate()->find($deposit->property_auction_id);
        $deposit = AuctionDeposit::lockForUpdate()->find($deposit->id);

        if (! in_array($deposit->status, [AuctionDeposit::PENDING, AuctionDeposit::EXPIRED], true)) {
            return;
        }

        $deposit->update(['status' => AuctionDeposit::PAID, 'paid_at' => now()]);

        $alreadyIn = $auction->deposits()->where('user_id', $deposit->user_id)
            ->where('status', AuctionDeposit::PAID)->whereKeyNot($deposit->id)->exists();

        if ($alreadyIn || ! in_array($auction->status, ['upcoming', 'active', 'suspended'], true)) {
            $this->refund($deposit);
        }
    }

    public function markDepositExpired(AuctionDeposit $deposit): void
    {
        AuctionDeposit::whereKey($deposit->id)->where('status', AuctionDeposit::PENDING)
            ->update(['status' => AuctionDeposit::EXPIRED, 'updated_at' => now()]);
    }

    /** C8, C9: a bid from a participant with a paid deposit, above the top bid by the increment. */
    public function placeBid(int $auctionId, User $user, int $amount): AuctionBid
    {
        return DB::transaction(function () use ($auctionId, $user, $amount) {
            $auction = PropertyAuction::lockForUpdate()->findOrFail($auctionId);

            if (! $auction->isOpenForBids()) {
                throw new AuctionRejected('Lelang ini sedang tidak menerima penawaran.');
            }

            if (! $auction->deposits()->where('user_id', $user->id)->where('status', AuctionDeposit::PAID)->exists()) {
                throw new AuctionRejected('Bayar deposit dulu untuk ikut menawar.');
            }

            $top = $auction->topBid();

            if ($top?->user_id === $user->id) {
                throw new AuctionRejected('Kamu masih penawar tertinggi.');
            }

            $increment = (int) $auction->bid_increment;
            $minimum = $this->minimumBid($auction, $top);

            if ($amount < $minimum) {
                throw new AuctionRejected($top && $amount === (int) $top->bid_amount
                    ? 'Sudah ada penawaran dengan nominal yang sama. Penawaran minimal sekarang '.$this->rupiah($minimum).'.'
                    : 'Penawaran minimal '.$this->rupiah($minimum).'.');
            }

            if ($increment > 0 && ($amount - (int) $auction->open_bid) % $increment !== 0) {
                throw new AuctionRejected('Penawaran harus naik dengan kelipatan '.$this->rupiah($increment).' dari nilai limit.');
            }

            $bid = $auction->bids()->create(['user_id' => $user->id, 'bid_amount' => $amount]);

            // Anti-sniping (C13): a late bid gives the others time to answer.
            $extendTo = now()->addMinutes(PropertyAuction::SNIPING_MINUTES);
            if ($auction->anti_sniping && $auction->date_finish->lt($extendTo)) {
                $auction->update(['date_finish' => $extendTo]);
            }

            return $bid;
        });
    }

    /**
     * The scheduler's minute: open, close, default, expire. Returns what it did.
     *
     * @return array{opened: int, closed: int, defaulted: int, expired: int}
     */
    public function tick(): array
    {
        $opened = PropertyAuction::where('status', 'upcoming')->where('date_start', '<=', now())
            ->update(['status' => 'active', 'updated_at' => now()]);

        $closed = 0;
        foreach (PropertyAuction::where('status', 'active')->where('date_finish', '<=', now())->pluck('id') as $id) {
            $closed += (int) $this->close($id);
        }

        $defaulted = 0;
        foreach (AuctionSettlement::where('status', AuctionSettlement::PENDING)->where('due_at', '<=', now())->pluck('property_auction_id') as $id) {
            $defaulted += (int) $this->declareDefault($id);
        }

        $expired = AuctionDeposit::where('status', AuctionDeposit::PENDING)->where('expires_at', '<=', now())
            ->update(['status' => AuctionDeposit::EXPIRED, 'updated_at' => now()]);

        return compact('opened', 'closed', 'defaulted', 'expired');
    }

    /**
     * C14, C15: the top bid wins and owes the rest within payment_days; every other deposit
     * goes back to the Wallet. No bid: no winner, all deposits back.
     */
    public function close(int $auctionId): bool
    {
        return DB::transaction(function () use ($auctionId) {
            $auction = PropertyAuction::lockForUpdate()->find($auctionId);

            if ($auction?->status !== 'active' || $auction->date_finish->isFuture()) {
                return false;
            }

            $top = $auction->topBid();
            $winnerDeposit = $top ? $auction->deposits()->where('user_id', $top->user_id)->where('status', AuctionDeposit::PAID)->first() : null;

            foreach ($auction->deposits()->where('status', AuctionDeposit::PAID)->lockForUpdate()->get() as $deposit) {
                if ($deposit->id !== $winnerDeposit?->id) {
                    $this->refund($deposit);
                }
            }

            if (! $top) {
                $auction->update(['status' => 'no_winner', 'closed_at' => now()]);

                return true;
            }

            $price = (int) $top->bid_amount;
            $depositAmount = (int) ($winnerDeposit?->amount ?? 0);

            $auction->settlement()->create([
                'property_id' => $auction->property_id,
                'user_id' => $top->user_id,
                'auction_deposit_id' => $winnerDeposit?->id,
                'price' => $price,
                'deposit_amount' => $depositAmount,
                'amount' => $price - $depositAmount,
                'status' => AuctionSettlement::PENDING,
                'due_at' => now()->addDays($auction->payment_days ?: 7),
            ]);
            $auction->update(['status' => 'awaiting_payment', 'winner_bid_id' => $top->id, 'closed_at' => now()]);

            return true;
        });
    }

    /** C18: the winner did not pay in time; the deposit is forfeited (🟡 assumption). */
    public function declareDefault(int $auctionId): bool
    {
        return DB::transaction(function () use ($auctionId) {
            $auction = PropertyAuction::lockForUpdate()->find($auctionId);
            $settlement = $auction?->settlement()->lockForUpdate()->first();

            if ($auction?->status !== 'awaiting_payment' || $settlement?->status !== AuctionSettlement::PENDING || $settlement->due_at->isFuture()) {
                return false;
            }

            $settlement->update(['status' => AuctionSettlement::DEFAULTED]);
            $settlement->deposit?->update(['status' => AuctionDeposit::FORFEITED, 'resolved_at' => now()]);
            $auction->update(['status' => 'defaulted']);

            return true;
        });
    }

    /** The winner pays the rest through Xendit (C16). Reuses an unpaid invoice. */
    public function paySettlement(int $auctionId, User $user): Payment
    {
        $payment = DB::transaction(function () use ($auctionId, $user) {
            $auction = PropertyAuction::with('property')->lockForUpdate()->findOrFail($auctionId);
            $settlement = $auction->settlement;

            if ($auction->status !== 'awaiting_payment' || $settlement?->user_id !== $user->id || $settlement->status !== AuctionSettlement::PENDING) {
                throw new AuctionRejected('Tidak ada pelunasan yang bisa dibayar untuk lelang ini.');
            }

            $open = $settlement->payment;
            if ($open?->status === 'PENDING') {
                return $open->invoice_url
                    ? $open
                    : throw new AuctionRejected('Tagihan pelunasan sedang dibuat. Muat ulang halaman sebentar lagi.');
            }

            return $this->newPayment($settlement, $user, 'PL');
        });

        return $this->withInvoice($payment, $user, 'Pelunasan '.$this->label($payment->payable->auction));
    }

    /**
     * The settlement arrived (webhook). Money that can no longer settle anything (after a
     * default, or a second invoice paid) goes back to the Wallet.
     */
    public function markSettlementPaid(AuctionSettlement $settlement, Payment $payment): void
    {
        $auction = PropertyAuction::lockForUpdate()->find($settlement->property_auction_id);
        $settlement = AuctionSettlement::lockForUpdate()->find($settlement->id);

        if ($settlement->status === AuctionSettlement::PENDING && $auction->status === 'awaiting_payment') {
            $this->complete($auction, $settlement);

            return;
        }

        Log::warning('Auction settlement paid when nothing was owed; refunded to the Wallet', ['auction_settlement_id' => $settlement->id, 'payment_id' => $payment->id]);
        $this->wallet->credit($settlement->user_id, (int) $payment->amount, WalletTransaction::TYPE_PAYMENT_REFUND, $payment);
    }

    /** C17: paid by bank transfer outside Xendit; an admin records it. */
    public function markSettlementPaidManually(PropertyAuction $auction, User $admin, string $note): void
    {
        DB::transaction(function () use ($auction, $admin, $note) {
            $auction = PropertyAuction::lockForUpdate()->find($auction->id);
            $settlement = $auction->settlement()->lockForUpdate()->first();

            if ($auction->status !== 'awaiting_payment' || $settlement?->status !== AuctionSettlement::PENDING) {
                throw new AuctionRejected('Lelang ini tidak sedang menunggu pelunasan.');
            }

            $settlement->update(['paid_manually_by' => $admin->id, 'manual_note' => $note]);
            $this->complete($auction, $settlement);
        });
    }

    public function extendDue(PropertyAuction $auction, int $days): void
    {
        DB::transaction(function () use ($auction, $days) {
            $auction = PropertyAuction::lockForUpdate()->find($auction->id);
            $settlement = $auction->settlement()->lockForUpdate()->first();

            if ($auction->status !== 'awaiting_payment' || $settlement?->status !== AuctionSettlement::PENDING) {
                throw new AuctionRejected('Lelang ini tidak sedang menunggu pelunasan.');
            }

            $settlement->update(['due_at' => $settlement->due_at->copy()->addDays($days)]);
        });
    }

    /** C19: every bid is void and every paid deposit goes back to the Wallet. */
    public function cancel(PropertyAuction $auction, string $reason): void
    {
        DB::transaction(function () use ($auction, $reason) {
            $auction = PropertyAuction::lockForUpdate()->find($auction->id);

            if (! in_array($auction->status, PropertyAuction::EDITABLE_STATUSES, true)) {
                throw new AuctionRejected('Lelang yang sudah ditutup tidak bisa dibatalkan.');
            }

            foreach ($auction->deposits()->where('status', AuctionDeposit::PAID)->lockForUpdate()->get() as $deposit) {
                $this->refund($deposit);
            }
            $auction->deposits()->where('status', AuctionDeposit::PENDING)->update(['status' => AuctionDeposit::EXPIRED]);
            $auction->update(['status' => 'cancelled', 'cancelled_at' => now(), 'cancel_reason' => $reason]);
        });
    }

    /**
     * What the auction page shows this visitor (null = guest).
     *
     * @return array<string, mixed>
     */
    public function stateFor(PropertyAuction $auction, ?User $user): array
    {
        // Queried, not loaded onto $auction: the page also serializes $auction (C22 anonymity).
        $bids = $auction->bids()->get();
        $top = $this->topOf($bids);
        $settlement = $auction->settlement()->first();
        $mine = $user ? $auction->deposits()->with('payment')->where('user_id', $user->id)->latest('id')->get() : collect();
        $deposit = $mine->first();
        // The deposit that counts: held, then applied/forfeited, then refunded, else the latest attempt.
        // (A late duplicate is refunded while the first one stays held.)
        $shown = $mine->firstWhere('status', AuctionDeposit::PAID)
            ?? $mine->first(fn ($d) => in_array($d->status, [AuctionDeposit::APPLIED, AuctionDeposit::FORFEITED], true))
            ?? $mine->first(fn ($d) => $d->paid_at !== null)
            ?? $deposit;
        $won = $user && $settlement?->user_id === $user->id;

        $state = match (true) {
            $auction->status === 'cancelled' => 'cancelled',
            $auction->status === 'suspended' => 'suspended',
            $auction->status === 'draft' => 'draft',
            $won && $settlement->status === AuctionSettlement::PAID => 'paid',
            $won && $settlement->status === AuctionSettlement::DEFAULTED => 'default',
            $won => 'won',
            in_array($auction->status, PropertyAuction::ENDED_STATUSES, true) => $shown?->paid_at ? 'lost' : 'finished',
            $shown?->status === AuctionDeposit::PAID => $auction->isOpenForBids() ? 'bidding' : 'ready',
            (bool) $deposit?->isOpen() => 'deposit_pending',
            $auction->acceptsDeposits() => 'deposit',
            default => 'deposit_closed',
        };

        return [
            'state' => $state,
            'status' => $auction->status,
            'viewer' => match (true) {
                $user === null => 'guest',
                ! $user->hasRole('user') => 'staff',
                ! $user->hasVerifiedEmail() => 'unverified',
                default => 'buyer',
            },
            'opens_at' => $auction->date_start?->toIso8601String(),
            'closes_at' => $auction->date_finish?->toIso8601String(),
            'deposit_deadline' => $auction->date_finish ? $auction->depositDeadline()->toIso8601String() : null,
            'deposit_percent' => $auction->deposit_percent,
            'deposit_amount' => $auction->depositAmount(),
            'terms' => $auction->terms,
            'invoice_hours' => (int) round(config('xendit.invoice_duration') / 3600),
            'open_bid' => (int) $auction->open_bid,
            'bid_increment' => (int) $auction->bid_increment,
            'top_bid' => $top ? (int) $top->bid_amount : null,
            'top_is_mine' => $user && $top?->user_id === $user->id,
            'minimum_bid' => $this->minimumBid($auction, $top),
            'participants' => $auction->deposits()->whereNotNull('paid_at')->distinct()->count('user_id'),
            'cancel_reason' => $auction->status === 'cancelled' ? $auction->cancel_reason : null,
            'my_last_bid' => $user ? ((int) $bids->where('user_id', $user->id)->max('bid_amount') ?: null) : null,
            'deposit' => $shown ? [
                'status' => $shown->status,
                'amount' => (int) $shown->amount,
                'invoice_url' => $state === 'deposit_pending' ? $deposit->payment?->invoice_url : null,
                'expires_at' => $shown->expires_at?->toIso8601String(),
                'paid_at' => $shown->paid_at?->toIso8601String(),
            ] : null,
            'settlement' => $won ? [
                'price' => (int) $settlement->price,
                'deposit_amount' => (int) $settlement->deposit_amount,
                'amount' => (int) $settlement->amount,
                'due_at' => $settlement->due_at->toIso8601String(),
                'paid_at' => $settlement->paid_at?->toIso8601String(),
                'status' => $settlement->status,
            ] : null,
            'bids' => $this->publicBids($bids, $top, $user),
        ];
    }

    /**
     * My Bids: every auction the member joined (a deposit paid or still pending, or a bid),
     * newest first, each with its page state. An ended auction whose deposit was never paid
     * ("finished") was not joined and is left out.
     *
     * @return list<array<string, mixed>>
     */
    public function participationsOf(User $user): array
    {
        $ids = AuctionDeposit::where('user_id', $user->id)
            ->where(fn ($q) => $q->where('status', AuctionDeposit::PENDING)->orWhereNotNull('paid_at'))
            ->pluck('property_auction_id')
            ->merge(AuctionBid::where('user_id', $user->id)->pluck('property_auction_id'))
            ->unique();

        return PropertyAuction::with(['property.images'])->whereIn('id', $ids)
            ->orderByDesc('date_finish')->get()
            ->map(function (PropertyAuction $auction) use ($user) {
                $state = $this->stateFor($auction, $user);
                unset($state['bids'], $state['terms']);
                $image = $auction->property?->images->first()?->image_url;

                return $state + [
                    'id' => $auction->id,
                    'type_label' => $auction->type_label,
                    'name' => $auction->property?->property_name,
                    'location' => $auction->property?->property_location,
                    'image' => $image ? Storage::url($image) : null,
                ];
            })
            ->reject(fn (array $item) => $item['state'] === 'finished')
            ->values()->all();
    }

    /**
     * Deposits held in auctions still running (Wallet "Deposit tertahan", D3). A winner's
     * deposit after closing is no longer "held": it goes to the price or is forfeited.
     */
    public function heldDepositsOf(User $user): array
    {
        $held = AuctionDeposit::where('user_id', $user->id)->where('status', AuctionDeposit::PAID)
            ->whereHas('auction', fn ($q) => $q->whereNotIn('status', PropertyAuction::ENDED_STATUSES));

        return ['amount' => (int) (clone $held)->sum('amount'), 'auctions' => (clone $held)->distinct()->count('property_auction_id')];
    }

    /** C22: names are hidden ("Peserta #n", numbered by first bid); the visitor sees "Kamu". */
    private function publicBids(Collection $bids, ?AuctionBid $top, ?User $user): array
    {
        $numbers = $bids->sortBy('id')->pluck('user_id')->unique()->values()->flip();

        return $bids->sort(fn ($a, $b) => [(int) $b->bid_amount, $a->id] <=> [(int) $a->bid_amount, $b->id])->values()->map(fn ($b) => [
            'id' => $b->id,
            'who' => $user && $b->user_id === $user->id ? 'Kamu' : 'Peserta #'.($numbers[$b->user_id] + 1),
            'mine' => $user && $b->user_id === $user->id,
            'amount' => (int) $b->bid_amount,
            'at' => $b->created_at?->toIso8601String(),
            'top' => $b->id === $top?->id,
        ])->all();
    }

    /** Highest bid first; the earlier of two equal bids wins (same order as PropertyAuction::topBid). */
    private function topOf(Collection $bids): ?AuctionBid
    {
        return $bids->sort(fn ($a, $b) => [(int) $b->bid_amount, $a->id] <=> [(int) $a->bid_amount, $b->id])->first();
    }

    private function minimumBid(PropertyAuction $auction, ?AuctionBid $top): int
    {
        return $top ? (int) $top->bid_amount + (int) $auction->bid_increment : (int) $auction->open_bid;
    }

    private function complete(PropertyAuction $auction, AuctionSettlement $settlement): void
    {
        $settlement->update(['status' => AuctionSettlement::PAID, 'paid_at' => now()]);
        $settlement->deposit?->update(['status' => AuctionDeposit::APPLIED, 'resolved_at' => now()]);
        $auction->update(['status' => 'completed']);
    }

    private function refund(AuctionDeposit $deposit): void
    {
        $deposit->update(['status' => AuctionDeposit::REFUNDED, 'resolved_at' => now()]);
        $this->wallet->credit($deposit->user_id, (int) $deposit->amount, WalletTransaction::TYPE_DEPOSIT_REFUND, $deposit);
    }

    private function newPayment(AuctionDeposit|AuctionSettlement $payable, User $user, string $prefix): Payment
    {
        return Payment::create([
            'user_id' => $user->id,
            'payable_type' => $payable::class,
            'payable_id' => $payable->id,
            'amount' => $payable->amount,
            // Random tail: staging and production share one Xendit test account.
            'external_id' => sprintf('%s-%s-%05d-%s', $prefix, now()->format('ym'), $payable->id, Str::lower(Str::random(4))),
            'status' => 'PENDING',
        ]);
    }

    /**
     * Ask Xendit for the invoice. On failure both rows stay (Xendit may still have made the
     * invoice before a timeout, and a late PAID webhook must find them), marked FAILED.
     */
    private function withInvoice(Payment $payment, User $user, string $description, ?callable $onFailure = null): Payment
    {
        if ($payment->invoice_url) {
            return $payment;
        }

        try {
            $invoice = $this->xendit->createInvoice($payment->external_id, (int) $payment->amount, $user->email, $description);
            $url = $invoice->getInvoiceUrl() ?: throw new \RuntimeException('Xendit returned no invoice URL');
        } catch (\Throwable $e) {
            DB::transaction(function () use ($payment, $onFailure) {
                $payment->update(['status' => 'FAILED']);
                $onFailure && $onFailure();
            });
            Log::error('Xendit auction invoice failed: '.$e->getMessage(), ['external_id' => $payment->external_id]);

            throw new AuctionRejected('Gagal membuat tagihan pembayaran. Coba lagi beberapa saat lagi.');
        }

        $payment->update(['invoice_url' => $url]);

        return $payment;
    }

    private function label(PropertyAuction $auction): string
    {
        return $auction->type_label.' - '.$auction->property?->property_name;
    }

    private function rupiah(int $amount): string
    {
        return 'Rp '.number_format($amount, 0, ',', '.');
    }
}
