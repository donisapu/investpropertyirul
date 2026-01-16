@extends('layouts.app')
@section('content')
    <a href="{{ route('admin.campaigns.create') }}" class="btn btn-primary mb-3">Add Campaign</a>
    <div class="card">
        <div class="card-header">
            <table id="campaignsTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Discount Name</th>
                        <th>Discount (%)</th>
                        <th>Start Date</th>
                        <th>End Date</th>
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
            $('#campaignsTable').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('admin.campaigns.data') }}",
                columns: [
                    {
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
                        data: 'discount_percent',
                        name: 'discount_percent'
                    },
                    {
                        data: 'start_date',
                        name: 'start_date'
                    },
                    {
                        data: 'end_date',
                        name: 'end_date'
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
