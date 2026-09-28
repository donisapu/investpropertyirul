@extends('layouts.app')
@section('content')
    <div class="row">
        <div class="col-lg-4 col-md-12 col-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                        <div class="avatar flex-shrink-0">
                            <span class="avatar-initial rounded bg-label-success"><i class="bx bx-wallet"></i></span>
                        </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Saldo Aktif (Cash)</span>
                    <h3 class="card-title mb-2">Rp {{ number_format($balance, 0, ',', '.') }}</h3>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12 mb-4">
            <div class="card">
                <h5 class="card-header">10 Invoice Terbaru</h5>
                <div class="table-responsive text-nowrap">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>External ID</th>
                                <th>Payer Email</th>
                                <th>Jumlah</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                            @forelse ($invoices as $invoice)
                                <tr>
                                    <td><code>{{ $invoice->getExternalId() }}</code></td>
                                    <td>{{ $invoice->getPayerEmail() ?? '-' }}</td>
                                    <td class="fw-semibold">Rp {{ number_format($invoice->getAmount(), 0, ',', '.') }}</td>
                                    <td>
                                        @if ($invoice->getStatus() === 'PAID')
                                            <span class="badge bg-label-success">PAID</span>
                                        @elseif ($invoice->getStatus() === 'PENDING')
                                            <span class="badge bg-label-warning">PENDING</span>
                                        @else
                                            <span class="badge bg-label-danger">{{ $invoice->getStatus() }}</span>
                                        @endif
                                    </td>
                                    <td class="text-muted">
                                        {{ \Carbon\Carbon::parse($invoice->getCreated())->format('d M Y H:i') }}
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="text-center text-muted">Belum ada transaksi.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
