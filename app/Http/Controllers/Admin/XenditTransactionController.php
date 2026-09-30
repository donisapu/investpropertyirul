<?php

namespace App\Http\Controllers\Admin;

use App\Models\Payment;
use App\Models\Withdrawal;
use App\Models\XenditTransaction;
use App\Services\Xendit\Exceptions\XenditException;
use App\Services\Xendit\TransactionMirror;
use App\Support\SimpleXlsxWriter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

/**
 * Admin > Xendit Transactions: reads only the local mirror (fast, searchable).
 * Company Cash-out selection on this page comes with XW-10.
 */
class XenditTransactionController extends AdminController
{
    protected string $viewPath = 'xendit_transactions';

    private const EXPORT_LIMIT = 50000;

    private const TABS = ['all' => null, 'in' => XenditTransaction::MONEY_IN, 'out' => XenditTransaction::MONEY_OUT];

    public function index(Request $request, TransactionMirror $mirror)
    {
        $filters = $this->filters($request);

        $transactions = $this->query($filters)
            ->with(['linkable' => fn (MorphTo $m) => $m->morphWith([
                Payment::class => ['user:id,name,email', 'payable.property:id,property_name'],
                Withdrawal::class => ['user:id,name,email'],
            ])])
            ->orderByDesc('xendit_created_at')
            ->orderByDesc('id')
            ->paginate(25)
            ->withQueryString();

        $counts = $this->query([...$filters, 'tab' => 'all'])
            ->selectRaw('cashflow, count(*) as total')
            ->groupBy('cashflow')
            ->pluck('total', 'cashflow');

        return $this->view('index', [
            'title' => 'Xendit Transactions',
            'transactions' => $transactions,
            'filters' => $filters,
            'tabCounts' => [
                'all' => (int) $counts->sum(),
                'in' => (int) ($counts[XenditTransaction::MONEY_IN] ?? 0),
                'out' => (int) ($counts[XenditTransaction::MONEY_OUT] ?? 0),
            ],
            'types' => XenditTransaction::query()->whereNotNull('type')->distinct()->orderBy('type')->pluck('type'),
            'statuses' => XenditTransaction::query()->whereNotNull('status')->distinct()->orderBy('status')->pluck('status'),
            'lastSyncedAt' => $mirror->lastSyncedAt(),
            'syncState' => $mirror->state(),
        ]);
    }

    public function sync(Request $request, TransactionMirror $mirror)
    {
        try {
            // A short run keeps the button responsive; the scheduler continues any backlog.
            $result = $mirror->sync(10);
        } catch (XenditException) {
            return back()->with('warning', 'Xendit tidak bisa dibaca sekarang. Data yang tampil adalah hasil sinkron terakhir.');
        }

        if ($result['skipped'] ?? false) {
            return back()->with('info', 'Sinkronisasi lain sedang berjalan. Coba lagi sebentar lagi.');
        }

        return back()->with('success', sprintf(
            'Tersinkron: %d baru, %d berubah.%s',
            $result['created'], $result['updated'],
            $result['complete'] ? '' : ' Masih ada data lama, dilanjutkan otomatis tiap 10 menit.',
        ));
    }

    public function export(Request $request)
    {
        $filters = $this->filters($request);
        $query = $this->query($filters)
            ->with(['linkable' => fn (MorphTo $m) => $m->morphWith([
                Payment::class => ['user:id,name,email', 'payable.property:id,property_name'],
                Withdrawal::class => ['user:id,name,email'],
            ])])
            ->orderByDesc('xendit_created_at')
            ->orderByDesc('id');

        $rows = (function () use ($query) {
            // Pages of 500 with eager loading, capped (lazy() would drop a limit()).
            $pageSize = 500;
            for ($page = 1; ($page - 1) * $pageSize < self::EXPORT_LIMIT; $page++) {
                $batch = (clone $query)->forPage($page, $pageSize)->get();
                if ($batch->isEmpty()) {
                    return;
                }
                foreach ($batch as $t) {
                    $user = $t->linkedUser();
                    yield [
                        $t->xendit_created_at?->timezone(config('app.timezone'))->format('Y-m-d H:i:s'),
                        $t->xendit_id,
                        $t->type,
                        $t->channel_category,
                        $t->channel_code,
                        $t->cashflow === XenditTransaction::MONEY_IN ? 'Masuk' : ($t->cashflow === XenditTransaction::MONEY_OUT ? 'Keluar' : $t->cashflow),
                        $user?->name,
                        $user?->email,
                        $t->reference_id,
                        $t->product_id,
                        (float) $t->amount,
                        (float) $t->fee,
                        round((float) $t->amount - (float) $t->fee, 2),
                        $t->currency,
                        $t->status,
                        $t->settlement_status,
                    ];
                }
            }
        })();

        $path = tempnam(sys_get_temp_dir(), 'xtx').'.xlsx';
        SimpleXlsxWriter::write($path, [
            'Waktu', 'Xendit ID', 'Tipe', 'Kategori channel', 'Channel', 'Arus', 'User', 'Email',
            'Referensi', 'Product ID', 'Nominal', 'Fee Xendit', 'Bersih', 'Mata uang', 'Status', 'Settlement',
        ], $rows, 'Xendit Transactions');

        return response()
            ->download($path, 'xendit-transactions-'.now()->format('Ymd-His').'.xlsx', [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend();
    }

    private function filters(Request $request): array
    {
        return $request->validate([
            'tab' => ['nullable', 'in:all,in,out'],
            'q' => ['nullable', 'string', 'max:100'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
            'type' => ['nullable', 'string', 'max:64', 'regex:/^[A-Z0-9_]+$/'],
            'status' => ['nullable', 'string', 'max:32', 'regex:/^[A-Z0-9_]+$/'],
            'settlement' => ['nullable', 'in:SETTLED,PENDING,EARLY_SETTLED'],
        ]) + ['tab' => 'all'];
    }

    private function query(array $f): Builder
    {
        $like = isset($f['q']) ? '%'.$f['q'].'%' : null;
        // Case-insensitive search on every driver (Postgres LIKE is case-sensitive).
        $op = XenditTransaction::query()->getConnection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return XenditTransaction::query()
            ->when(self::TABS[$f['tab'] ?? 'all'] ?? null, fn (Builder $q, string $cashflow) => $q->where('cashflow', $cashflow))
            ->when($like, fn (Builder $q) => $q->where(fn (Builder $w) => $w
                ->where('reference_id', $op, $like)
                ->orWhere('xendit_id', $op, $like)
                ->orWhere('product_id', $op, $like)
                ->orWhereHasMorph('linkable', [Payment::class, Withdrawal::class],
                    fn (Builder $l) => $l->whereHas('user', fn (Builder $u) => $u->where('name', $op, $like)->orWhere('email', $op, $like)))))
            ->when($f['from'] ?? null, fn (Builder $q, string $d) => $q->where('xendit_created_at', '>=', Carbon::parse($d)->startOfDay()))
            ->when($f['to'] ?? null, fn (Builder $q, string $d) => $q->where('xendit_created_at', '<=', Carbon::parse($d)->endOfDay()))
            ->when($f['type'] ?? null, fn (Builder $q, string $t) => $q->where('type', $t))
            ->when($f['status'] ?? null, fn (Builder $q, string $s) => $q->where('status', $s))
            ->when($f['settlement'] ?? null, fn (Builder $q, string $s) => $q->where('settlement_status', $s));
    }
}
