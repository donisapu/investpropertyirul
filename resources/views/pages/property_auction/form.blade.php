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
                    <label for="">Open Bid</label>
                    <input type="number" class="form-control" name="open_bid" placeholder="Open Bid" id=""
                        @if ($btn == 'edit') value="{{ $data->open_bid }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Bid Increment</label>
                    <input type="number" class="form-control" name="bid_increment" placeholder="Bid Increment"
                        id="" @if ($btn == 'edit') value="{{ $data->bid_increment }}" @endif>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-6">
                            <label for="">Start Date</label>
                            <input type="date" class="form-control" name="date_start" id=""
                                @if ($btn == 'edit') value="{{ $data->date_start }}" @endif>
                        </div>
                        <div class="col-6">
                            <label for="">Finish Date</label>
                            <input type="date" class="form-control" name="date_finish" id=""
                                @if ($btn == 'edit') value="{{ $data->date_finish }}" @endif>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Status</label>
                    <select name="status" class="form-control" id="">
                        <option value="scheduled" @if ($btn == 'edit' && $data->status == 'scheduled') selected @endif>Scheduled</option>
                        <option value="running" @if ($btn == 'edit' && $data->status == 'running') selected @endif>Running</option>
                        <option value="finished" @if ($btn == 'edit' && $data->status == 'finished') selected @endif>Finished</option>
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
