@extends('layouts.app')

@php
    use App\Models\AuctionDeposit;
    use App\Models\AuctionSettlement;

    $rupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    $percent = fn ($v) => rtrim(rtrim(number_format((float) $v, 2, ',', '.'), '0'), ',') . '%';
    $when = fn ($t) => $t?->locale('id')->translatedFormat('j M Y, H.i');
    $statusBadge = [
        'draft' => ['bg-label-secondary', 'Draft'],
        'upcoming' => ['bg-label-info', 'Akan datang'],
        'active' => ['bg-label-success', 'Berlangsung'],
        'closed' => ['bg-label-secondary', 'Ditutup'],
        'awaiting_payment' => ['bg-label-warning', 'Menunggu pelunasan'],
        'completed' => ['bg-label-success', 'Lunas · Selesai'],
        'no_winner' => ['bg-label-secondary', 'Tanpa pemenang'],
        'defaulted' => ['bg-label-danger', 'Gagal bayar'],
        'cancelled' => ['bg-label-danger', 'Dibatalkan'],
        'suspended' => ['bg-label-secondary', 'Ditangguhkan'],
    ];
    $depositBadge = [
        AuctionDeposit::PENDING => ['bg-label-secondary', 'Menunggu bayar'],
        AuctionDeposit::PAID => ['bg-label-info', 'Ditahan'],
        AuctionDeposit::REFUNDED => ['bg-label-secondary', 'Kembali ke saldo'],
        AuctionDeposit::APPLIED => ['bg-label-success', 'Dipotong dari harga'],
        AuctionDeposit::FORFEITED => ['bg-label-danger', 'Hangus'],
        AuctionDeposit::EXPIRED => ['bg-label-secondary', 'Kedaluwarsa'],
    ];
    $settlement = $data->settlement;
    $held = $deposits->where('status', AuctionDeposit::PAID)->sum('amount');
    [$badgeClass, $badgeLabel] = $statusBadge[$data->status] ?? ['bg-label-secondary', $data->status];
@endphp

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
            <div class="small fw-semibold text-muted"><a href="{{ route('admin.auction-properties') }}" class="text-reset"><i class="bx bx-chevron-left"></i> Auctions</a></div>
            <h4 class="fw-bold mb-0">{{ $data->property?->property_name }}</h4>
            <div class="small">
                {{ $data->type_label }} · limit {{ $rupiah($data->open_bid) }} · kelipatan {{ $rupiah($data->bid_increment) }}
                · deposit {{ $data->deposit_percent ? $percent($data->deposit_percent) . ' (' . $rupiah($data->depositAmount()) . ')' : 'belum diatur' }}
            </div>
            <div class="small text-muted">{{ $when($data->date_start) }} – {{ $when($data->date_finish) }} WIB @if ($data->anti_sniping) · anti-sniping @endif</div>
        </div>
        <div class="d-flex align-items-center gap-2">
            <span class="badge {{ $badgeClass }}">{{ $badgeLabel }}</span>
            @if (in_array($data->status, \App\Models\PropertyAuction::EDITABLE_STATUSES, true))
                <a href="{{ route('admin.auction-properties.edit', $data->id) }}" class="btn btn-sm btn-outline-primary"><i class="bx bx-edit"></i> Ubah</a>
            @endif
        </div>
    </div>

    @if (session('success'))
        <div class="alert alert-success alert-dismissible" role="status">{{ session('success') }}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button></div>
    @endif
    @if ($errors->any())
        <div class="alert alert-danger" role="alert">{{ $errors->first() }}</div>
    @endif

    <div class="row g-4">
        <div class="col-lg-7">
            <div class="card mb-4">
                <div class="card-body">
                    @if ($settlement)
                        <div class="small fw-semibold text-muted text-uppercase">Pemenang · {{ $settlement->user?->name }} ({{ $settlement->user?->email }})</div>
                        <div class="fs-3 fw-bold">{{ $rupiah($settlement->price) }}</div>
                        <dl class="row small mt-3 mb-0">
                            <dt class="col-6 fw-normal text-muted">Deposit dipakai</dt><dd class="col-6 text-end">− {{ $rupiah($settlement->deposit_amount) }}</dd>
                            <dt class="col-6 fw-normal text-muted">Sisa pelunasan</dt><dd class="col-6 text-end fw-bold">{{ $rupiah($settlement->amount) }}</dd>
                            <dt class="col-6 fw-normal text-muted">Batas bayar</dt><dd class="col-6 text-end">{{ $when($settlement->due_at) }} WIB</dd>
                            <dt class="col-6 fw-normal text-muted">Invoice pelunasan</dt>
                            <dd class="col-6 text-end">{{ $settlement->payment ? $settlement->payment->external_id . ' · ' . $settlement->payment->status : 'belum dibuat pemenang' }}</dd>
                            @if ($settlement->status === AuctionSettlement::PAID)
                                <dt class="col-6 fw-normal text-muted">Lunas</dt>
                                <dd class="col-6 text-end">{{ $when($settlement->paid_at) }} @if ($settlement->paidManuallyBy) · manual oleh {{ $settlement->paidManuallyBy->name }} @endif</dd>
                                @if ($settlement->manual_note)
                                    <dt class="col-6 fw-normal text-muted">Bukti</dt><dd class="col-6 text-end">{{ $settlement->manual_note }}</dd>
                                @endif
                            @endif
                        </dl>
                        @if ($settlement->status === AuctionSettlement::DEFAULTED)
                            <div class="alert alert-danger small mt-3 mb-0">Pemenang tidak melunasi sampai batas waktu. Deposit {{ $rupiah($settlement->deposit_amount) }} hangus (kas perusahaan, bisa ditarik lewat Company Cash-out). Untuk melelang ulang, buat lelang baru.</div>
                        @endif
                    @elseif ($data->status === 'no_winner')
                        <div class="text-muted">Lelang ditutup {{ $when($data->closed_at) }} tanpa penawaran. Semua deposit sudah dikembalikan ke saldo peserta.</div>
                    @elseif ($data->status === 'cancelled')
                        <div class="text-muted">Dibatalkan {{ $when($data->cancelled_at) }}. Alasan: {{ $data->cancel_reason }}</div>
                    @else
                        <div class="small fw-semibold text-muted text-uppercase">Penawaran tertinggi</div>
                        <div class="fs-3 fw-bold">{{ $bids->first() ? $rupiah($bids->first()->bid_amount) : '—' }}</div>
                        <div class="small">
                            @if ($bids->first()) oleh <b>{{ $bids->first()->user?->name }}</b> · @endif
                            {{ $bids->count() }} penawaran · deposit ditahan {{ $rupiah($held) }}
                        </div>
                        <div class="small text-muted mt-2">Admin tidak bisa mengubah atau menghapus penawaran; hanya bisa membatalkan lelang. Lelang ditutup otomatis oleh sistem saat waktunya habis.</div>
                    @endif
                </div>

                @if ($data->status === 'awaiting_payment' && $settlement?->status === AuctionSettlement::PENDING)
                    <div class="border-top p-3 bg-lighter">
                        <form method="POST" action="{{ route('admin.auction-properties.mark-paid', $data) }}" class="mb-3" data-confirm="Tandai pelunasan {{ $rupiah($settlement->amount) }} sudah diterima lewat transfer?" onsubmit="return confirm(this.dataset.confirm)">
                            @csrf
                            <label class="form-label small fw-semibold" for="paid-note">Tandai lunas (transfer manual) — bukti transfer</label>
                            <div class="input-group input-group-sm">
                                <input class="form-control" name="note" id="paid-note" maxlength="500" placeholder="mis. BCA, 14 Nov, ref 123456" value="{{ old('note') }}">
                                <button class="btn btn-primary">Tandai lunas</button>
                            </div>
                        </form>
                        <form method="POST" action="{{ route('admin.auction-properties.extend-due', $data) }}" class="d-flex align-items-center gap-2">
                            @csrf
                            <label class="small fw-semibold" for="extend-days">Perpanjang batas bayar</label>
                            <input type="number" class="form-control form-control-sm" style="width:5rem" name="days" id="extend-days" min="1" max="30" value="3">
                            <span class="small">hari</span>
                            <button class="btn btn-sm btn-outline-secondary">Perpanjang</button>
                        </form>
                    </div>
                @endif

                @if (in_array($data->status, \App\Models\PropertyAuction::EDITABLE_STATUSES, true))
                    <div class="border-top p-3">
                        <form method="POST" action="{{ route('admin.auction-properties.cancel', $data) }}" data-confirm="Batalkan lelang ini? Semua penawaran batal dan deposit {{ $rupiah($held) }} dikembalikan ke saldo peserta." onsubmit="return confirm(this.dataset.confirm)">
                            @csrf
                            <label class="form-label small fw-semibold" for="cancel-reason">Batalkan lelang &amp; kembalikan semua deposit — alasan (tampil ke peserta)</label>
                            <div class="input-group input-group-sm">
                                <input class="form-control" name="reason" id="cancel-reason" maxlength="500" value="{{ old('reason') }}">
                                <button class="btn btn-outline-danger">Batalkan lelang</button>
                            </div>
                        </form>
                    </div>
                @endif
            </div>

            <div class="card">
                <div class="card-header h6 mb-0">Riwayat penawaran</div>
                <div class="table-responsive">
                    <table class="table table-sm mb-0">
                        <thead><tr><th>Waktu</th><th>Peserta</th><th class="text-end">Penawaran</th></tr></thead>
                        <tbody>
                            @forelse ($bids->sortByDesc('id') as $bid)
                                <tr>
                                    <td class="small">{{ $when($bid->created_at) }}</td>
                                    <td>{{ $bid->user?->name }}
                                        @if ($bid->id === $data->winner_bid_id) <span class="badge bg-label-success">pemenang</span>
                                        @elseif ($bid->id === $bids->first()?->id) <span class="badge bg-label-success">tertinggi</span> @endif
                                    </td>
                                    <td class="text-end fw-semibold">{{ $rupiah($bid->bid_amount) }}</td>
                                </tr>
                            @empty
                                <tr><td colspan="3" class="text-center text-muted py-4">Belum ada penawaran.</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-lg-5">
            <div class="card">
                <div class="card-header h6 mb-0">Peserta &amp; deposit</div>
                <div class="table-responsive">
                    <table class="table table-sm mb-0">
                        <thead><tr><th>Peserta</th><th>Deposit</th></tr></thead>
                        <tbody>
                            @forelse ($deposits as $deposit)
                                @php([$dClass, $dLabel] = $depositBadge[$deposit->status] ?? ['bg-label-secondary', $deposit->status])
                                <tr>
                                    <td>{{ $deposit->user?->name }}
                                        <div class="small text-muted">{{ $deposit->payment?->external_id }} · {{ $deposit->paid_at ? 'dibayar ' . $when($deposit->paid_at) : 'dibuat ' . $when($deposit->created_at) }}</div>
                                    </td>
                                    <td><span class="badge {{ $dClass }}">{{ $dLabel }}</span><div class="small">{{ $rupiah($deposit->amount) }}</div></td>
                                </tr>
                            @empty
                                <tr><td colspan="2" class="text-center text-muted py-4">Belum ada peserta.</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="card-body small text-muted">Deposit yang "kembali ke saldo" masuk ke Wallet peserta dan ditarik lewat alur penarikan yang sudah ada.</div>
            </div>
        </div>
    </div>
@endsection
