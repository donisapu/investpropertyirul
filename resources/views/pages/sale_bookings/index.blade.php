@extends('layouts.app')

@php
    use App\Models\SaleBooking;

    $rupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    $percent = fn ($v) => rtrim(rtrim(number_format((float) $v, 2, ',', '.'), '0'), ',') . '%';
    $when = fn ($t) => $t?->locale('id')->translatedFormat('j M Y, H.i');
    $statusBadge = [
        SaleBooking::PENDING => ['bg-label-info', 'Menunggu bayar'],
        SaleBooking::PAID => ['bg-label-success', 'Dibooking'],
        SaleBooking::CONFLICT => ['bg-label-warning', 'Bayar ganda'],
        SaleBooking::COMPLETED => ['bg-label-secondary', 'Terjual'],
        SaleBooking::EXPIRED => ['bg-label-secondary', 'Kedaluwarsa'],
        SaleBooking::CANCELLED => ['bg-label-danger', 'Dibatalkan'],
    ];
    $keep = array_filter(['q' => $filters['q'] ?? null]);
    $queueUrl = fn (array $extra = []) => route('admin.bookings.index', array_filter([...$keep, 'tab' => $tab, ...$extra], fn ($v) => $v !== null && $v !== ''));
@endphp

@section('content')
    <style>
        .bk-eyebrow { font-size: .75rem; font-weight: 600; color: #a1acb8; }
        .bk-stat-label { font-size: .6875rem; font-weight: 600; color: #697a8d; }
        .bk-stat-value { font-size: .875rem; font-weight: 800; color: #435971; }
        .bk-tabs .nav-link { font-size: .8125rem; font-weight: 600; color: #697a8d; padding: .75rem .6rem; border-bottom: 2px solid transparent; border-radius: 0; }
        .bk-tabs .nav-link.active { color: #435971; font-weight: 800; border-bottom-color: #435971; background: none; }
        .bk-count { font-size: .625rem; font-weight: 800; border-radius: 1rem; padding: .05rem .4rem; background: #ebeef0; color: #697a8d; }
        .bk-tabs .nav-link.active .bk-count { background: #435971; color: #f5f5f9; }
        .bk-count.warn { background: #f5ead3; color: #8a5a12; }
        .bk-item { display: flex; align-items: center; gap: .75rem; padding: .75rem 1.25rem; border-top: 1px solid #e4e7eb; color: inherit; }
        .bk-item:hover { background: #fafbfc; color: inherit; }
        .bk-item.active { background: #f5f6f8; box-shadow: inset 3px 0 0 #71a35f; }
        .bk-name { font-size: .8125rem; font-weight: 700; color: #435971; }
        .bk-sub { font-size: .6875rem; font-weight: 500; color: #697a8d; }
        .bk-amount { font-size: .8125rem; font-weight: 800; color: #435971; }
        .bk-age { font-size: .6875rem; font-weight: 600; color: #a1acb8; }
        .bk-age.late { color: #8a5a12; }
        .bk-big { font-size: 2rem; font-weight: 800; color: #435971; line-height: 1.1; }
        .bk-muted { font-size: .75rem; font-weight: 600; color: #697a8d; }
        .bk-caption { font-size: .625rem; font-weight: 700; letter-spacing: .06em; color: #a1acb8; text-transform: uppercase; }
        .bk-kv { display: grid; grid-template-columns: auto 1fr; gap: .3rem 1rem; font-size: .8125rem; margin: 0; }
        .bk-kv dt { color: #697a8d; font-weight: 500; }
        .bk-kv dd { color: #435971; font-weight: 700; text-align: right; margin: 0; }
        .bk-badge { text-transform: none; font-size: .6875rem; font-weight: 700; }
        .bk-actions { background: #f5f6f8; border-top: 1px solid #e4e7eb; }
        .bk-warn { background: #f5ead3; color: #8a5a12; border-radius: .375rem; padding: .75rem 1rem; font-size: .8125rem; }
        .bk-ok { background: #e3ede5; color: #2f6b4f; border-radius: .375rem; padding: .75rem 1rem; font-size: .8125rem; }
        .bk-danger { background: #f4e1dc; border-radius: .375rem; padding: 1rem; }
        .bk-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .75rem; }
    </style>

    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <div class="bk-eyebrow">Penjualan</div>
            <h4 class="fw-bolder mb-0" style="color:#435971">Bookings</h4>
            <div class="bk-muted fw-medium">Booking fee yang dibayar pembeli lewat Xendit. Satu properti hanya bisa dibooking satu pembeli.</div>
        </div>
        <div class="d-flex flex-wrap gap-4">
            <div class="text-end"><div class="bk-stat-label">Booking fee dipegang</div><div class="bk-stat-value">{{ $rupiah($heldTotal) }}</div></div>
            <div class="text-end"><div class="bk-stat-label">Menunggu bayar</div><div class="bk-stat-value">{{ $tabs['pending']['count'] }}</div></div>
            <div class="text-end"><div class="bk-stat-label">Perlu tindakan</div><div class="bk-stat-value" style="color:#8a5a12">{{ $tabs['conflict']['count'] }}</div></div>
        </div>
    </div>

    @if (session('success'))
        <div class="alert alert-success alert-dismissible" role="status">{{ session('success') }}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button></div>
    @endif
    @if ($errors->has('booking'))
        <div class="alert alert-danger" role="alert">{{ $errors->first('booking') }}</div>
    @endif

    <div class="row g-4">
        {{-- Queue --}}
        <div class="col-lg-5">
            <div class="card h-100">
                <ul class="nav bk-tabs border-bottom px-2 flex-wrap">
                    @foreach ($tabs as $key => $t)
                        <li class="nav-item">
                            <a class="nav-link {{ $tab === $key ? 'active' : '' }}" href="{{ route('admin.bookings.index', array_filter([...$keep, 'tab' => $key])) }}" @if ($tab === $key) aria-current="page" @endif>
                                {{ $t['label'] }}
                                @if ($t['count'] > 0)
                                    <span class="bk-count ms-1 {{ $key === 'conflict' ? 'warn' : '' }}">{{ $t['count'] }}</span>
                                @endif
                            </a>
                        </li>
                    @endforeach
                </ul>

                <form method="GET" action="{{ route('admin.bookings.index') }}" class="p-3 d-flex gap-2">
                    <input type="hidden" name="tab" value="{{ $tab }}">
                    <input type="search" name="q" value="{{ $filters['q'] ?? '' }}" class="form-control form-control-sm" placeholder="Cari properti, pembeli, atau kode booking" aria-label="Cari booking">
                    <button class="btn btn-sm btn-outline-secondary">Cari</button>
                </form>

                <div>
                    @forelse ($queue as $row)
                        <a href="{{ $queueUrl(['id' => $row->id, 'page' => $queue->currentPage() > 1 ? $queue->currentPage() : null]) }}"
                            class="bk-item {{ $selected?->id === $row->id ? 'active' : '' }}" @if ($selected?->id === $row->id) aria-current="true" @endif>
                            <span class="flex-grow-1 text-truncate">
                                <span class="bk-name d-block text-truncate">{{ $row->property?->property_name ?? 'Properti dihapus' }}</span>
                                <span class="bk-sub d-block text-truncate">{{ $row->user?->name ?? 'User dihapus' }} · {{ $row->payment?->external_id }}</span>
                            </span>
                            <span class="text-end flex-shrink-0">
                                <span class="bk-amount d-block">{{ $rupiah($row->amount) }}</span>
                                @if ($row->status === SaleBooking::PENDING)
                                    <span class="bk-age">s/d {{ $row->expires_at?->locale('id')->translatedFormat('j M, H.i') }}</span>
                                @elseif ($row->status === SaleBooking::PAID)
                                    <span class="bk-age {{ $row->paid_at?->lt(now()->subDays(14)) ? 'late' : '' }}">dibayar {{ $row->paid_at?->locale('id')->diffForHumans() }}</span>
                                @else
                                    <span class="badge bk-badge {{ $statusBadge[$row->status][0] }}" style="font-size:.625rem">{{ $statusBadge[$row->status][1] }}</span>
                                @endif
                            </span>
                        </a>
                    @empty
                        <p class="text-center bk-sub py-5 border-top mb-0">Tidak ada booking di tab ini.</p>
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
                    $b = $selected;
                    [$badgeClass, $badgeText] = $statusBadge[$b->status];
                @endphp
                <div class="card h-100 d-flex flex-column">
                    <div class="d-flex flex-wrap align-items-start justify-content-between gap-3 p-4 border-bottom">
                        <div style="min-width:0">
                            <div class="bk-caption bk-mono">{{ $b->payment?->external_id }}</div>
                            <div class="fw-bolder text-truncate" style="font-size:1.125rem;color:#435971">{{ $b->property?->property_name ?? 'Properti dihapus' }}</div>
                            <div class="bk-muted fw-medium">Harga {{ $rupiah($b->price) }} · booking fee {{ $percent($b->fee_percent) }}</div>
                        </div>
                        <span class="badge bk-badge {{ $badgeClass }}">{{ $badgeText }}</span>
                    </div>

                    <div class="p-4 d-flex flex-column gap-4 flex-grow-1">
                        <div>
                            <div class="bk-muted">{{ $b->paid_at ? 'Booking fee diterima' : 'Tagihan booking fee' }}</div>
                            <div class="bk-big">{{ $rupiah($b->amount) }}</div>
                            <div class="bk-sub mt-1">
                                @if ($b->paid_at)
                                    Dibayar {{ $when($b->paid_at) }} via Xendit
                                @elseif ($b->status === SaleBooking::PENDING)
                                    Kedaluwarsa {{ $when($b->expires_at) }}. Selama menunggu, properti dikunci sementara untuk pembeli ini.
                                @endif
                            </div>
                        </div>

                        @if ($b->status === SaleBooking::CONFLICT)
                            <div class="bk-warn">
                                <b>Pembayaran masuk saat properti sudah dipegang pembeli lain</b> (atau sudah tidak aktif). Kembalikan booking fee ke saldo Wallet pembeli ini; ia bisa menariknya ke rekening.
                            </div>
                        @elseif ($b->status === SaleBooking::COMPLETED)
                            <div class="bk-ok"><b>Ditandai terjual</b> {{ $when($b->completed_at) }}. Listing berstatus <i>sold</i> dan tidak tampil lagi di daftar properti dijual.</div>
                        @elseif ($b->status === SaleBooking::CANCELLED)
                            <div class="bk-danger">
                                <b class="text-danger">Dibatalkan {{ $when($b->cancelled_at) }}</b> ·
                                booking fee {{ $b->fee_outcome === SaleBooking::FEE_REFUNDED ? 'dikembalikan ke saldo Wallet' : ($b->fee_outcome === SaleBooking::FEE_FORFEITED ? 'hangus' : '-') }}
                                <div class="bk-sub mt-1">Alasan: {{ $b->cancel_reason }}</div>
                            </div>
                        @elseif ($b->status === SaleBooking::EXPIRED)
                            <div class="bk-sub">Invoice tidak dibayar sampai batas waktu. Tidak ada dana masuk, tidak perlu tindakan.</div>
                        @endif

                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="bk-caption mb-2">Pembeli</div>
                                <dl class="bk-kv">
                                    <dt>Nama</dt><dd>{{ $b->user?->name ?? '-' }}</dd>
                                    <dt>Email</dt><dd class="text-truncate">{{ $b->user?->email ?? '-' }}</dd>
                                    <dt>Telepon</dt><dd>{{ $b->user?->phone ?? '-' }}</dd>
                                </dl>
                            </div>
                            <div class="col-md-6">
                                <div class="bk-caption mb-2">Pembayaran</div>
                                <dl class="bk-kv">
                                    <dt>External ID</dt><dd class="bk-mono">{{ $b->payment?->external_id ?? '-' }}</dd>
                                    <dt>Status Xendit</dt><dd>{{ $b->payment?->status ?? '-' }}</dd>
                                    <dt>Dibuat</dt><dd>{{ $when($b->created_at) }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    @if ($b->status === SaleBooking::PAID)
                        <div class="bk-actions p-3">
                            <div class="d-flex flex-wrap gap-2 justify-content-end">
                                <button class="btn btn-sm btn-outline-danger" type="button" data-bs-toggle="collapse" data-bs-target="#cancel-booking" aria-expanded="{{ $errors->hasAny(['fee_outcome', 'reason']) ? 'true' : 'false' }}">Batalkan booking</button>
                                <form method="POST" action="{{ route('admin.bookings.complete', $b) }}" onsubmit="return confirm('Tandai properti ini terjual?')">
                                    @csrf
                                    <button class="btn btn-sm btn-primary">Tandai terjual</button>
                                </form>
                            </div>
                            <form method="POST" action="{{ route('admin.bookings.cancel', $b) }}" id="cancel-booking" class="collapse {{ $errors->hasAny(['fee_outcome', 'reason']) ? 'show' : '' }} mt-3 bk-danger">
                                @csrf
                                <div class="fw-bold mb-2" style="color:#435971">Batalkan booking {{ $b->payment?->external_id }}</div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="fee_outcome" value="refunded" id="fee-refunded" @checked(old('fee_outcome') === 'refunded')>
                                    <label class="form-check-label small" for="fee-refunded"><b>Kembalikan {{ $rupiah($b->amount) }} ke saldo Wallet pembeli</b> — mis. penjual batal, dokumen bermasalah.</label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="fee_outcome" value="forfeited" id="fee-forfeited" @checked(old('fee_outcome') === 'forfeited')>
                                    <label class="form-check-label small" for="fee-forfeited"><b>Hangus</b> — mis. pembeli mundur sesuai S&amp;K booking.</label>
                                </div>
                                @error('fee_outcome')<div class="text-danger small mb-2">{{ $message }}</div>@enderror
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" name="deactivate_listing" value="1" id="deactivate-listing">
                                    <label class="form-check-label small" for="deactivate-listing">Pemilik menarik properti: nonaktifkan listing (tidak tampil lagi)</label>
                                </div>
                                <label class="form-label small fw-semibold" for="cancel-reason">Alasan (tampil ke pembeli)</label>
                                <textarea class="form-control form-control-sm" name="reason" id="cancel-reason" rows="2" maxlength="500">{{ old('reason') }}</textarea>
                                @error('reason')<div class="text-danger small">{{ $message }}</div>@enderror
                                <div class="text-end mt-2"><button class="btn btn-sm btn-danger">Batalkan booking</button></div>
                            </form>
                        </div>
                    @elseif ($b->status === SaleBooking::CONFLICT)
                        <div class="bk-actions p-3 d-flex justify-content-end">
                            <form method="POST" action="{{ route('admin.bookings.refund', $b) }}" data-confirm="Kembalikan {{ $rupiah($b->amount) }} ke saldo {{ $b->user?->name }}?" onsubmit="return confirm(this.dataset.confirm)">
                                @csrf
                                <button class="btn btn-sm btn-primary">Kembalikan {{ $rupiah($b->amount) }} ke saldo {{ $b->user?->name }}</button>
                            </form>
                        </div>
                    @endif
                </div>
            @else
                <div class="card h-100"><div class="card-body d-flex align-items-center justify-content-center bk-sub py-5">Pilih booking di sebelah kiri.</div></div>
            @endif
        </div>
    </div>
@endsection
