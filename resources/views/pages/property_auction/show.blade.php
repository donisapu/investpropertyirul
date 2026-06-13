@extends('layouts.app')
@section('content')
    <div class="card mt-4">
        <div class="card-header h5 d-flex justify-content-between align-items-center">
            <span>Daftar Bidding User</span>

            <button type="button" class="btn btn-sm btn-outline-primary" id="btnRefreshBids">
                <i class="bx bx-refresh"></i> Refresh Data
            </button>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width="5%">#</th>
                            <th>Nama Bidder</th>
                            <th>Waktu Bid</th>
                            <th>Nominal Bid</th>
                        </tr>
                    </thead>
                    <tbody id="bids-container">
                        <tr>
                            <td colspan="4" class="text-center text-muted">Loading data...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection
@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const auctionId = {{ $data->id }};
            const container = document.getElementById('bids-container');
            const btnRefresh = document.getElementById('btnRefreshBids');

            function loadBids() {
                container.innerHTML =
                    '<tr><td colspan="4" class="text-center text-muted">Sedang memuat data...</td></tr>';

                fetch(`/admin/auction-properties/${auctionId}/bids`)
                    .then(response => response.json())
                    .then(res => {
                        const bids = res.data;
                        container.innerHTML = '';

                        if (bids.length === 0) {
                            container.innerHTML =
                                '<tr><td colspan="4" class="text-center text-muted">Belum ada bid yang masuk.</td></tr>';
                            return;
                        }

                        const formatRupiah = new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        });

                        bids.forEach((bid, index) => {
                            let dateObj = new Date(bid.created_at);
                            let formattedDate = dateObj.toLocaleString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            let isHighest = index === 0;
                            let highestBadge = isHighest ?
                                '<span class="badge bg-success ms-2">Highest Bid</span>' : '';
                            let textClass = isHighest ? 'text-success fw-bold' : '';
                            let userName = bid.user ? bid.user.name : 'User Tidak Ditemukan';

                            let row = `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${userName}</td>
                                <td>${formattedDate}</td>
                                <td class="${textClass}">
                                    ${formatRupiah.format(bid.bid_amount)} ${highestBadge}
                                </td>
                            </tr>
                        `;
                            container.innerHTML += row;
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching bids:', error);
                        container.innerHTML =
                            '<tr><td colspan="4" class="text-center text-danger">Gagal memuat data. Silakan coba lagi.</td></tr>';
                    });
            }

            loadBids();

            btnRefresh.addEventListener('click', loadBids);
        });
    </script>
@endpush
