@extends('layouts.app')
@section('content')
    <form action="{{ $action }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="card">
            <div class="card-header h5">{{ $title }}</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="" class="form-label">Property</label>
                    <select name="property_id" id="property_id" class="form-control">
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
                        id="" @if ($btn == 'edit') value="{{ $data->property_value }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Price Per Lot</label>
                    <input type="number" class="form-control" name="price_perlot" placeholder="Price Per Lot"
                        id="" @if ($btn == 'edit') value="{{ $data->price_perlot }}" @endif>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-4">
                            <label for="" class="form-label">Total Lot</label>
                            <input type="number" class="form-control" name="total_lot" placeholder="Total Lot"
                                id="" @if ($btn == 'edit') value="{{ $data->total_lot }}" @endif>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Min Lot Size</label>
                            <input type="number" name="min_lot_size" class="form-control" id=""
                                placeholder="Mininum Buying"
                                @if ($btn == 'edit') value="{{ $data->min_lot_size }}" @endif>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Max Lot Size</label>
                            <input type="number" class="form-control" name="max_lot_size" placeholder="Maximum Buying"
                                id="" @if ($btn == 'edit') value="{{ $data->max_lot_size }}" @endif>
                        </div>
                    </div>

                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-6">
                            <label for="" class="form-label">Estimated ROI (%)</label>
                            <input type="text" name="estimated_roi" class="form-control" placeholder="Estimated ROI"
                                id="" @if ($btn == 'edit') value="{{ $data->estimated_roi }}" @endif>
                        </div>
                        <div class="col-6">
                            <label for="" class="form-label">ROI Period (Month)</label>
                            <input type="text" class="form-control" name="roi_period" placeholder="ROI Period"
                                id="" @if ($btn == 'edit') value="{{ $data->roi_period }}" @endif>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Status</label>
                    <select name="status" class="form-control" id="">
                        <option value="Draft" @if ($btn == 'edit' && $data->status == 'Draft') selected @endif>Draft</option>
                        <option value="Open" @if ($btn == 'edit' && $data->status == 'Open') selected @endif>Open</option>
                        <option value="Closed" @if ($btn == 'edit' && $data->status == 'Closed') selected @endif>Closed</option>
                        <option value="Running" @if ($btn == 'edit' && $data->status == 'Running') selected @endif>Running</option>
                        <option value="Finished" @if ($btn == 'edit' && $data->status == 'Finished') selected @endif>Finished</option>
                    </select>
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
@endpush
