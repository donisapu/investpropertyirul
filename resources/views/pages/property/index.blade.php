@extends('layouts.app')
@section('content')
    <a href="{{ route('admin.properties.create') }}" class="btn btn-primary mb-2">Add Properties</a>
    <div class="card">
        <div class="card-header">
            <table id="propertiesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Property Name</th>
                        <th>Property Location</th>
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
                ajax: "{{ route('admin.properties.data') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'property_name',
                        name: 'property_name'
                    },
                    {
                        data: 'property_location',
                        name: 'property_location'
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
