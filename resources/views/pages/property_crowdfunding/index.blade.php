@extends('layouts.app')
@section('content')
    <a href="{{ route('admin.crowdfunding-properties.create') }}" class="btn btn-primary mb-2">Add Properties</a>
    <div class="card">
        <div class="card-header">
            <table id="propertiesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Property Name</th>
                        <th>Property Location</th>
                        <th>Funding Goal</th>
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
                ajax: "{{ route('admin.crowdfunding-properties.data') }}",
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
                        data: 'funding_goal',
                        name: 'funding_goal'
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
