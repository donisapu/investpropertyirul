@extends('layouts.app')

@section('content')
    <div class="card">
        <div class="card-header font-weight-bold">
            <h5>Daftar Permintaan Penarikan Dana (Withdrawals)</h5>
        </div>
        <div class="card-body">
            <table id="withdrawalsTable" class="table table-striped table-bordered w-100">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Detail Bank</th>
                        <th>Nominal</th>
                        <th>Fee</th>
                        <th>Total Potong</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

    <!-- Modal Reject / Decline -->
    <div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form id="rejectForm" method="POST">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title">Tolak Permintaan Withdraw</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="failure_reason">Alasan Penolakan:</label>
                            <textarea name="failure_reason" id="failure_reason" class="form-group form-control" rows="3" required
                                placeholder="Contoh: Nama di rekening tidak cocok dengan dokumen KYC"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-danger">Konfirmasi Tolak & Refund Saldo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        $(function() {
            $('#withdrawalsTable').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('admin.user-withdrawals.data') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'user.name',
                        name: 'user.name'
                    },
                    {
                        data: 'bank_detail',
                        name: 'bank_detail',
                        orderable: false
                    },
                    {
                        data: 'formatted_amount',
                        name: 'amount'
                    },
                    {
                        data: 'formatted_fee',
                        name: 'fee'
                    },
                    {
                        data: 'total_deduction',
                        name: 'total_deduction',
                        orderable: false
                    },
                    {
                        data: 'status_badge',
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

        // Handler Modal Reject
        function openRejectModal(actionUrl) {
            $('#rejectForm').attr('action', actionUrl);
            $('#rejectModal').modal('show');
        }
    </script>
@endpush
