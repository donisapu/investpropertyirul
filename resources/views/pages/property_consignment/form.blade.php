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
                    <label for="">Ownership</label>
                    <select name="ownership" class="form-control" id="">
                        <option value="SHM" @if ($btn == 'edit' && $data->ownership == 'SHM') selected @endif>SHM</option>
                        <option value="SHGB" @if ($btn == 'edit' && $data->ownership == 'SHGB') selected @endif>SHGB</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="">Listing Type</label>
                    <select name="listing_type" class="form-control" id="listing_type">
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
                    <select name="status" class="form-control" id="">
                        <option value="draft" @if ($btn == 'edit' && $data->status == 'draft') selected @endif>Draft</option>
                        <option value="active" @if ($btn == 'edit' && $data->status == 'active') selected @endif>Active</option>
                        <option value="sold" @if ($btn == 'edit' && $data->status == 'sold') selected @endif>Sold</option>
                        <option value="inactive" @if ($btn == 'edit' && $data->status == 'inactive') selected @endif>Inactive</option>
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
