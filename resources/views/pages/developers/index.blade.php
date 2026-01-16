@extends('layouts.app')
@section('content')
    <a href="{{ route('admin.developers.create') }}" class="btn btn-primary mb-3">Add Developer</a>
    <div class="card">
        <div class="card-header">
            <table id="developersTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Developer Name</th>
                        <th>Phone Number</th>
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
            $('#developersTable').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('admin.developers.data') }}",
                columns: [
                    {
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'name',
                        name: 'name'
                    },
                    {
                        data: 'phone',
                        name: 'phone'
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
