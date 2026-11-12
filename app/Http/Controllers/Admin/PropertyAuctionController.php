<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyAuction;
use App\Traits\AdminDataTable;
use App\Services\Auction\AuctionRejected;
use App\Services\Auction\AuctionService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PropertyAuctionController extends AdminController
{
    protected string $viewPath = 'property_auction';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyAuction::with('property')->select('id', 'property_id', 'open_bid', 'date_start', 'type', 'date_finish', 'status');

        return $this->dataTable($query, 'pages.property_auction.action');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->view('index', [
            'title' => 'Auction Property',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Auction Property',
            'action' => route('admin.auction-properties.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $this->validated($request);

        PropertyAuction::create($data);

        return redirect()->route('admin.auction-properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyAuction::with(['property', 'settlement.payment', 'settlement.user', 'settlement.paidManuallyBy', 'deposits.user', 'deposits.payment'])->findOrFail($id);

        $bids = \App\Models\AuctionBid::with('user')
            ->where('property_auction_id', $id)
            ->orderBy('bid_amount', 'desc')
            ->orderBy('id')
            ->get();

        return $this->view('show', [
            'title' => 'Auction Property Detail',
            'data' => $data,
            'bids' => $bids,
            'deposits' => $data->deposits->sortByDesc('id')->values(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return $this->view('form', [
            'title' => 'Edit Auction Property',
            'data' => PropertyAuction::with('property')->find($id),
            'action' => route('admin.auction-properties.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($data, $id) {
            $auction = PropertyAuction::lockForUpdate()->findOrFail($id);
            $this->guardChanges($auction, $data);
            $auction->update($data);
        });

        return redirect()->route('admin.auction-properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = DB::transaction(function () use ($id) {
            $auction = PropertyAuction::lockForUpdate()->findOrFail($id);

            // Deposits carry money history: such an auction can only be cancelled (C21).
            return $auction->deposits()->exists() ? false : $auction->delete();
        });

        if (! $deleted) {
            return back()->withErrors(['auction' => 'Lelang ini punya deposit peserta, jadi tidak bisa dihapus. Batalkan lelangnya dari halaman detail.']);
        }

        return redirect()->route('admin.auction-properties');
    }

    public function getBids($id)
    {
        $bids = \App\Models\AuctionBid::with('user')
            ->where('property_auction_id', $id)
            ->orderBy('bid_amount', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $bids,
        ]);
    }

    public function cancel(Request $request, PropertyAuction $auction, AuctionService $auctions)
    {
        $data = $request->validate(['reason' => ['required', 'string', 'max:500']], ['reason.required' => 'Tulis alasan pembatalan (tampil ke peserta).']);

        return $this->act(fn () => $auctions->cancel($auction, $data['reason']), $auction, 'Lelang dibatalkan. Semua deposit dikembalikan ke saldo peserta.');
    }

    public function markPaid(Request $request, PropertyAuction $auction, AuctionService $auctions)
    {
        $data = $request->validate(['note' => ['required', 'string', 'max:500']], ['note.required' => 'Tulis bukti pelunasan (mis. bank, tanggal, nomor referensi transfer).']);

        return $this->act(fn () => $auctions->markSettlementPaidManually($auction, $request->user(), $data['note']), $auction, 'Pelunasan dicatat. Lelang selesai.');
    }

    public function extendDue(Request $request, PropertyAuction $auction, AuctionService $auctions)
    {
        $data = $request->validate(['days' => ['required', 'integer', 'min:1', 'max:30']]);

        return $this->act(fn () => $auctions->extendDue($auction, (int) $data['days']), $auction, 'Batas pelunasan diperpanjang '.$data['days'].' hari.');
    }

    private function act(callable $action, PropertyAuction $auction, string $success)
    {
        try {
            $action();
        } catch (AuctionRejected $e) {
            return back()->withErrors(['auction' => $e->getMessage()]);
        }

        return redirect()->route('admin.auction-properties.show', $auction->id)->with('success', $success);
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'type' => ['required', Rule::in(array_keys(PropertyAuction::TYPES))],
            'status' => ['required', Rule::in(PropertyAuction::EDITABLE_STATUSES)],
            'open_bid' => ['required', 'numeric', 'min:1'],
            'bid_increment' => ['required', 'numeric', 'gt:0'],
            'market_value' => ['required', 'numeric', 'min:0'],
            // Below 100: the winner must still owe something to settle (a 0 invoice fails at Xendit).
            'deposit_percent' => ['required', 'numeric', 'min:'.PropertyAuction::MIN_DEPOSIT_PERCENT, 'max:99'],
            'payment_days' => ['required', 'integer', 'min:1', 'max:60'],
            'date_start' => ['required', 'date'],
            'date_finish' => ['required', 'date', 'after:date_start'],
            'terms' => ['nullable', 'string', 'max:5000'],
            'anti_sniping' => ['nullable', 'boolean'],
        ], [
            'deposit_percent.required' => 'Isi deposit (minimal '.PropertyAuction::MIN_DEPOSIT_PERCENT.'%).',
            'deposit_percent.min' => 'Deposit minimal '.PropertyAuction::MIN_DEPOSIT_PERCENT.'% dari nilai limit.',
            'date_finish.after' => 'Waktu tutup harus setelah waktu buka.',
            'status.in' => 'Status ini diatur otomatis oleh sistem.',
        ]);

        return ['anti_sniping' => $request->boolean('anti_sniping')] + $data;
    }

    /**
     * C2, C20: once someone paid a deposit, the terms of the auction stay put; while it runs,
     * the closing time can only move later. An ended auction is not edited at all.
     */
    private function guardChanges(PropertyAuction $auction, array $data): void
    {
        if (! in_array($auction->status, PropertyAuction::EDITABLE_STATUSES, true)) {
            throw ValidationException::withMessages(['status' => 'Lelang ini sudah selesai dan tidak bisa diubah lagi.']);
        }

        $errors = [];

        if ($auction->deposits()->whereNotNull('paid_at')->exists()) {
            $same = fn ($a, $b) => is_numeric($a) && is_numeric($b) ? (float) $a === (float) $b : (string) $a === (string) $b;

            foreach (['property_id', 'type', 'open_bid', 'bid_increment', 'deposit_percent'] as $field) {
                if (! $same($data[$field], $auction->{$field})) {
                    $errors[$field] = 'Sudah ada peserta yang membayar deposit: properti, jenis, nilai limit, kelipatan dan deposit terkunci.';
                }
            }
        }

        // Running (or paused mid-run): it can be paused and resumed, never re-scheduled earlier.
        if (in_array($auction->status, ['active', 'suspended'], true) && $auction->date_start->lte(now())) {
            if (! in_array($data['status'], ['active', 'suspended'], true)) {
                $errors['status'] = 'Lelang sudah berjalan: status hanya bisa Active atau Suspended. Untuk menghentikan, batalkan lelang.';
            }
            // The form sends minutes (datetime-local): compare at that precision.
            if (Carbon::parse($data['date_start'])->format('Y-m-d H:i') !== $auction->date_start->format('Y-m-d H:i')) {
                $errors['date_start'] = 'Lelang sudah berjalan: waktu buka tidak bisa diubah.';
            }
            if (Carbon::parse($data['date_finish'])->format('Y-m-d H:i') < $auction->date_finish->format('Y-m-d H:i')) {
                $errors['date_finish'] = 'Lelang sudah berjalan: waktu tutup hanya bisa diperpanjang.';
            }
        }

        if ($errors) {
            throw ValidationException::withMessages($errors);
        }
    }
}
