@extends('layouts.app')
@section('content')
    <form action="{{ $action }}" method="POST" enctype="multipart/form-data">
        @csrf
        @if ($btn === 'edit')
            @method('PUT')
        @endif
        <div class="card">
            <div class="card-header h5">{{ $title }}</div>
            <div class="card-body">
                @php
                    $d = $btn == 'edit' ? $data : null;
                    // C2: once a deposit is paid the terms of the auction stay put.
                    $locked = $d && $d->deposits()->whereNotNull('paid_at')->exists();
                    $running = $d && $d->status === 'active' && $d->date_start?->isPast();
                    $local = fn ($t) => $t?->format('Y-m-d\\TH:i');
                @endphp
                @if ($errors->any())
                    <div class="alert alert-danger small" role="alert">
                        @foreach ($errors->all() as $error)<div>{{ $error }}</div>@endforeach
                    </div>
                @endif
                @if ($locked)
                    <div class="alert alert-warning small" role="status">Sudah ada peserta yang membayar deposit: properti, jenis, nilai limit, kelipatan dan deposit tidak bisa diubah.</div>
                @endif
                <div class="mb-3">
                    <label for="property_id" class="form-label">Property</label>
                    <select name="property_id" id="property_id" class="form-control" @required(true) @if ($locked) readonly @endif>
                        @if ($d)
                            <option value="{{ $d->property->id }}" selected>{{ $d->property->property_name }}</option>
                        @endif
                    </select>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="open_bid" class="form-label">Nilai limit / Open Bid (Rp)</label>
                        <input type="number" class="form-control" name="open_bid" id="open_bid" value="{{ old('open_bid', $d ? (int) $d->open_bid : '') }}" @required(true) @readonly($locked)>
                    </div>
                    <div class="col-md-6">
                        <label for="bid_increment" class="form-label">Kelipatan penawaran (Rp)</label>
                        <input type="number" class="form-control" name="bid_increment" id="bid_increment" value="{{ old('bid_increment', $d ? (int) $d->bid_increment : '') }}" @required(true) @readonly($locked)>
                    </div>
                    <div class="col-md-6">
                        <label for="market_value" class="form-label">Market Value (Rp)</label>
                        <input type="number" class="form-control" name="market_value" id="market_value" value="{{ old('market_value', $d ? (int) $d->market_value : '') }}" @required(true)>
                    </div>
                    <div class="col-md-6">
                        <label for="deposit_percent" class="form-label">Deposit</label>
                        <div class="input-group">
                            <input type="number" step="0.01" min="{{ \App\Models\PropertyAuction::MIN_DEPOSIT_PERCENT }}" max="100" class="form-control" name="deposit_percent" id="deposit_percent" value="{{ old('deposit_percent', $d?->deposit_percent) }}" @required(true) @readonly($locked)>
                            <span class="input-group-text">% dari limit</span>
                        </div>
                        <div class="form-text">Minimal {{ \App\Models\PropertyAuction::MIN_DEPOSIT_PERCENT }}%. <span id="deposit-preview"></span></div>
                    </div>
                    <div class="col-md-6">
                        <label for="payment_days" class="form-label">Batas pelunasan pemenang</label>
                        <div class="input-group">
                            <input type="number" min="1" max="60" class="form-control" name="payment_days" id="payment_days" value="{{ old('payment_days', $d?->payment_days ?? 7) }}" @required(true)>
                            <span class="input-group-text">hari</span>
                        </div>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="date_start" class="form-label">Dibuka (WIB)</label>
                        <input type="datetime-local" class="form-control" name="date_start" id="date_start" value="{{ old('date_start', $local($d?->date_start)) }}" @required(true) @readonly($running)>
                    </div>
                    <div class="col-md-6">
                        <label for="date_finish" class="form-label">Ditutup (WIB)</label>
                        <input type="datetime-local" class="form-control" name="date_finish" id="date_finish" value="{{ old('date_finish', $local($d?->date_finish)) }}" @required(true)>
                        @if ($running)<div class="form-text">Lelang sedang berjalan: waktu tutup hanya bisa diperpanjang.</div>@endif
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input type="hidden" name="anti_sniping" value="0">
                            <input class="form-check-input" type="checkbox" name="anti_sniping" id="anti_sniping" value="1" @checked(old('anti_sniping', $d?->anti_sniping))>
                            <label class="form-check-label" for="anti_sniping">Perpanjang 5 menit bila ada penawaran di 5 menit terakhir (anti-sniping)</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="terms" class="form-label">S&amp;K lelang (ditampilkan sebelum peserta membayar deposit)</label>
                        <textarea class="form-control" name="terms" id="terms" rows="4" maxlength="5000">{{ old('terms', $d?->terms) }}</textarea>
                    </div>
                </div>
                <div class="row g-3">
                    <div class="col-6">
                        <label for="type" class="form-label">Type</label>
                        <select name="type" class="form-control" id="type" @required(true)>
                            @foreach (\App\Models\PropertyAuction::TYPES as $value => $label)
                                <option value="{{ $value }}" @selected(old('type', $d ? $d->type : \App\Models\PropertyAuction::TYPE_AUCTION) === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="status" class="form-label">Status</label>
                        <select name="status" class="form-control" id="status" @required(true)>
                            @foreach (['draft' => 'Draft', 'upcoming' => 'Upcoming (deposit dibuka)', 'active' => 'Active', 'suspended' => 'Suspended'] as $value => $label)
                                <option value="{{ $value }}" @selected(old('status', $d?->status ?? 'draft') === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                        <div class="form-text">Upcoming berubah ke Active otomatis saat waktu buka. Penutupan, pemenang dan pelunasan diatur sistem.</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <button class="btn btn-primary" type="submit">Submit</button>
        </div>
    </form>
@endsection
@push('scripts')
    <script>
        $(document).ready(function() {
            $('#property_id').select2({
                placeholder: 'Search property...',
                minimumInputLength: 2,
                ajax: {
                    url: '{{ route('admin.properties.search') }}',
                    dataType: 'json',
                    delay: 300,
                    data: function(params) {
                        return {
                            q: params.term
                        };
                    },
                    processResults: function(data) {
                        return {
                            results: data
                        };
                    }
                }
            });
        });
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const limit = document.getElementById('open_bid');
            const pct = document.getElementById('deposit_percent');
            const out = document.getElementById('deposit-preview');
            const rupiah = (v) => 'Rp ' + Math.round(v).toLocaleString('id-ID');
            const preview = () => {
                const l = parseFloat(limit.value), p = parseFloat(pct.value);
                out.textContent = l > 0 && p > 0 ? 'Deposit peserta: ' + rupiah(l * p / 100) + '.' : '';
            };
            limit.addEventListener('input', preview);
            pct.addEventListener('input', preview);
            preview();
        });
    </script>
@endpush
