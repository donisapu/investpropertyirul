@extends('layouts.app')
@section('content')
    {{-- @if ($errors->any())
        <div style="color: red; margin-bottom: 20px;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif --}}
    <form action="{{ $action }}" method="POST" enctype="multipart/form-data">
        @csrf
        @if ($btn === 'edit')
            @method('PUT')
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
                    <label for="" class="form-label">Asset Price</label>
                    <input type="number" class="form-control" name="asset_price" placeholder="Asset Price" id=""
                        @if ($btn == 'edit') value="{{ $data->asset_price }}" @endif @required(true)>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-4">
                            <label for="" class="form-label">Property Upgrades</label>
                            <input type="number" class="form-control" name="property_upgrades"
                                placeholder="Property Upgrades" id=""
                                @if ($btn == 'edit') value="{{ $data->property_upgrades }}" @endif
                                @required(true)>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Notary Fee</label>
                            <input type="number" class="form-control"  name="notary_fee"
                                placeholder="Notary Fee" id=""
                                @if ($btn == 'edit') value="{{ $data->notary_fee }}" @endif @required(true)>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Platform Fee</label>
                            <input type="number" class="form-control"  name="platform_fee"
                                placeholder="Platform Fee" id=""
                                @if ($btn == 'edit') value="{{ $data->platform_fee }}" @endif
                                @required(true)>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-6">
                            <label for="" class="form-label">Rental Yield (%)</label>
                            <input type="number" class="form-control" name="rental_yield" placeholder="Rental Yield"
                                id="" @if ($btn == 'edit') value="{{ $data->rental_yield }}" @endif
                                @required(true)>
                        </div>
                        <div class="col-6">
                            <label for="" class="form-label">Appreciation Rate (%)</label>
                            <input type="number" class="form-control" name="appreciation_rate"
                                placeholder="Appreciation Rate" id=""
                                @if ($btn == 'edit') value="{{ $data->appreciation_rate }}" @endif
                                @required(true)>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Price Per Lot</label>
                    <input type="number" class="form-control" name="price_per_lot" placeholder="Price Per Lot"
                        id="" @if ($btn == 'edit') value="{{ $data->price_per_lot }}" @endif
                        @required(true)>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-4">
                            <label for="" class="form-label">Total Lot</label>
                            <input type="number" class="form-control" name="total_lot" placeholder="Total Lot"
                                id="" @if ($btn == 'edit') value="{{ $data->total_lot }}" @endif
                                @required(true)>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Min Lot Size</label>
                            <input type="number" name="min_lot_size" class="form-control" id=""
                                placeholder="Mininum Buying"
                                @if ($btn == 'edit') value="{{ $data->min_lot_size }}" @endif
                                @required(true)>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Max Lot Size</label>
                            <input type="number" class="form-control" name="max_lot_size" placeholder="Maximum Buying"
                                id="" @if ($btn == 'edit') value="{{ $data->max_lot_size }}" @endif
                                @required(true)>
                        </div>
                    </div>

                </div>
                <div class="mb-3">
                    <label for="" class="form-label">ROI Period (Month)</label>
                    <input type="text" class="form-control" name="roi_period_months" placeholder="ROI Period Month"
                        id="" @if ($btn == 'edit') value="{{ $data->roi_period_months }}" @endif
                        @required(true)>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Status</label>
                    <select name="status" class="form-control" id="" @required(true)>
                        <option value="Draft" @if ($btn == 'edit' && $data->status == 'Draft') selected @endif>Draft</option>
                        <option value="Open" @if ($btn == 'edit' && $data->status == 'Open') selected @endif>Open</option>
                        <option value="FullyFunded" @if ($btn == 'edit' && $data->status == 'FullyFunded') selected @endif>FullyFunded
                        </option>
                        <option value="Running" @if ($btn == 'edit' && $data->status == 'Running') selected @endif>Running</option>
                        <option value="Finished" @if ($btn == 'edit' && $data->status == 'Finished') selected @endif>Finished</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <button class="btn btn-primary" type="submit">Submit</button>
            <a href="{{ route('admin.investment-properties') }}" class="btn btn-secondary">Cancel</a>
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
@endpush
