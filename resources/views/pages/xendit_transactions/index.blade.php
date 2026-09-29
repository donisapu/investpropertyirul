@extends('layouts.app')

@php
    $rupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    $typeLabels = ['PAYMENT' => 'Pembayaran', 'DISBURSEMENT' => 'Payout', 'REMITTANCE_PAYOUT' => 'Payout', 'TRANSFER' => 'Transfer', 'REFUND' => 'Refund', 'TOPUP' => 'Top up', 'WITHDRAWAL' => 'Penarikan'];
    $categoryLabels = ['VIRTUAL_ACCOUNT' => 'VA', 'EWALLET' => 'e-Wallet', 'QR_CODE' => 'QRIS', 'RETAIL_OUTLET' => 'Retail', 'CARDS' => 'Kartu', 'BANK' => 'Bank', 'DIRECT_DEBIT' => 'Direct debit'];
    $channel = function ($t) use ($categoryLabels) {
        $code = preg_replace('/^ID_/', '', (string) $t->channel_code);
        $cat = $categoryLabels[$t->channel_category] ?? null;
        return trim(($code ?: '') . ($cat && $cat !== $code ? ' ' . $cat : '')) ?: '-';
    };
    $statusOf = function ($t) {
        if ($t->status === 'SUCCESS' && $t->isMoneyIn()) {
            return match ($t->settlement_status) {
                'SETTLED', 'EARLY_SETTLED' => ['wx-ok', 'Settled'],
                default => ['wx-warn', 'Holding'],
            };
        }
        return match ($t->status) {
            'SUCCESS' => ['wx-ok', 'Berhasil'],
            'PENDING' => ['wx-warn', 'Pending'],
            'FAILED' => ['wx-bad', 'Gagal'],
            'VOIDED' => ['wx-muted', 'Dibatalkan'],
            'REVERSED' => ['wx-bad', 'Dibalik'],
            default => ['wx-muted', ucfirst(strtolower((string) $t->status)) ?: '-'],
        };
    };
    $keep = array_filter(\Illuminate\Support\Arr::only($filters, ['q', 'from', 'to', 'type', 'status', 'settlement']));
    $tabs = ['all' => 'Semua', 'in' => 'Uang masuk', 'out' => 'Uang keluar'];
@endphp

@section('content')
    <style>
        .wx-eyebrow { font-size: .75rem; font-weight: 600; color: #a1acb8; }
        .wx-tabs .nav-link { font-size: .8125rem; font-weight: 600; color: #697a8d; padding: .75rem .9rem; border-bottom: 2px solid transparent; border-radius: 0; }
        .wx-tabs .nav-link.active { color: #435971; font-weight: 800; border-bottom-color: #435971; background: none; }
        .wx-count { font-size: .6875rem; font-weight: 700; color: #a1acb8; margin-left: .25rem; }
        .wx-table th { font-size: .625rem; font-weight: 700; letter-spacing: .06em; color: #a1acb8; text-transform: uppercase; border-bottom-width: 1px; white-space: nowrap; }
        .wx-table td { vertical-align: middle; border-color: #e4e7eb; }
        .wx-time { font-size: .75rem; font-weight: 600; color: #697a8d; white-space: nowrap; }
        .wx-main { font-size: .8125rem; font-weight: 700; color: #435971; }
        .wx-sub { font-size: .6875rem; font-weight: 500; color: #697a8d; }
        .wx-in { color: #2f6b4f; font-weight: 800; font-size: .8125rem; white-space: nowrap; }
        .wx-out { color: #435971; font-weight: 800; font-size: .8125rem; white-space: nowrap; }
        .wx-fee { font-size: .6875rem; color: #a1acb8; white-space: nowrap; }
        .wx-pill { display: inline-flex; align-items: center; gap: .35rem; font-size: .6875rem; font-weight: 700; border-radius: 1rem; padding: .15rem .6rem; white-space: nowrap; }
        .wx-pill::before { content: ""; width: .35rem; height: .35rem; border-radius: 50%; background: currentColor; }
        .wx-ok { background: #e3ede5; color: #2f6b4f; }
        .wx-warn { background: #f5ead3; color: #8a5a12; }
        .wx-bad { background: #f4e1dc; color: #9b3b2e; }
        .wx-muted { background: #ebeef0; color: #697a8d; }
        .wx-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .6875rem; }
    </style>

    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <div class="wx-eyebrow">Keuangan / Xendit</div>
            <h4 class="fw-bolder mb-0" style="color:#435971">Xendit Transactions</h4>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="wx-sub me-1" title="{{ $lastSyncedAt?->timezone(config('app.timezone'))->format('d M Y H:i') }}">
                @if ($lastSyncedAt)
                    Tersinkron {{ $lastSyncedAt->locale('id')->diffForHumans() }}
                @else
                    Belum pernah tersinkron
                @endif
            </span>
            <form method="POST" action="{{ route('admin.xendit-transactions.sync') }}" onsubmit="this.querySelector('button').disabled = true">
                @csrf
                <button class="btn btn-sm btn-outline-secondary bg-white"><i class="bx bx-refresh me-1"></i>Sync sekarang</button>
            </form>
            <a href="{{ route('admin.xendit-transactions.export', array_filter([...$keep, 'tab' => $filters['tab'] !== 'all' ? $filters['tab'] : null])) }}"
                class="btn btn-sm btn-outline-secondary bg-white"><i class="bx bx-download me-1"></i>Export Excel</a>
        </div>
    </div>

    @foreach (['success' => 'success', 'info' => 'info', 'warning' => 'warning', 'error' => 'danger'] as $key => $class)
        @if (session($key))
            <div class="alert alert-{{ $class }} alert-dismissible" role="status">
                {{ session($key) }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button>
            </div>
        @endif
    @endforeach

    <div class="card">
        <ul class="nav wx-tabs border-bottom px-2">
            @foreach ($tabs as $key => $label)
                <li class="nav-item">
                    <a class="nav-link {{ $filters['tab'] === $key ? 'active' : '' }}" href="{{ route('admin.xendit-transactions', array_filter([...$keep, 'tab' => $key])) }}"
                        @if ($filters['tab'] === $key) aria-current="page" @endif>
                        {{ $label }}<span class="wx-count">{{ number_format($tabCounts[$key], 0, ',', '.') }}</span>
                    </a>
                </li>
            @endforeach
        </ul>

        <form method="GET" action="{{ route('admin.xendit-transactions') }}" class="p-3 d-flex flex-wrap gap-2 align-items-center border-bottom">
            <input type="hidden" name="tab" value="{{ $filters['tab'] }}">
            <input type="search" name="q" value="{{ $filters['q'] ?? '' }}" class="form-control form-control-sm" style="max-width:22rem"
                placeholder="Cari nama user, referensi, atau ID Xendit" aria-label="Cari">
            <input type="date" name="from" value="{{ $filters['from'] ?? '' }}" class="form-control form-control-sm" style="width:auto" aria-label="Dari tanggal">
            <span class="wx-sub">s/d</span>
            <input type="date" name="to" value="{{ $filters['to'] ?? '' }}" class="form-control form-control-sm" style="width:auto" aria-label="Sampai tanggal">
            <select name="type" class="form-select form-select-sm" style="width:auto" aria-label="Tipe">
                <option value="">Tipe: Semua</option>
                @foreach ($types as $type)
                    <option value="{{ $type }}" @selected(($filters['type'] ?? null) === $type)>{{ $typeLabels[$type] ?? $type }}</option>
                @endforeach
            </select>
            <select name="status" class="form-select form-select-sm" style="width:auto" aria-label="Status">
                <option value="">Status: Semua</option>
                @foreach ($statuses as $status)
                    <option value="{{ $status }}" @selected(($filters['status'] ?? null) === $status)>{{ $status }}</option>
                @endforeach
            </select>
            <select name="settlement" class="form-select form-select-sm" style="width:auto" aria-label="Settlement">
                <option value="">Settlement: Semua</option>
                <option value="SETTLED" @selected(($filters['settlement'] ?? null) === 'SETTLED')>Settled</option>
                <option value="PENDING" @selected(($filters['settlement'] ?? null) === 'PENDING')>Holding</option>
            </select>
            <button class="btn btn-sm btn-primary">Terapkan</button>
            @if ($keep)
                <a href="{{ route('admin.xendit-transactions', ['tab' => $filters['tab']]) }}" class="btn btn-sm btn-text-secondary">Reset</a>
            @endif
            @if ($errors->any())
                <small class="text-danger w-100">{{ $errors->first() }}</small>
            @endif
        </form>

        <div class="table-responsive">
            <table class="table wx-table mb-0">
                <thead>
                    <tr>
                        <th class="ps-4">Waktu</th>
                        <th>Tipe</th>
                        <th>User / Referensi</th>
                        <th class="text-end">Nominal</th>
                        <th class="pe-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($transactions as $t)
                        @php
                            $user = $t->linkedUser();
                            $property = $t->linkable instanceof \App\Models\Payment ? $t->linkable->payable?->property?->property_name : null;
                            [$pillClass, $pillText] = $statusOf($t);
                        @endphp
                        <tr>
                            <td class="ps-4 wx-time">{{ $t->xendit_created_at?->timezone(config('app.timezone'))->locale('id')->translatedFormat('j M H.i') }}</td>
                            <td>
                                <div class="wx-main">{{ $typeLabels[$t->type] ?? $t->type }}</div>
                                <div class="wx-sub">{{ $channel($t) }}</div>
                            </td>
                            <td style="min-width:14rem">
                                <div class="wx-main">{{ $user?->name ?? '—' }}</div>
                                <div class="wx-sub">
                                    <span class="wx-mono">{{ $t->reference_id ?? $t->xendit_id }}</span>@if ($property) · {{ $property }}@endif
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="{{ $t->isMoneyIn() ? 'wx-in' : 'wx-out' }}">{{ $t->isMoneyIn() ? '+' : '−' }} {{ $rupiah($t->amount) }}</div>
                                @if ((float) $t->fee > 0)
                                    <div class="wx-fee">fee {{ $rupiah($t->fee) }}</div>
                                @endif
                            </td>
                            <td class="pe-4"><span class="wx-pill {{ $pillClass }}">{{ $pillText }}</span></td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center wx-sub py-5">
                                @if ($tabCounts['all'] === 0 && ! $keep)
                                    Belum ada data. Klik <strong>Sync sekarang</strong> untuk menarik transaksi dari Xendit.
                                @else
                                    Tidak ada transaksi untuk filter ini.
                                @endif
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if ($transactions->total() > 0)
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 px-4 border-top">
                <span class="wx-sub">Menampilkan {{ $transactions->firstItem() }}–{{ $transactions->lastItem() }} dari {{ number_format($transactions->total(), 0, ',', '.') }}</span>
                {{ $transactions->onEachSide(1)->links('pagination::bootstrap-5') }}
            </div>
        @endif
    </div>
@endsection
