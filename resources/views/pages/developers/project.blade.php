@extends('layouts.app')
@section('content')
    <a href="{{ route('admin.projects.create') }}" class="btn btn-primary mb-2">Add Projects</a>
    <div class="card">
        <div class="card-header">
            <table id="projectsTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Project Location</th>
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
            $('#projectsTable').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('admin.projects.data') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'title',
                        name: 'title'
                    },
                    {
                        data: 'location',
                        name: 'location'
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
