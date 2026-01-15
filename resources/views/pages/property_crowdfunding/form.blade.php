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
                    <label for="">Funding Goal</label>
                    <input type="number" class="form-control" name="funding_goal" placeholder="Crowdfunding Goal"
                        id="" @if ($btn == 'edit') value="{{ $data->funding_goal }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Minimum Contribution</label>
                    <input type="number" class="form-control" name="min_contribution" placeholder="Minimum Contribution"
                        id="" @if ($btn == 'edit') value="{{ $data->min_contribution }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Estimated ROI</label>
                    <input type="number" class="form-control" name="estimated_roi" placeholder="Estimated ROI"
                        id="" @if ($btn == 'edit') value="{{ $data->estimated_roi }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Tenor</label>
                    <input type="text" class="form-control" name="tenor" placeholder="Tenor" id=""
                        @if ($btn == 'edit') value="{{ $data->tenor }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Status</label>
                    <select name="status" class="form-control" id="">
                        <option value="draft" @if ($btn == 'edit' && $data->status == 'draft') selected @endif>Draft</option>
                        <option value="Open" @if ($btn == 'edit' && $data->status == 'Open') selected @endif>Open</option>
                        <option value="success" @if ($btn == 'edit' && $data->status == 'success') selected @endif>Success</option>
                        <option value="inactive" @if ($btn == 'edit' && $data->status == 'inactive') selected @endif>Invactive</option>
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
