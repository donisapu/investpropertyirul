@extends('layouts.app')
@section('content')
    <form action="{{ $action }}" method="POST" enctype="multipart/form-data">
        @csrf
        @if ($btn === 'edit')
            @method('PUT')
        @endif
        @php
            $held = $btn === 'edit' && $data->bookings()->holding()->exists();
        @endphp
        @if ($errors->any())
            <div class="alert alert-danger" role="alert">{{ $errors->first() }}</div>
        @endif
        <div class="card">
            <div class="card-header h5">{{ $title }}</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="" class="form-label">Property</label>
                    <select name="property_id" id="property_id" class="form-control" @required(true)>
                        @if ($btn == 'edit')
                            <option value="{{ $data->property->id }}" selected>
                                {{ $data->property->property_name }}
                            </option>
                        @endif
                    </select>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Property Value</label>
                    <input type="number" class="form-control" name="property_value" placeholder="Property Value"
                        id="property_value" @readonly($held ?? false) @if ($btn == 'edit') value="{{ $data->property_value }}" @endif
                        @required(true)>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Market Value</label>
                    <input type="number" class="form-control" name="market_value" placeholder="Market Value" id=""
                        @if ($btn == 'edit') value="{{ $data->market_value }}" @endif @required(true)>
                </div>
                <div class="mb-3">
                    <label for="">Ownership</label>
                    <select name="ownership" class="form-control" id="" @required(true)>
                        <option value="SHM" @if ($btn == 'edit' && $data->ownership == 'SHM') selected @endif>SHM</option>
                        <option value="SHGB" @if ($btn == 'edit' && $data->ownership == 'SHGB') selected @endif>SHGB</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="">Listing Type</label>
                    <select name="listing_type" class="form-control" id="listing_type" @required(true)>
                        <option value="Freehold" @if ($btn == 'edit' && $data->listing_type == 'Freehold') selected @endif>
                            Freehold
                        </option>
                        <option value="Leasehold" @if ($btn == 'edit' && $data->listing_type == 'Leasehold') selected @endif>
                            Leasehold
                        </option>
                    </select>
                </div>
                <div class="mb-3" id="lease_term_wrapper">
                    <label for="">Lease Term</label>
                    <input type="text" class="form-control" name="lease_term" placeholder="Lease Term"
                        @if ($btn == 'edit') value="{{ $data->lease_term }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Status</label>
                    <select name="status" class="form-control" id="" @required(true)>
                        <option value="draft" @if ($btn == 'edit' && $data->status == 'draft') selected @endif>Draft</option>
                        <option value="active" @if ($btn == 'edit' && $data->status == 'active') selected @endif>Active</option>
                        <option value="sold" @if ($btn == 'edit' && $data->status == 'sold') selected @endif>Sold</option>
                        <option value="inactive" @if ($btn == 'edit' && $data->status == 'inactive') selected @endif>Inactive</option>
                    </select>
                </div>
                <hr>
                <h6 class="mb-1">Booking online</h6>
                <p class="text-muted small mb-3">Pembeli membayar booking fee lewat Xendit untuk mengunci properti. Kosongkan untuk mematikan booking online (hanya tombol WhatsApp).</p>
                @if ($held)
                    <div class="alert alert-warning small" role="status">Properti ini sedang dibooking. Harga dan booking fee tidak bisa diubah sampai booking selesai atau dibatalkan di menu Bookings.</div>
                @endif
                <div class="mb-3">
                    <label for="booking_fee_percent" class="form-label">Booking fee (% dari harga)</label>
                    <div class="input-group" style="max-width:14rem">
                        <input type="number" step="0.01" min="0.01" max="100" class="form-control" name="booking_fee_percent" id="booking_fee_percent"
                            value="{{ old('booking_fee_percent', $btn == 'edit' ? $data->booking_fee_percent : '') }}" @readonly($held)>
                        <span class="input-group-text">%</span>
                    </div>
                    <div class="form-text" id="booking_fee_preview" aria-live="polite"></div>
                </div>
                <div class="mb-3">
                    <label for="booking_terms" class="form-label">Syarat booking (tampil di konfirmasi booking)</label>
                    <textarea class="form-control" name="booking_terms" id="booking_terms" rows="3" maxlength="2000"
                        placeholder="Mis. booking fee dipotong dari harga saat pelunasan; hangus bila pembeli membatalkan sepihak.">{{ old('booking_terms', $btn == 'edit' ? $data->booking_terms : '') }}</textarea>
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
        (function () {
            const price = document.getElementById('property_value');
            const pct = document.getElementById('booking_fee_percent');
            const out = document.getElementById('booking_fee_preview');
            const render = () => {
                const p = parseFloat(price.value), f = parseFloat(pct.value);
                out.textContent = p > 0 && f > 0
                    ? 'Pembeli membayar Rp ' + Math.round(p * f / 100).toLocaleString('id-ID') + ' (' + f + '% × Rp ' + p.toLocaleString('id-ID') + ').'
                    : 'Booking online mati untuk properti ini.';
            };
            price.addEventListener('input', render);
            pct.addEventListener('input', render);
            render();
        })();

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
            const listingType = document.getElementById('listing_type');
            const leaseTermWrapper = document.getElementById('lease_term_wrapper');

            function toggleLeaseTerm() {
                if (listingType.value === 'Leasehold') {
                    leaseTermWrapper.style.display = 'block';
                } else {
                    leaseTermWrapper.style.display = 'none';
                }
            }

            toggleLeaseTerm();

            listingType.addEventListener('change', toggleLeaseTerm);
        });
    </script>
@endpush
