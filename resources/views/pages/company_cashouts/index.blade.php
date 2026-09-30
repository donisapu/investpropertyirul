@extends('layouts.app')

@php
    $rupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    $badge = [
        'processing' => ['bg-label-info', 'Diproses'],
        'succeeded' => ['bg-label-success', 'Berhasil'],
        'failed' => ['bg-label-danger', 'Gagal · transaksi dilepas'],
        'reversed' => ['bg-label-danger', 'Dibatalkan bank · transaksi dilepas'],
    ];
@endphp

@section('content')
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <div style="font-size:.75rem;font-weight:600;color:#a1acb8">Keuangan / Xendit</div>
            <h4 class="fw-bolder mb-0" style="color:#435971">Riwayat Cash-out</h4>
        </div>
        <a href="{{ route('admin.company-cashouts.create') }}" class="btn btn-sm btn-primary"><i class="bx bx-plus me-1"></i>Cash-out baru</a>
    </div>

    @foreach (['success' => 'success', 'info' => 'info', 'warning' => 'warning', 'error' => 'danger'] as $key => $class)
        @if (session($key))
            <div class="alert alert-{{ $class }} alert-dismissible" role="status">{{ session($key) }}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button></div>
        @endif
    @endforeach

    <div class="card">
        <div class="table-responsive">
            <table class="table mb-0 align-middle">
                <thead>
                    <tr style="font-size:.625rem;letter-spacing:.06em">
                        <th class="ps-4">Waktu</th><th>ID</th><th>Oleh</th><th class="text-end">Nominal</th><th>Rekening tujuan</th><th>Payout</th><th>Status</th><th class="pe-4"></th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($cashouts as $c)
                        @php [$cls, $label] = $badge[$c->status] ?? ['bg-label-secondary', $c->status]; @endphp
                        <tr @if ($open === $c->id) style="background:#f5f8f3" @endif>
                            <td class="ps-4 text-nowrap small">{{ $c->created_at->timezone(config('app.timezone'))->locale('id')->translatedFormat('j M Y H.i') }}</td>
                            <td><a href="{{ route('admin.company-cashouts.index', ['id' => $c->id]) }}" class="font-monospace small">{{ $c->external_id }}</a><div class="small text-muted">{{ $c->transaction_count }} transaksi</div></td>
                            <td class="small">{{ $c->creator?->name ?? '—' }}</td>
                            <td class="text-end fw-bold text-nowrap">{{ $rupiah($c->amount) }}</td>
                            <td class="small">{{ $c->bank_code }} · {{ substr($c->account_number, 0, 4) }} •••• {{ substr($c->account_number, -4) }}<div class="text-muted">a.n {{ $c->account_holder }}</div></td>
                            <td class="small"><span class="font-monospace">{{ $c->xendit_id ?? '—' }}</span>@if ($c->payout_status)<div class="text-muted">{{ $c->payout_status }}</div>@endif</td>
                            <td>
                                <span class="badge {{ $cls }}" style="text-transform:none">{{ $label }}</span>
                                @if ($c->failure_code)<div class="small text-danger mt-1"><span class="font-monospace">{{ $c->failure_code }}</span>@if ($c->failure_reason) · {{ $c->failure_reason }}@endif</div>@endif
                            </td>
                            <td class="pe-4 text-end">
                                @if ($c->isOpen())
                                    <form method="POST" action="{{ route('admin.company-cashouts.check-status', $c) }}" onsubmit="this.querySelector('button').disabled = true">
                                        @csrf
                                        <button class="btn btn-sm btn-outline-primary">Cek status</button>
                                    </form>
                                @endif
                            </td>
                        </tr>
                        @if ($details && $details->id === $c->id)
                            <tr>
                                <td colspan="8" class="ps-4 pe-4 pb-4" style="background:#fafbfc">
                                    <div class="small fw-bold mb-2" style="color:#435971">Transaksi dalam {{ $c->external_id }}
                                        @if ($c->balance_at_request !== null)
                                            <span class="text-muted fw-normal">· saat dikirim: saldo {{ $rupiah($c->balance_at_request) }}, Reserve {{ $rupiah($c->reserve_at_request) }}</span>
                                        @endif
                                        @if ($c->released_at)
                                            <span class="text-danger fw-normal">· dilepas {{ $c->released_at->timezone(config('app.timezone'))->locale('id')->translatedFormat('j M H.i') }}</span>
                                        @endif
                                    </div>
                                    <table class="table table-sm mb-0 small">
                                        <thead><tr><th>Xendit ID</th><th>Referensi</th><th>User</th><th class="text-end">Dihitung</th></tr></thead>
                                        <tbody>
                                            @foreach ($details->transactions as $t)
                                                <tr>
                                                    <td class="font-monospace">{{ $t->xendit_id }}</td>
                                                    <td class="font-monospace">{{ $t->reference_id }}</td>
                                                    <td>{{ $t->linkedUser()?->name ?? '—' }}</td>
                                                    <td class="text-end">{{ $rupiah($t->pivot->amount) }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        @endif
                    @empty
                        <tr><td colspan="8" class="text-center text-muted py-5">Belum ada Cash-out.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($cashouts->hasPages())
            <div class="p-3 border-top">{{ $cashouts->links('pagination::bootstrap-5') }}</div>
        @endif
    </div>
@endsection
