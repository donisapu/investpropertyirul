@extends('layouts.app')
@section('content')
    @if ($errors->has('booking'))
        <div class="alert alert-danger" role="alert">{{ $errors->first('booking') }}</div>
    @endif
    <a href="{{ route('admin.consignment-properties.create') }}" class="btn btn-primary mb-2">Add Properties</a>
    <div class="card">
        <div class="card-header">
            <table id="propertiesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Property Name</th>
                        <th>Property Location</th>
                        <th>Listing Type</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
@endsection
@push('scripts')
    <script>
        $(function() {
            $('#propertiesTable').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('admin.consignment-properties.data') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'property.property_name',
                        name: 'property.property_name'
                    },
                    {
                        data: 'property.property_location',
                        name: 'property.property_location'
                    },
                    {
                        data: 'listing_type',
                        name: 'listing_type'
                    },
                    {
                        data: 'status',
                        name: 'status'
                    },
                    {
                        data: 'action',
                        name: 'action',
                        orderable: false,
                        searchable: false
                    }
                ]
            });
        });
    </script>
@endpush
