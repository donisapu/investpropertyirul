@extends('layouts.app')

@php
    $rupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    $initials = fn (?string $name) => collect(preg_split('/\s+/', trim((string) $name)))->filter()->take(2)->map(fn ($p) => mb_strtoupper(mb_substr($p, 0, 1)))->implode('') ?: '?';
    $statusBadge = [
        'pending' => ['bg-label-warning', 'Menunggu approve'],
        'processing' => ['bg-label-info', 'Diproses Xendit'],
        'succeeded' => ['bg-label-success', 'Berhasil'],
        'failed' => ['bg-label-danger', 'Gagal · saldo kembali'],
        'rejected' => ['bg-label-danger', 'Ditolak · saldo kembali'],
        'reversed' => ['bg-label-secondary', 'Dibatalkan bank · saldo kembali'],
    ];
    $tabLabels = ['pending' => 'Menunggu', 'processing' => 'Diproses', 'done' => 'Selesai', 'failed' => 'Gagal', 'all' => 'Semua'];
    $keep = array_filter(['q' => $filters['q'] ?? null, 'from' => $filters['from'] ?? null, 'to' => $filters['to'] ?? null]);
    $queueUrl = fn (array $extra = []) => route('admin.user-withdrawals', array_filter([...$keep, 'tab' => $tab, 'sort' => $sort, ...$extra], fn ($v) => $v !== null && $v !== ''));
@endphp

@section('content')
    <style>
        .wd-eyebrow { font-size: .75rem; font-weight: 600; color: #a1acb8; }
        .wd-stat-label { font-size: .6875rem; font-weight: 600; color: #697a8d; }
        .wd-stat-value { font-size: .875rem; font-weight: 800; color: #435971; }
        .wd-tabs .nav-link { font-size: .8125rem; font-weight: 600; color: #697a8d; padding: .75rem .9rem; border-bottom: 2px solid transparent; border-radius: 0; }
        .wd-tabs .nav-link.active { color: #435971; font-weight: 800; border-bottom-color: #435971; background: none; }
        .wd-count { font-size: .625rem; font-weight: 800; border-radius: 1rem; padding: .05rem .4rem; background: #ebeef0; color: #697a8d; }
        .wd-tabs .nav-link.active .wd-count { background: #435971; color: #f5f5f9; }
        .wd-item { display: flex; align-items: center; gap: .75rem; padding: .75rem 1.25rem; border-top: 1px solid #e4e7eb; color: inherit; }
        .wd-item:hover { background: #fafbfc; color: inherit; }
        .wd-item.active { background: #f5f6f8; box-shadow: inset 3px 0 0 #71a35f; }
        .wd-avatar { width: 2rem; height: 2rem; border-radius: 50%; background: #ebeef0; color: #435971; font-size: .6875rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .wd-item.active .wd-avatar, .wd-avatar-lg { background: #435971; color: #71a35f; }
        .wd-avatar-lg { width: 2.75rem; height: 2.75rem; font-size: .875rem; }
        .wd-name { font-size: .8125rem; font-weight: 700; color: #435971; }
        .wd-sub { font-size: .6875rem; font-weight: 500; color: #697a8d; }
        .wd-amount { font-size: .8125rem; font-weight: 800; color: #435971; }
        .wd-age { font-size: .6875rem; font-weight: 600; color: #a1acb8; }
        .wd-age.late { color: #8a5a12; }
        .wd-big { font-size: 2.125rem; font-weight: 800; color: #435971; line-height: 1.1; }
        .wd-muted { font-size: .75rem; font-weight: 600; color: #697a8d; }
        .wd-caption { font-size: .625rem; font-weight: 700; letter-spacing: .06em; color: #a1acb8; text-transform: uppercase; }
        .wd-compare { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #e4e7eb; border-radius: .375rem; overflow: hidden; }
        .wd-compare.mismatch { border-color: #8a5a12; }
        .wd-compare > div { padding: .75rem 1rem; }
        .wd-compare > div + div { background: #f5f6f8; border-left: 1px solid #e4e7eb; }
        .wd-compare .wd-person { font-size: 1rem; font-weight: 800; color: #435971; }
        .wd-compare.mismatch .wd-holder { color: #8a5a12; }
        .wd-pill { display: inline-flex; align-items: center; gap: .35rem; font-size: .6875rem; font-weight: 700; border-radius: 1rem; padding: .15rem .6rem; }
        .wd-pill-ok { background: #e3ede5; color: #2f6b4f; }
        .wd-pill-warn { background: #f5ead3; color: #8a5a12; }
        .wd-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; }
        .wd-step { position: relative; padding-top: 1.1rem; }
        .wd-step::before { content: ""; position: absolute; top: .3rem; left: 0; right: 0; height: 2px; background: #e4e7eb; }
        .wd-step::after { content: ""; position: absolute; top: 0; left: 0; width: .65rem; height: .65rem; border-radius: 50%; background: #fff; border: 2px solid #d9dee3; }
        .wd-step.done::before, .wd-step.done::after { background: #71a35f; border-color: #71a35f; }
        .wd-step.current::after { border-color: #71a35f; }
        .wd-step.failed::after { background: #9b3b2e; border-color: #9b3b2e; }
        .wd-step-label { font-size: .75rem; font-weight: 700; color: #435971; }
        .wd-step.todo .wd-step-label { color: #a1acb8; }
        .wd-step-note { font-size: .6875rem; color: #697a8d; }
        .wd-step.current .wd-step-note { color: #5b8a4b; font-weight: 600; }
        .wd-step.failed .wd-step-note { color: #9b3b2e; }
        .wd-reject { background: #f4e1dc; border-radius: .375rem; padding: 1rem; }
        .wd-reject textarea, .wd-reject textarea:focus { border-color: #9b3b2e; box-shadow: none; }
        .wd-chip { font-size: .6875rem; font-weight: 700; color: #697a8d; background: #fff; border: 1px solid #e4e7eb; border-radius: 1rem; padding: .15rem .65rem; }
        .wd-chip:hover { border-color: #697a8d; }
        .wd-badge { text-transform: none; font-size: .6875rem; font-weight: 700; }
        .wd-actions { background: #f5f6f8; border-top: 1px solid #e4e7eb; }
        .wd-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .75rem; }
        @media (max-width: 575.98px) { .wd-steps { grid-template-columns: 1fr 1fr; row-gap: 1rem; } .wd-compare { grid-template-columns: 1fr; } .wd-compare > div + div { border-left: 0; border-top: 1px solid #e4e7eb; } }
    </style>

    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <div class="wd-eyebrow">Keuangan</div>
            <h4 class="fw-bolder mb-0" style="color:#435971">Withdrawals</h4>
        </div>
        <div class="d-flex flex-wrap gap-4">
            @foreach ([['Menunggu', $stats['pending']], ['Diproses', $stats['processing']], ['Berhasil bulan ini', $stats['succeeded_month']]] as [$label, [$count, $sum]])
                <div class="text-end">
                    <div class="wd-stat-label">{{ $label }}</div>
                    <div class="wd-stat-value">{{ $count }} · {{ $rupiah($sum) }}</div>
                </div>
            @endforeach
        </div>
    </div>

    @foreach (['success' => 'success', 'info' => 'info', 'warning' => 'warning', 'error' => 'danger'] as $key => $class)
        @if (session($key))
            <div class="alert alert-{{ $class }} alert-dismissible" role="{{ $key === 'error' ? 'alert' : 'status' }}">
                {{ session($key) }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button>
            </div>
        @endif
    @endforeach

    <div class="row g-4">
        {{-- Queue --}}
        <div class="col-lg-5">
            <div class="card h-100">
                <ul class="nav wd-tabs border-bottom px-2" role="tablist">
                    @foreach ($tabLabels as $key => $label)
                        <li class="nav-item">
                            <a class="nav-link {{ $tab === $key ? 'active' : '' }}" href="{{ route('admin.user-withdrawals', array_filter([...$keep, 'tab' => $key])) }}"
                                @if ($tab === $key) aria-current="page" @endif>
                                {{ $label }}
                                @if ($key !== 'all' && $tabs[$key] > 0)
                                    <span class="wd-count ms-1">{{ $tabs[$key] }}</span>
                                @endif
                            </a>
                        </li>
                    @endforeach
                </ul>

                <form method="GET" action="{{ route('admin.user-withdrawals') }}" class="p-3 d-flex flex-wrap gap-2">
                    <input type="hidden" name="tab" value="{{ $tab }}">
                    <input type="search" name="q" value="{{ $filters['q'] ?? '' }}" class="form-control form-control-sm flex-grow-1" style="min-width:10rem"
                        placeholder="Cari user atau ID" aria-label="Cari user atau ID">
                    <select name="sort" class="form-select form-select-sm" style="width:auto" aria-label="Urutkan" onchange="this.form.submit()">
                        <option value="oldest" @selected($sort === 'oldest')>Terlama</option>
                        <option value="newest" @selected($sort === 'newest')>Terbaru</option>
                    </select>
                    <div class="d-flex gap-2 w-100 align-items-center">
                        <input type="date" name="from" value="{{ $filters['from'] ?? '' }}" class="form-control form-control-sm" aria-label="Dari tanggal">
                        <span class="wd-sub">s/d</span>
                        <input type="date" name="to" value="{{ $filters['to'] ?? '' }}" class="form-control form-control-sm" aria-label="Sampai tanggal">
                        <button class="btn btn-sm btn-outline-secondary">Filter</button>
                        @if ($keep)
                            <a href="{{ route('admin.user-withdrawals', ['tab' => $tab]) }}" class="btn btn-sm btn-text-secondary">Reset</a>
                        @endif
                    </div>
                    @if ($errors->has('to') || $errors->has('from'))
                        <small class="text-danger w-100">{{ $errors->first('to') ?: $errors->first('from') }}</small>
                    @endif
                </form>

                <div>
                    @forelse ($queue as $row)
                        @php
                            $waitHours = $row->created_at->diffInHours(now());
                            $bankName = $row->bankAccount?->bank_short_name ?? '-';
                        @endphp
                        <a href="{{ $queueUrl(['id' => $row->id, 'page' => $queue->currentPage() > 1 ? $queue->currentPage() : null]) }}"
                            class="wd-item {{ $selected?->id === $row->id ? 'active' : '' }}" @if ($selected?->id === $row->id) aria-current="true" @endif>
                            <span class="wd-avatar" aria-hidden="true">{{ $initials($row->user?->name) }}</span>
                            <span class="flex-grow-1 text-truncate">
                                <span class="wd-name d-block text-truncate">{{ $row->user?->name ?? 'User dihapus' }}</span>
                                <span class="wd-sub d-block text-truncate">{{ $bankName }} · a.n {{ $row->bankAccount?->account_holder_name ?? '-' }}</span>
                            </span>
                            <span class="text-end flex-shrink-0">
                                <span class="wd-amount d-block">{{ $rupiah($row->amount) }}</span>
                                @if ($row->status === 'pending')
                                    <span class="wd-age {{ $waitHours >= 24 ? 'late' : '' }}">{{ $row->created_at->locale('id')->diffForHumans(null, \Carbon\CarbonInterface::DIFF_ABSOLUTE) }}</span>
                                @else
                                    <span class="badge wd-badge {{ $statusBadge[$row->status][0] ?? 'bg-label-secondary' }}" style="font-size:.625rem">{{ $statusBadge[$row->status][1] ?? $row->status }}</span>
                                @endif
                            </span>
                        </a>
                    @empty
                        <p class="text-center wd-sub py-5 border-top mb-0">Tidak ada penarikan untuk filter ini.</p>
                    @endforelse
                </div>

                @if ($queue->hasPages())
                    <div class="p-3 border-top">{{ $queue->onEachSide(1)->links('pagination::bootstrap-5') }}</div>
                @endif
            </div>
        </div>

        {{-- Detail --}}
        <div class="col-lg-7">
            @if ($selected)
                @php
                    $w = $selected;
                    $acc = $w->bankAccount;
                    [$badgeClass, $badgeText] = $statusBadge[$w->status] ?? ['bg-label-secondary', $w->status];
                @endphp
                <div class="card h-100 d-flex flex-column">
                    <div class="d-flex flex-wrap align-items-center gap-3 p-4 border-bottom">
                        <span class="wd-avatar wd-avatar-lg" aria-hidden="true">{{ $initials($w->user?->name) }}</span>
                        <div class="flex-grow-1" style="min-width:0">
                            <div class="fw-bolder text-truncate" style="font-size:1.125rem;color:#435971">{{ $w->user?->name ?? 'User dihapus' }}</div>
                            <div class="wd-muted text-truncate fw-medium">{{ $w->user?->email }} · <span class="wd-mono">{{ $w->external_id }}</span></div>
                        </div>
                        <div class="text-end">
                            <span class="badge wd-badge {{ $badgeClass }}">{{ $badgeText }}</span>
                            <div class="wd-age mt-1">Diajukan {{ $w->created_at->locale('id')->translatedFormat('j M, H.i') }} · {{ $w->created_at->locale('id')->diffForHumans() }}</div>
                        </div>
                    </div>

                    <div class="p-4 d-flex flex-column gap-4 flex-grow-1">
                        <div class="d-flex flex-wrap justify-content-between gap-3">
                            <div>
                                <div class="wd-muted">Dikirim ke rekening user</div>
                                <div class="wd-big">{{ $rupiah($w->amount) }}</div>
                            </div>
                            <dl class="mb-0" style="min-width:15rem">
                                @foreach ([['Nominal', $w->amount, false], ['Admin fee', $w->fee, false], ['Dipotong dari wallet', $w->totalDeduction(), true]] as [$label, $value, $strong])
                                    <div class="d-flex justify-content-between gap-3 {{ $strong ? 'border-top pt-1 mt-1' : '' }}">
                                        <dt class="wd-muted mb-0">{{ $label }}</dt>
                                        <dd class="mb-0" style="font-size:.75rem;color:#435971;font-weight:{{ $strong ? 800 : 600 }}">{{ $rupiah($value) }}</dd>
                                    </div>
                                @endforeach
                            </dl>
                        </div>

                        <section aria-labelledby="wd-check">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 id="wd-check" class="mb-0 fw-bolder" style="color:#435971">Cek rekening tujuan</h6>
                                @if ($detail['name_matches'])
                                    <span class="wd-pill wd-pill-ok"><i class="bx bx-check"></i> Nama cocok</span>
                                @else
                                    <span class="wd-pill wd-pill-warn"><i class="bx bx-error"></i> Nama berbeda</span>
                                @endif
                            </div>
                            <div class="wd-compare {{ $detail['name_matches'] ? '' : 'mismatch' }}">
                                <div>
                                    <div class="wd-caption">Nama akun user</div>
                                    <div class="wd-person">{{ $w->user?->name ?? '-' }}</div>
                                    <div class="wd-sub">Terdaftar sejak {{ $w->user?->created_at?->locale('id')->translatedFormat('M Y') }}</div>
                                </div>
                                <div>
                                    <div class="wd-caption">Nama di rekening</div>
                                    <div class="wd-person wd-holder">{{ $acc?->account_holder_name ?? '-' }}</div>
                                    <div class="wd-sub">{{ $acc?->bank_short_name }} · <span class="wd-mono">{{ $acc ? trim(chunk_split($acc->account_number, 4, ' ')) : '-' }}</span></div>
                                </div>
                            </div>
                            <p class="wd-age mb-0 mt-2 fw-medium">Xendit tidak mengecek nama secara otomatis. Nama salah membuat payout gagal dan saldo kembali ke user.</p>
                        </section>

                        <div class="d-flex flex-wrap gap-4 border-top pt-3">
                            <div>
                                <div class="wd-stat-label">Saldo wallet {{ $w->status === 'pending' ? 'setelah ini' : 'sekarang' }}</div>
                                <div class="wd-stat-value">{{ $rupiah($detail['wallet_balance']) }}</div>
                            </div>
                            <div>
                                <div class="wd-stat-label">Withdraw sebelumnya</div>
                                <div class="wd-stat-value">{{ $detail['previous_succeeded'] }} berhasil · {{ $detail['previous_failed'] }} gagal</div>
                            </div>
                            @if ($detail['bank_limits'])
                                <div>
                                    <div class="wd-stat-label">Batas bank {{ $acc?->bank_short_name }}</div>
                                    <div class="wd-stat-value">{{ $detail['bank_limits']['max'] ? $rupiah($detail['bank_limits']['min']) . ' – ' . $rupiah($detail['bank_limits']['max']) : 'Min ' . $rupiah($detail['bank_limits']['min']) }}</div>
                                </div>
                            @endif
                        </div>

                        <ol class="wd-steps list-unstyled mb-0" aria-label="Tahapan">
                            @foreach ($detail['steps'] as $step)
                                <li class="wd-step {{ $step['state'] }}">
                                    <div class="wd-step-label">{{ $step['label'] }}</div>
                                    @if ($step['note'])
                                        <div class="wd-step-note">{{ $step['note'] }}</div>
                                    @endif
                                </li>
                            @endforeach
                        </ol>

                        @if ($w->xendit_id || $w->failure_code || $w->failure_reason)
                            <dl class="row mb-0 small border rounded p-3 mx-0">
                                @if ($w->xendit_id)
                                    <dt class="col-sm-4 wd-muted">Xendit payout ID</dt><dd class="col-sm-8 wd-mono mb-1">{{ $w->xendit_id }}</dd>
                                @endif
                                @if ($w->payout_status)
                                    <dt class="col-sm-4 wd-muted">Status payout</dt><dd class="col-sm-8 mb-1">{{ $w->payout_status }}</dd>
                                @endif
                                @if ($w->failure_code)
                                    <dt class="col-sm-4 wd-muted">Failure code</dt><dd class="col-sm-8 mb-1"><span class="wd-mono">{{ $w->failure_code }}</span>@if ($detail['failure_text']) · {{ $detail['failure_text'] }}@endif</dd>
                                @endif
                                @if ($w->failure_reason)
                                    <dt class="col-sm-4 wd-muted">Alasan</dt><dd class="col-sm-8 mb-1">{{ $w->failure_reason }}</dd>
                                @endif
                                @if ($w->approvedBy)
                                    <dt class="col-sm-4 wd-muted">Diputuskan oleh</dt><dd class="col-sm-8 mb-0">{{ $w->approvedBy->name }}</dd>
                                @endif
                            </dl>
                        @endif

                        @if ($w->status === 'pending')
                            <form id="wd-reject-form" method="POST" action="{{ route('admin.user-withdrawals.reject', $w) }}"
                                class="wd-reject {{ $errors->has('failure_reason') ? '' : 'd-none' }}" data-guard>
                                @csrf
                                @foreach (array_filter(['tab' => $tab, 'q' => $filters['q'] ?? null, 'from' => $filters['from'] ?? null, 'to' => $filters['to'] ?? null, 'sort' => $sort]) as $k => $v)
                                    <input type="hidden" name="{{ $k }}" value="{{ $v }}">
                                @endforeach
                                <label for="failure_reason" class="fw-bolder mb-2" style="font-size:.75rem;color:#9b3b2e">Alasan penolakan</label>
                                <textarea id="failure_reason" name="failure_reason" rows="3" maxlength="255" required
                                    class="form-control @error('failure_reason') is-invalid @enderror"
                                    placeholder="Tulis alasan yang akan dibaca user">{{ old('failure_reason') }}</textarea>
                                @error('failure_reason')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                                <div class="d-flex flex-wrap gap-2 mt-2" aria-label="Alasan cepat">
                                    @foreach ([
                                        'Nama tidak cocok' => 'Nama rekening (' . ($acc?->account_holder_name ?? '-') . ') tidak sama dengan nama akun. Gunakan rekening atas nama sendiri.',
                                        'Rekening tidak valid' => 'Nomor rekening tidak valid. Periksa kembali nomor dan bank tujuan.',
                                        'Aktivitas mencurigakan' => 'Penarikan ditahan karena aktivitas tidak biasa. Hubungi admin untuk verifikasi.',
                                    ] as $chip => $text)
                                        <button type="button" class="wd-chip" data-reason="{{ $text }}">{{ $chip }}</button>
                                    @endforeach
                                </div>
                            </form>
                        @endif
                    </div>

                    @if ($w->status === 'pending' || $detail['can_resend'] || $detail['can_check'])
                        <div class="wd-actions d-flex flex-wrap align-items-center gap-2 p-3 px-4">
                            <span id="wd-action-note" class="wd-muted me-auto {{ $detail['stuck'] ? 'text-warning' : '' }}">
                                @if ($w->status === 'pending')
                                    Approve langsung mengirim uang lewat Xendit.
                                @elseif ($detail['stuck'])
                                    Diproses lebih dari 24 jam. Cek status ke Xendit.
                                @elseif ($detail['can_resend'])
                                    Hasil kirim belum pasti. Cek status dulu; kirim ulang aman (Xendit tidak membayar dua kali).
                                @else
                                    Status akhir datang lewat webhook. Bisa dicek manual ke Xendit.
                                @endif
                            </span>
                            @if ($w->status === 'pending')
                                <button type="button" id="wd-reject-toggle" class="btn btn-sm btn-outline-danger bg-white" aria-controls="wd-reject-form"
                                    aria-expanded="{{ $errors->has('failure_reason') ? 'true' : 'false' }}">Tolak</button>
                                <button type="submit" form="wd-reject-form" id="wd-reject-submit" class="btn btn-sm btn-danger {{ $errors->has('failure_reason') ? '' : 'd-none' }}">
                                    Tolak &amp; kembalikan saldo
                                </button>
                                <form method="POST" action="{{ route('admin.user-withdrawals.approve', $w) }}" id="wd-approve-form" data-guard
                                    data-confirm-dialog="#wd-approve-dialog">
                                    @csrf
                                    @foreach (array_filter(['tab' => $tab, 'q' => $filters['q'] ?? null, 'from' => $filters['from'] ?? null, 'to' => $filters['to'] ?? null, 'sort' => $sort]) as $k => $v)
                                        <input type="hidden" name="{{ $k }}" value="{{ $v }}">
                                    @endforeach
                                    <button class="btn btn-sm btn-primary">Approve &amp; kirim {{ $rupiah($w->amount) }}</button>
                                </form>
                            @else
                                @if ($detail['can_check'])
                                    <form method="POST" action="{{ route('admin.user-withdrawals.check-status', $w) }}" data-guard>
                                        @csrf
                                        <input type="hidden" name="tab" value="{{ $tab }}">
                                        <button class="btn btn-sm btn-outline-primary bg-white">Cek status ke Xendit</button>
                                    </form>
                                @endif
                                @if ($detail['can_resend'])
                                <form method="POST" action="{{ route('admin.user-withdrawals.resend', $w) }}" data-guard
                                    data-confirm-dialog="#wd-resend-dialog">
                                    @csrf
                                    <input type="hidden" name="tab" value="{{ $tab }}">
                                    <button class="btn btn-sm btn-primary">Kirim ulang ke Xendit</button>
                                </form>
                                @endif
                            @endif
                        </div>

                        @php $holderLine = trim(($acc?->bank_short_name ?? '-') . ' · ' . ($acc ? trim(chunk_split($acc->account_number, 4, ' ')) : '-')); @endphp
                        @if ($w->status === 'pending')
                            <x-admin.confirm-dialog id="wd-approve-dialog"
                                :title="'Kirim ' . $rupiah($w->amount) . '?'"
                                :subtitle="'Penarikan dana ' . ($w->user?->name ?? 'user')"
                                :confirm-label="'Kirim ' . $rupiah($w->amount)">
                                <div class="cd-dest">
                                    <span class="cd-bank">{{ $acc ? mb_substr(\Illuminate\Support\Str::after($acc->bank_code, 'ID_'), 0, 7) : '?' }}</span>
                                    <div class="min-w-0">
                                        <div class="cd-dest-name text-truncate">{{ $acc?->account_holder_name ?? '-' }}</div>
                                        <div class="cd-dest-meta">{{ $acc?->bank_short_name ?? '-' }} · <span class="cd-mono">{{ $acc ? trim(chunk_split($acc->account_number, 4, ' ')) : '-' }}</span></div>
                                    </div>
                                </div>
                                <dl class="cd-rows">
                                    <div class="cd-row is-total"><dt>Masuk ke rekening</dt><dd>{{ $rupiah($w->amount) }}</dd></div>
                                    <div class="cd-row"><dt>Biaya admin</dt><dd>{{ $rupiah($w->fee) }}<small>sudah dipotong dari wallet user</small></dd></div>
                                    <div class="cd-row">
                                        <dt>Nama akun user</dt>
                                        <dd>{{ $w->user?->name ?? '-' }}
                                            @if ($detail['name_matches'])
                                                <span class="cd-pill cd-pill-ok"><i class="bx bx-check"></i> cocok</span>
                                            @else
                                                <span class="cd-pill cd-pill-warn"><i class="bx bx-error"></i> berbeda</span>
                                            @endif
                                        </dd>
                                    </div>
                                </dl>
                                @if ($detail['name_matches'])
                                    <p class="cd-note"><i class="bx bx-info-circle" aria-hidden="true"></i><span>Uang langsung dikirim lewat Xendit dan tidak bisa dibatalkan. Kalau bank menolak, {{ $rupiah($w->totalDeduction()) }} kembali otomatis ke wallet user.</span></p>
                                @else
                                    <p class="cd-note is-warn"><i class="bx bx-error" aria-hidden="true"></i><span>Nama di rekening tidak sama dengan nama akun. Bank bisa menolak transfer, atau uang masuk ke orang lain. Kalau ragu, tolak dan minta user memakai rekening atas nama sendiri.</span></p>
                                    <x-slot:ack>Saya sudah memastikan rekening a.n {{ $acc?->account_holder_name ?? '-' }} milik {{ $w->user?->name ?? 'user ini' }}.</x-slot:ack>
                                @endif
                            </x-admin.confirm-dialog>
                        @endif

                        @if ($detail['can_resend'])
                            <x-admin.confirm-dialog id="wd-resend-dialog"
                                title="Kirim ulang ke Xendit?"
                                :subtitle="$rupiah($w->amount) . ' ke ' . ($acc?->account_holder_name ?? '-')"
                                confirm-label="Kirim ulang">
                                <dl class="cd-rows">
                                    <div class="cd-row"><dt>Referensi</dt><dd class="cd-mono">{{ $w->external_id }}</dd></div>
                                    <div class="cd-row"><dt>Rekening</dt><dd>{{ $holderLine }}</dd></div>
                                </dl>
                                <p class="cd-note"><i class="bx bx-shield-quarter" aria-hidden="true"></i><span>Aman diulang: Xendit memakai referensi yang sama, jadi uang tidak akan terkirim dua kali. Kalau belum, cek status ke Xendit dulu.</span></p>
                            </x-admin.confirm-dialog>
                        @endif
                    @endif
                </div>
            @else
                <div class="card h-100">
                    <div class="card-body d-flex align-items-center justify-content-center text-center wd-sub py-5">
                        Pilih penarikan di sebelah kiri untuk melihat detail.
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        (function () {
            // One submit only (double click / impatient admin). Money actions confirm first in x-admin.confirm-dialog.
            document.querySelectorAll('form[data-guard]').forEach(function (form) {
                form.addEventListener('submit', function (e) {
                    if (form.dataset.sent) {
                        e.preventDefault();
                        return;
                    }
                    form.dataset.sent = '1';
                    document.querySelectorAll('button[type=submit], form[data-guard] button:not([type=button])').forEach(function (b) { b.disabled = true; });
                });
            });

            var toggle = document.getElementById('wd-reject-toggle');
            var rejectForm = document.getElementById('wd-reject-form');
            var rejectSubmit = document.getElementById('wd-reject-submit');
            var approveForm = document.getElementById('wd-approve-form');
            var note = document.getElementById('wd-action-note');
            if (!toggle || !rejectForm) return;

            function setRejecting(on) {
                rejectForm.classList.toggle('d-none', !on);
                rejectSubmit.classList.toggle('d-none', !on);
                approveForm.classList.toggle('d-none', on);
                toggle.textContent = on ? 'Batal' : 'Tolak';
                toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
                note.textContent = on
                    ? 'Alasan wajib diisi. Saldo {{ $selected ? $rupiah($selected->totalDeduction()) : '' }} kembali ke wallet user.'
                    : 'Approve langsung mengirim uang lewat Xendit.';
                if (on) document.getElementById('failure_reason').focus();
            }

            if (!rejectForm.classList.contains('d-none')) setRejecting(true);
            toggle.addEventListener('click', function () { setRejecting(rejectForm.classList.contains('d-none')); });

            rejectForm.querySelectorAll('[data-reason]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    var area = document.getElementById('failure_reason');
                    area.value = chip.dataset.reason;
                    area.focus();
                });
            });
        })();
    </script>
@endpush
