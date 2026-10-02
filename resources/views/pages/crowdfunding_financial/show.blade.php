@extends('layouts.app')
@section('content')
    @foreach (['success', 'error'] as $flash)
        @if (session($flash))
            <div class="alert alert-{{ $flash === 'success' ? 'success' : 'danger' }} alert-dismissible" role="alert">
                {{ session($flash) }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif
    @endforeach
    @if ($errors->any())
        <div class="alert alert-danger" role="alert">
            @foreach ($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif
    <button type="button" class="btn btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#addFinancials">
        Add Report
    </button>
    <div class="modal fade" id="addFinancials" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalCenterTitle">Add Financials</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ route('admin.cw_financials.store', $id) }}" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="row g-2">
                            <div class="col mb-3">
                                <label for="income" class="form-label">Income</label>
                                <input type="number" name="income" id="income" class="form-control"
                                    placeholder="Input Property Income" />
                            </div>
                            <div class="col mb-3">
                                <label for="expense" class="form-label">Expense</label>
                                <input type="number" name="expense" id="expense" class="form-control"
                                    placeholder="Input Property Expense" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="" class="form-label">Status</label>
                                <select name="status" class="form-control" required id="">
                                    <option value="DRAFT">DRAFT</option>
                                    <option value="FINAL">FINAL</option>
                                </select>
                            </div>
                        </div>
                        <input type="hidden" name="crowdfunding_id" id="" value="{{ $id }}">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            <table id="propertiesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Dibuat</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Net Profit</th>
                        <th>Status</th>
                        <th>Hasil</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    @foreach ($data as $item)
                        <tr>
                            <td>{{ $item->created_at?->format('d M Y') }}</td>
                            <td>{{ number_format($item->income) }}</td>
                            <td>{{ number_format($item->expense) }}</td>
                            <td>{{ number_format($item->net_profit) }}</td>
                            <td>{{ $item->status }}</td>
                            <td>
                                @if ($item->is_distributed)
                                    <span class="badge bg-label-success">Sudah dibagikan</span>
                                    @if ($item->distributed_at)
                                        <div class="small text-muted">{{ $item->distributed_at->format('d M Y H:i') }}</div>
                                    @endif
                                @elseif ($item->status === 'FINAL')
                                    @php($plan = $previews[$item->id])
                                    @php($blocked = $crowdfunding->status !== 'Funded' || $plan['shares']->isEmpty())
                                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#distribute{{ $item->id }}" @disabled($blocked)>
                                        <i class="bx bx-wallet"></i> Bagikan Hasil
                                    </button>
                                    @if ($blocked)
                                        <div class="small text-muted">
                                            {{ $crowdfunding->status !== 'Funded' ? 'Crowdfunding belum Funded' : 'Belum ada investor' }}
                                        </div>
                                    @endif
                                    <div class="modal fade" id="distribute{{ $item->id }}" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Bagikan Hasil Crowdfunding</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <form action="{{ route('admin.cw_financials.distribute', [$item->id, $id]) }}" method="POST">
                                                    @csrf
                                                    <div class="modal-body">
                                                        <p class="mb-2">
                                                            Rp {{ number_format($plan['total'], 0, ',', '.') }} akan masuk ke wallet
                                                            {{ $plan['shares']->count() }} investor: modal
                                                            Rp {{ number_format($plan['principal'], 0, ',', '.') }}
                                                            {{ $plan['profit'] < 0 ? 'dikurangi rugi' : 'ditambah profit' }}
                                                            Rp {{ number_format(abs($plan['profit']), 0, ',', '.') }}, sesuai porsi modal tiap investor.
                                                        </p>
                                                        <table class="table table-sm mb-2">
                                                            <thead>
                                                                <tr><th>Investor</th><th class="text-end">Porsi</th><th class="text-end">Modal</th><th class="text-end">Profit</th><th class="text-end">Diterima</th></tr>
                                                            </thead>
                                                            <tbody>
                                                                @foreach ($plan['shares'] as $share)
                                                                    <tr>
                                                                        <td>{{ $investorNames[$share['user_id']] ?? '#' . $share['user_id'] }}</td>
                                                                        <td class="text-end">{{ number_format($share['ownership'], 2, ',', '.') }}%</td>
                                                                        <td class="text-end">Rp {{ number_format($share['principal'], 0, ',', '.') }}</td>
                                                                        <td class="text-end">Rp {{ number_format($share['profit'], 0, ',', '.') }}</td>
                                                                        <td class="text-end">Rp {{ number_format($share['amount'], 0, ',', '.') }}</td>
                                                                    </tr>
                                                                @endforeach
                                                            </tbody>
                                                        </table>
                                                        <p class="small text-danger mb-0">
                                                            Tidak bisa dibatalkan. Portofolio crowdfunding investor ditutup, dan laporan ini tidak bisa diubah atau dihapus.
                                                        </p>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                                                        <button type="submit" class="btn btn-success" onclick="this.disabled = true; this.form.submit();">
                                                            Ya, bagikan
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                @else
                                    <span class="text-muted small">Set FINAL dulu</span>
                                @endif
                            </td>
                            <td>
                                @unless ($item->is_distributed)
                                <button type="button" class="btn btn-primary mb-2 btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#edit{{ $item->id }}">
                                    <i class="bx bx-edit"></i>
                                </button>
                                <div class="modal fade" id="edit{{ $item->id }}" tabindex="-1" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="modalCenterTitle">Edit Financials</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <form action="{{ route('admin.cw_financials.update', [$item->id, $id]) }}"
                                                method="POST">
                                                @csrf
                                                <div class="modal-body">
                                                    <div class="row g-2">
                                                        <div class="col mb-3">
                                                            <label for="income" class="form-label">Income</label>
                                                            <input type="number" name="income" id="income"
                                                                class="form-control" placeholder="Input Property Income"
                                                                value="{{ $item->income }}" />
                                                        </div>
                                                        <div class="col mb-3">
                                                            <label for="expense" class="form-label">Expense</label>
                                                            <input type="number" name="expense" id="expense"
                                                                class="form-control" placeholder="Input Property Expense"
                                                                value="{{ $item->expense }}" />
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col">
                                                            <label for="" class="form-label">Status</label>
                                                            <select name="status" class="form-control" required
                                                                id="">
                                                                <option value="DRAFT"
                                                                    @if ($item->status == 'DRAFT') selected @endif>
                                                                    DRAFT</option>
                                                                <option value="FINAL"
                                                                    @if ($item->status == 'FINAL') selected @endif>
                                                                    FINAL</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <input type="hidden" name="crowdfunding_id" id=""
                                                        value="{{ $id }}">
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-outline-secondary"
                                                        data-bs-dismiss="modal">
                                                        Close
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <a href="{{ route('admin.cw_financials.destroy',[$item->id,$id]) }}" class="btn btn-danger mb-2 btn-sm"><i class="bx bx-trash"></i></a>
                                @endunless
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
