<?php

namespace App\Http\Controllers\Admin;

use App\Models\Wallet;
use App\Models\Withdrawal;
use App\Services\Withdrawal\AccountNameMatch;
use App\Services\Withdrawal\PayoutAttempt;
use App\Services\Withdrawal\PayoutFailure;
use App\Services\Withdrawal\WithdrawalActionRejected;
use App\Services\Withdrawal\WithdrawalService;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

/**
 * Admin Withdrawals queue (mockup "Admin · Withdrawals"): status tabs, search,
 * date filter, and a detail pane to approve or reject.
 */
class AdminWithdrawalController extends AdminController
{
    protected string $viewPath = 'withdrawals';

    /** Tab => statuses shown in it. */
    private const TABS = [
        'pending' => [Withdrawal::STATUS_PENDING],
        'processing' => [Withdrawal::STATUS_PROCESSING],
        'done' => [Withdrawal::STATUS_SUCCEEDED],
        'failed' => [Withdrawal::STATUS_FAILED, Withdrawal::STATUS_REJECTED, Withdrawal::STATUS_REVERSED],
        'all' => Withdrawal::STATUSES,
    ];

    public function index(Request $request, BankChannelCatalog $banks)
    {
        $filters = $request->validate([
            'tab' => ['nullable', 'in:'.implode(',', array_keys(self::TABS))],
            'q' => ['nullable', 'string', 'max:100'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
            'sort' => ['nullable', 'in:oldest,newest'],
            'id' => ['nullable', 'integer'],
        ]);

        $tab = $filters['tab'] ?? 'pending';
        // Oldest first while waiting (fair queue), newest first everywhere else.
        $sort = $filters['sort'] ?? ($tab === 'pending' ? 'oldest' : 'newest');

        $queue = $this->filtered($filters)
            ->whereIn('status', self::TABS[$tab])
            ->with(['user:id,name,email', 'bankAccount'])
            ->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc')
            ->orderBy('id', $sort === 'oldest' ? 'asc' : 'desc')
            ->paginate(20)
            ->withQueryString();

        $selected = isset($filters['id'])
            ? Withdrawal::with(['user', 'bankAccount', 'approvedBy:id,name'])->find($filters['id'])
            : $queue->first()?->load(['user', 'approvedBy:id,name']);

        $tabCounts = $this->filtered($filters)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return $this->view('index', [
            'title' => 'Withdrawals',
            'queue' => $queue,
            'selected' => $selected,
            'detail' => $selected ? $this->detail($selected, $banks) : null,
            'tab' => $tab,
            'sort' => $sort,
            'filters' => $filters,
            'tabs' => collect(self::TABS)->map(fn (array $statuses) => (int) $tabCounts->only($statuses)->sum()),
            'stats' => $this->stats(),
        ]);
    }

    public function approve(Request $request, Withdrawal $withdrawal, WithdrawalService $service)
    {
        try {
            $attempt = $service->approve($withdrawal, $request->user());
        } catch (WithdrawalActionRejected $e) {
            return $this->backTo($request, $withdrawal)->with('error', $e->getMessage());
        }

        return $this->afterAttempt($request, $attempt);
    }

    public function resend(Request $request, Withdrawal $withdrawal, WithdrawalService $service)
    {
        try {
            $attempt = $service->resendPayout($withdrawal);
        } catch (WithdrawalActionRejected $e) {
            return $this->backTo($request, $withdrawal)->with('error', $e->getMessage());
        }

        return $this->afterAttempt($request, $attempt);
    }

    public function reject(Request $request, Withdrawal $withdrawal, WithdrawalService $service)
    {
        $data = $request->validate([
            'failure_reason' => ['required', 'string', 'min:5', 'max:255'],
        ], [
            'failure_reason.required' => 'Alasan penolakan wajib diisi.',
            'failure_reason.min' => 'Tulis alasan yang jelas untuk user (minimal 5 karakter).',
        ]);

        try {
            $service->reject($withdrawal, $request->user(), $data['failure_reason']);
        } catch (WithdrawalActionRejected $e) {
            return $this->backTo($request, $withdrawal)->with('error', $e->getMessage());
        }

        return $this->backTo($request, $withdrawal)
            ->with('success', 'Penarikan ditolak. Saldo '.$this->rupiah($withdrawal->totalDeduction()).' dikembalikan ke wallet user.');
    }

    private function afterAttempt(Request $request, PayoutAttempt $attempt)
    {
        $flash = match ($attempt->outcome) {
            PayoutAttempt::SENT => ['success', 'Disetujui. Payout '.$this->rupiah($attempt->withdrawal->amount).' dikirim ke Xendit.'],
            PayoutAttempt::UNKNOWN => ['warning', $attempt->message],
            default => ['error', $attempt->message],
        };

        return $this->backTo($request, $attempt->withdrawal)->with(...$flash);
    }

    /** Back to the queue with the same filters, keeping this Withdrawal open. */
    private function backTo(Request $request, Withdrawal $withdrawal)
    {
        $query = array_filter([
            ...$request->only(['tab', 'q', 'from', 'to', 'sort']),
            'id' => $withdrawal->id,
        ], fn ($v) => $v !== null && $v !== '');

        return redirect()->route('admin.user-withdrawals', $query);
    }

    private function filtered(array $filters): Builder
    {
        return Withdrawal::query()
            ->when($filters['q'] ?? null, function (Builder $q, string $term) {
                $like = '%'.str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $term).'%';
                $q->where(fn (Builder $w) => $w
                    ->where('external_id', 'like', $like)
                    ->orWhereHas('user', fn (Builder $u) => $u->where('name', 'like', $like)->orWhere('email', 'like', $like)));
            })
            ->when($filters['from'] ?? null, fn (Builder $q, string $from) => $q->where('created_at', '>=', Carbon::parse($from)->startOfDay()))
            ->when($filters['to'] ?? null, fn (Builder $q, string $to) => $q->where('created_at', '<=', Carbon::parse($to)->endOfDay()));
    }

    private function stats(): array
    {
        $sum = fn (Builder $q) => [(int) (clone $q)->count(), (int) (clone $q)->sum('amount')];

        return [
            'pending' => $sum(Withdrawal::where('status', Withdrawal::STATUS_PENDING)),
            'processing' => $sum(Withdrawal::where('status', Withdrawal::STATUS_PROCESSING)),
            'succeeded_month' => $sum(Withdrawal::where('status', Withdrawal::STATUS_SUCCEEDED)
                ->where(fn (Builder $q) => $q->where('processed_at', '>=', now()->startOfMonth())
                    ->orWhere(fn (Builder $q) => $q->whereNull('processed_at')->where('updated_at', '>=', now()->startOfMonth())))),
        ];
    }

    private function detail(Withdrawal $w, BankChannelCatalog $banks): array
    {
        $account = $w->bankAccount;
        $history = Withdrawal::where('user_id', $w->user_id)->whereKeyNot($w->id);
        $limits = $account && $banks->has($account->bank_code) ? $banks->limitsFor($account->bank_code) : null;
        // Banks report technical limits (min Rp 1, max Rp 999 M); only show ones an admin can act on.
        if ($limits) {
            $limits['max'] = $limits['max'] !== null && $limits['max'] <= 10_000_000_000 ? $limits['max'] : null;
            $limits = ($limits['min'] > 1000 || $limits['max'] !== null) ? $limits : null;
        }

        return [
            'name_matches' => AccountNameMatch::matches($w->user?->name, $account?->account_holder_name),
            'wallet_balance' => (int) floor((float) Wallet::where('user_id', $w->user_id)->value('balance')),
            'previous_succeeded' => (clone $history)->where('status', Withdrawal::STATUS_SUCCEEDED)->count(),
            'previous_failed' => (clone $history)->whereIn('status', [Withdrawal::STATUS_FAILED, Withdrawal::STATUS_REVERSED])->count(),
            'bank_limits' => $limits,
            'failure_text' => PayoutFailure::message($w->failure_code),
            'can_resend' => $w->status === Withdrawal::STATUS_PROCESSING && $w->xendit_id === null,
            'steps' => $this->steps($w),
        ];
    }

    /** Timeline: Diajukan -> Approve admin -> Dikirim ke Xendit -> Masuk rekening. */
    private function steps(Withdrawal $w): array
    {
        $at = fn (?Carbon $t) => $t?->timezone(config('app.timezone'))->translatedFormat('j M H.i');
        $final = in_array($w->status, [Withdrawal::STATUS_FAILED, Withdrawal::STATUS_REJECTED, Withdrawal::STATUS_REVERSED], true);

        return [
            ['label' => 'Diajukan', 'state' => 'done', 'note' => $at($w->created_at)],
            match (true) {
                $w->status === Withdrawal::STATUS_PENDING => ['label' => 'Approve admin', 'state' => 'current', 'note' => 'Menunggu kamu'],
                $w->status === Withdrawal::STATUS_REJECTED => ['label' => 'Ditolak admin', 'state' => 'failed', 'note' => $at($w->processed_at)],
                default => ['label' => 'Approve admin', 'state' => 'done', 'note' => trim(($w->approvedBy?->name ?? '').' '.$at($w->approved_at))],
            },
            match (true) {
                in_array($w->status, [Withdrawal::STATUS_PENDING, Withdrawal::STATUS_REJECTED], true) => ['label' => 'Dikirim ke Xendit', 'state' => 'todo', 'note' => null],
                $w->xendit_id === null && $w->status === Withdrawal::STATUS_PROCESSING => ['label' => 'Dikirim ke Xendit', 'state' => 'current', 'note' => 'Hasil belum pasti'],
                $w->xendit_id === null => ['label' => 'Dikirim ke Xendit', 'state' => 'failed', 'note' => 'Ditolak Xendit'],
                default => ['label' => 'Dikirim ke Xendit', 'state' => 'done', 'note' => $w->payout_status],
            },
            match (true) {
                $w->status === Withdrawal::STATUS_SUCCEEDED => ['label' => 'Masuk rekening', 'state' => 'done', 'note' => $at($w->processed_at)],
                $final && $w->status !== Withdrawal::STATUS_REJECTED && $w->xendit_id !== null => ['label' => $w->status === Withdrawal::STATUS_REVERSED ? 'Dibatalkan bank' : 'Gagal', 'state' => 'failed', 'note' => $at($w->processed_at)],
                $w->status === Withdrawal::STATUS_PROCESSING && $w->xendit_id !== null => ['label' => 'Masuk rekening', 'state' => 'current', 'note' => 'Menunggu webhook'],
                default => ['label' => 'Masuk rekening', 'state' => 'todo', 'note' => null],
            },
        ];
    }

    private function rupiah(int|float $value): string
    {
        return 'Rp '.number_format($value, 0, ',', '.');
    }
}
