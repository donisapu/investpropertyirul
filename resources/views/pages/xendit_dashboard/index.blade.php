@extends('layouts.app')

@php
    $rupiah = fn ($v) => $v === null ? '—' : 'Rp ' . number_format((float) $v, 0, ',', '.');
    $cash = $balances['cash'];
    $holding = $balances['holding'];
    $reserveTotal = $reserve['total'];
    // Bar under the balance: share of CASH that is Reserve vs free to cash out.
    $reservePct = $cash && $cash > 0 ? min(100, round($reserveTotal / $cash * 100, 1)) : ($cash === null ? 0 : 100);
    $maxDay = max(1, collect($daily)->max(fn ($d) => max($d['in'], $d['out'])));
    $oldest = $actions['pending_oldest'] ? \Illuminate\Support\Carbon::parse($actions['pending_oldest']) : null;
    $typeLabel = function ($t) {
        if ($t->linkable instanceof \App\Models\Withdrawal) return 'Payout withdraw';
        return match ($t->type) {
            'PAYMENT' => $t->isMoneyIn() ? 'Invoice dibayar' : 'Pembayaran',
            'DISBURSEMENT' => 'Payout',
            'TOPUP' => 'Top up',
            'REFUND' => 'Refund',
            default => ucfirst(strtolower(str_replace('_', ' ', (string) $t->type))),
        };
    };
    $statusOf = function ($t) {
        if ($t->linkable instanceof \App\Models\Withdrawal) {
            return match ($t->linkable->status) {
                'processing' => ['xd-info', 'Diproses'],
                'succeeded' => ['xd-ok', 'Berhasil'],
                'failed', 'reversed' => ['xd-bad', 'Gagal · refund'],
                default => ['xd-muted', ucfirst($t->linkable->status)],
            };
        }
        if ($t->status === 'SUCCESS' && $t->isMoneyIn()) {
            return in_array($t->settlement_status, ['SETTLED', 'EARLY_SETTLED'], true) ? ['xd-ok', 'Settled'] : ['xd-warn', 'Holding'];
        }
        return match ($t->status) {
            'SUCCESS' => ['xd-ok', 'Berhasil'],
            'PENDING' => ['xd-warn', 'Pending'],
            'FAILED', 'REVERSED' => ['xd-bad', $t->status === 'FAILED' ? 'Gagal' : 'Dibalik'],
            default => ['xd-muted', ucfirst(strtolower((string) $t->status))],
        };
    };
@endphp

@section('content')
    <style>
        .xd-eyebrow { font-size: .75rem; font-weight: 600; color: #a1acb8; }
        .xd-label { font-size: .75rem; font-weight: 600; color: #697a8d; }
        .xd-hero { font-size: 2.5rem; font-weight: 800; color: #435971; line-height: 1.1; }
        .xd-num { font-weight: 800; color: #435971; }
        .xd-note { font-size: .75rem; font-weight: 500; color: #697a8d; }
        .xd-faint { font-size: .6875rem; color: #a1acb8; }
        .xd-split { height: .5rem; border-radius: 1rem; background: #71a35f; overflow: hidden; display: flex; }
        .xd-split > span { background: #435971; }
        .xd-dot { display: inline-block; width: .5rem; height: .5rem; border-radius: 50%; margin-right: .35rem; }
        .xd-action { display: flex; align-items: center; gap: 1rem; padding: .85rem 0; border-top: 1px solid #e4e7eb; color: inherit; }
        .xd-action:first-of-type { border-top: 0; }
        .xd-action .xd-big { font-size: 1.625rem; font-weight: 800; color: #435971; min-width: 2.5rem; }
        .xd-action .xd-go { font-size: .75rem; font-weight: 700; color: #71a35f; background: #e8f1e4; border-radius: .375rem; padding: .25rem .6rem; white-space: nowrap; }
        .xd-action:hover .xd-go { background: #d7e8d0; }
        .xd-seg .btn { font-size: .75rem; font-weight: 600; }
        .xd-flow { font-size: 1.25rem; font-weight: 800; }
        .xd-in { color: #2f6b4f; } .xd-out { color: #435971; } .xd-fee { color: #697a8d; }
        /* 14-day grouped bars: thin columns, 4px rounded tops, 2px gap, recessive baseline. */
        .xd-chart { display: grid; grid-template-columns: repeat(14, 1fr); gap: .5rem; align-items: end; height: 10rem; border-bottom: 1px solid #e4e7eb; padding: 0 .25rem; }
        .xd-day { position: relative; display: flex; justify-content: center; align-items: end; gap: 2px; height: 100%; }
        .xd-bar { width: min(12px, 40%); border-radius: 4px 4px 0 0; min-height: 0; }
        .xd-bar-in { background: #4e8a45; } .xd-bar-out { background: #5a6fb0; }
        .xd-day:hover .xd-bar, .xd-day:focus-visible .xd-bar { filter: brightness(1.1); }
        .xd-tip { display: none; position: absolute; bottom: calc(100% + .25rem); left: 50%; transform: translateX(-50%); background: #fff; border: 1px solid #e4e7eb; border-radius: .375rem; box-shadow: 0 .25rem .75rem rgba(67,89,113,.15); padding: .4rem .6rem; font-size: .6875rem; white-space: nowrap; z-index: 2; color: #435971; }
        .xd-day:hover .xd-tip, .xd-day:focus-visible .xd-tip { display: block; }
        .xd-axis { display: grid; grid-template-columns: repeat(14, 1fr); gap: .5rem; padding: .35rem .25rem 0; }
        .xd-axis span { font-size: .6875rem; font-weight: 600; color: #a1acb8; text-align: center; }
        .xd-table th { font-size: .625rem; font-weight: 700; letter-spacing: .06em; color: #a1acb8; text-transform: uppercase; white-space: nowrap; }
        .xd-table td { vertical-align: middle; font-size: .8125rem; }
        .xd-pill { display: inline-flex; align-items: center; gap: .35rem; font-size: .6875rem; font-weight: 700; border-radius: 1rem; padding: .15rem .6rem; white-space: nowrap; }
        .xd-pill::before { content: ""; width: .35rem; height: .35rem; border-radius: 50%; background: currentColor; }
        .xd-ok { background: #e3ede5; color: #2f6b4f; } .xd-warn { background: #f5ead3; color: #8a5a12; }
        .xd-bad { background: #f4e1dc; color: #9b3b2e; } .xd-info { background: #e2e9f0; color: #35577a; } .xd-muted { background: #ebeef0; color: #697a8d; }
        .xd-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .6875rem; }
    </style>

    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <div class="xd-eyebrow">Keuangan / Xendit</div>
            <h4 class="fw-bolder mb-0" style="color:#435971">Xendit Dashboard</h4>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="xd-note me-1">{{ $last_synced_at ? 'Tersinkron ' . $last_synced_at->locale('id')->diffForHumans() : 'Belum pernah tersinkron' }}</span>
            <form method="POST" action="{{ route('admin.xendit-transactions.sync') }}" onsubmit="this.querySelector('button').disabled = true">
                @csrf
                <button class="btn btn-sm btn-outline-secondary bg-white"><i class="bx bx-refresh me-1"></i>Sync sekarang</button>
            </form>
            <a href="https://dashboard.xendit.co" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-text-secondary">Buka Xendit <i class="bx bx-link-external"></i></a>
        </div>
    </div>

    @foreach (['success' => 'success', 'info' => 'info', 'warning' => 'warning', 'error' => 'danger'] as $key => $class)
        @if (session($key))
            <div class="alert alert-{{ $class }} alert-dismissible" role="status">{{ session($key) }}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button></div>
        @endif
    @endforeach

    @if ($balances['stale'])
        <div class="alert alert-warning" role="alert">
            <strong>{{ $balances['error'] }}</strong>
            @if ($balances['fetched_at'])
                Saldo yang tampil adalah nilai terakhir yang diketahui ({{ $balances['fetched_at']->timezone(config('app.timezone'))->locale('id')->translatedFormat('j M H.i') }}, {{ $balances['fetched_at']->locale('id')->diffForHumans() }}).
            @else
                Saldo belum pernah terbaca.
            @endif
            Data transaksi di bawah dari sinkron terakhir.
        </div>
    @endif

    <div class="row g-4 mb-4">
        {{-- Balance + Reserve --}}
        <div class="col-lg-8">
            <div class="card h-100">
                <div class="card-body p-4">
                    <div class="d-flex flex-wrap justify-content-between gap-3">
                        <div>
                            <div class="xd-label">Saldo Xendit tersedia</div>
                            <div class="xd-hero">{{ $rupiah($cash) }}</div>
                        </div>
                        <div class="text-end">
                            <div class="xd-label">Belum settle (HOLDING)</div>
                            <div class="xd-num" style="font-size:1rem">{{ $rupiah($holding) }}</div>
                        </div>
                    </div>

                    <div class="xd-split my-4" role="img" aria-label="Reserve {{ $reservePct }}% dari saldo tersedia">
                        <span style="width: {{ $reservePct }}%"></span>
                    </div>

                    <div class="row g-4">
                        <div class="col-sm-6">
                            <div class="xd-label"><span class="xd-dot" style="background:#435971"></span>Reserve (uang user)</div>
                            <div class="xd-num" style="font-size:1.375rem">{{ $rupiah($reserveTotal) }}</div>
                            <div class="xd-note">Saldo wallet semua user + {{ $reserve['open_withdrawal_count'] }} withdraw terbuka. Terkunci.</div>
                        </div>
                        <div class="col-sm-6">
                            <div class="xd-label"><span class="xd-dot" style="background:#71a35f"></span>Bisa dicairkan perusahaan</div>
                            <div class="xd-num" style="font-size:1.375rem">{{ $rupiah($max_cashout) }}</div>
                            <div class="xd-note">Batas maksimal Company Cash-out saat ini.</div>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4 pt-3 border-top">
                        <span class="xd-note fw-semibold">Cash-out diblokir otomatis jika melebihi batas ini.</span>
                        <a href="{{ route('admin.xendit-transactions', ['tab' => 'in', 'settlement' => 'SETTLED']) }}" class="btn btn-sm btn-primary">
                            Company Cash-out <i class="bx bx-right-arrow-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {{-- Needs action --}}
        <div class="col-lg-4">
            <div class="card h-100">
                <div class="card-body p-4">
                    <h6 class="fw-bolder mb-2" style="color:#435971">Perlu tindakan</h6>
                    <a class="xd-action" href="{{ route('admin.user-withdrawals', ['tab' => 'pending']) }}">
                        <span class="xd-big">{{ $actions['pending_count'] }}</span>
                        <span class="flex-grow-1">
                            <span class="d-block fw-bold" style="font-size:.8125rem;color:#435971">Withdraw menunggu approve</span>
                            <span class="xd-note">{{ $oldest ? 'Tertua ' . $oldest->locale('id')->diffForHumans() . ' · ' . $rupiah($actions['pending_total']) : 'Tidak ada antrean' }}</span>
                        </span>
                        <span class="xd-go">Tinjau</span>
                    </a>
                    <a class="xd-action" href="{{ route('admin.user-withdrawals', ['tab' => 'processing']) }}">
                        <span class="xd-big">{{ $actions['stuck_count'] }}</span>
                        <span class="flex-grow-1">
                            <span class="d-block fw-bold" style="font-size:.8125rem;color:#435971">Payout diproses &gt; 24 jam</span>
                            <span class="xd-note">Belum ada kabar dari Xendit</span>
                        </span>
                        <span class="xd-go">Cek status</span>
                    </a>
                    <a class="xd-action" href="{{ route('admin.xendit-transactions', ['tab' => 'in', 'settlement' => 'SETTLED']) }}">
                        <span class="xd-big">{{ $actions['cashout_ready_count'] }}</span>
                        <span class="flex-grow-1">
                            <span class="d-block fw-bold" style="font-size:.8125rem;color:#435971">Transaksi siap dicairkan</span>
                            <span class="xd-note">Uang masuk yang sudah settle</span>
                        </span>
                        <span class="xd-go">Pilih</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- Cash flow --}}
    <div class="card mb-4">
        <div class="card-body p-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h6 class="fw-bolder mb-0" style="color:#435971">Arus kas</h6>
                <div class="btn-group btn-group-sm xd-seg" role="group" aria-label="Periode">
                    @foreach (['today' => 'Hari ini', 'days14' => '14 hari', 'month' => 'Bulan ini'] as $key => $label)
                        <button type="button" class="btn btn-outline-secondary {{ $key === 'days14' ? 'active' : '' }}" data-period="{{ $key }}" aria-pressed="{{ $key === 'days14' ? 'true' : 'false' }}">{{ $label }}</button>
                    @endforeach
                </div>
            </div>

            <div class="d-flex flex-wrap gap-5 mb-4">
                @foreach ($flows as $key => $f)
                    <div class="d-flex flex-wrap gap-5 {{ $key === 'days14' ? '' : 'd-none' }}" data-flows="{{ $key }}">
                        <div><div class="xd-label">Uang masuk</div><div class="xd-flow xd-in">+ {{ $rupiah($f['in']) }}</div></div>
                        <div><div class="xd-label">Uang keluar</div><div class="xd-flow xd-out">− {{ $rupiah($f['out']) }}</div></div>
                        <div><div class="xd-label">Fee Xendit</div><div class="xd-flow xd-fee">{{ $rupiah($f['fee']) }}</div></div>
                    </div>
                @endforeach
            </div>

            <div class="d-flex gap-3 mb-2 xd-note" aria-hidden="true">
                <span><span class="xd-dot" style="background:#4e8a45;border-radius:2px"></span>Uang masuk</span>
                <span><span class="xd-dot" style="background:#5a6fb0;border-radius:2px"></span>Uang keluar</span>
                <span class="xd-faint ms-auto">14 hari terakhir · transaksi berhasil</span>
            </div>
            @php $hasFlow = collect($daily)->contains(fn ($d) => $d['in'] > 0 || $d['out'] > 0); @endphp
            <div class="xd-chart position-relative" aria-hidden="true">
                @unless ($hasFlow)
                    <span class="position-absolute top-50 start-50 translate-middle xd-note">Belum ada transaksi berhasil dalam 14 hari terakhir.</span>
                @endunless
                @foreach ($daily as $d)
                    <div class="xd-day" tabindex="0">
                        <span class="xd-bar xd-bar-in" style="height: {{ round($d['in'] / $maxDay * 100, 2) }}%"></span>
                        <span class="xd-bar xd-bar-out" style="height: {{ round($d['out'] / $maxDay * 100, 2) }}%"></span>
                        <span class="xd-tip">
                            <strong>{{ $d['date']->locale('id')->translatedFormat('j M') }}</strong><br>
                            Masuk {{ $rupiah($d['in']) }}<br>Keluar {{ $rupiah($d['out']) }}
                        </span>
                    </div>
                @endforeach
            </div>
            <div class="xd-axis" aria-hidden="true">
                @foreach ($daily as $i => $d)
                    <span>{{ in_array($i, [0, 6, 13], true) ? $d['date']->locale('id')->translatedFormat('j M') : '' }}</span>
                @endforeach
            </div>
            <table class="visually-hidden">
                <caption>Arus kas 14 hari terakhir</caption>
                <thead><tr><th>Tanggal</th><th>Uang masuk</th><th>Uang keluar</th></tr></thead>
                <tbody>
                    @foreach ($daily as $d)
                        <tr><td>{{ $d['date']->toDateString() }}</td><td>{{ $rupiah($d['in']) }}</td><td>{{ $rupiah($d['out']) }}</td></tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    {{-- Latest transactions --}}
    <div class="card">
        <div class="d-flex justify-content-between align-items-center p-4 pb-2">
            <h6 class="fw-bolder mb-0" style="color:#435971">Transaksi terbaru</h6>
            <a href="{{ route('admin.xendit-transactions') }}" class="fw-bold" style="font-size:.75rem;color:#5b8a4b">Lihat semua transaksi <i class="bx bx-right-arrow-alt"></i></a>
        </div>
        <div class="table-responsive">
            <table class="table xd-table mb-0">
                <thead>
                    <tr><th class="ps-4">Waktu</th><th>Tipe</th><th>User / Referensi</th><th>Channel</th><th class="text-end">Nominal</th><th class="pe-4">Status</th></tr>
                </thead>
                <tbody>
                    @forelse ($latest as $t)
                        @php
                            [$pill, $pillText] = $statusOf($t);
                            $user = $t->linkedUser();
                            $property = $t->linkable instanceof \App\Models\Payment ? $t->linkable->payable?->property?->property_name : null;
                        @endphp
                        <tr>
                            <td class="ps-4 text-nowrap" style="color:#697a8d">{{ $t->xendit_created_at?->timezone(config('app.timezone'))->locale('id')->translatedFormat('j M · H.i') }}</td>
                            <td class="fw-bold" style="color:#435971">{{ $typeLabel($t) }}</td>
                            <td>
                                <div class="fw-bold" style="color:#435971">{{ $user?->name ?? '—' }}</div>
                                <div class="xd-mono" style="color:#697a8d">{{ $t->reference_id ?? $t->xendit_id }}@if ($property) · {{ $property }}@endif</div>
                            </td>
                            <td style="color:#697a8d">{{ $t->channel_code ?? '-' }}</td>
                            <td class="text-end fw-bold text-nowrap {{ $t->isMoneyIn() ? 'xd-in' : 'xd-out' }}">{{ $t->isMoneyIn() ? '+' : '−' }} {{ $rupiah($t->amount) }}</td>
                            <td class="pe-4"><span class="xd-pill {{ $pill }}">{{ $pillText }}</span></td>
                        </tr>
                    @empty
                        <tr><td colspan="6" class="text-center xd-note py-5">Belum ada transaksi. Klik <strong>Sync sekarang</strong>.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        document.querySelectorAll('[data-period]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('[data-period]').forEach(function (b) {
                    var on = b === btn;
                    b.classList.toggle('active', on);
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                document.querySelectorAll('[data-flows]').forEach(function (el) {
                    el.classList.toggle('d-none', el.dataset.flows !== btn.dataset.period);
                });
            });
        });
    </script>
@endpush
