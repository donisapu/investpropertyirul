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
                <form action="{{ route('admin.financials.store', $id) }}" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="row g-2">
                            <div class="col mb-3">
                                <label for="month" class="form-label">Month</label>
                                <select name="month" class="form-control" required id="month">
                                    <option value="">-Select Month-</option>
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="4">April</option>
                                    <option value="5">May</option>
                                    <option value="6">June</option>
                                    <option value="7">July</option>
                                    <option value="8">August</option>
                                    <option value="9">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                            </div>
                            <div class="col mb-3">
                                <label for="year" class="form-label">Year</label>
                                <input type="number" class="form-control" name="year" id="year" required
                                    placeholder="Input Year">
                            </div>
                        </div>
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
                        <input type="hidden" name="property_investment_id" id="" value="{{ $id }}">
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
                        <th>Date</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Net Profit</th>
                        <th>Status</th>
                        <th>Profit</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $months = [
                            1 => 'January',
                            2 => 'February',
                            3 => 'March',
                            4 => 'April',
                            5 => 'May',
                            6 => 'June',
                            7 => 'July',
                            8 => 'August',
                            9 => 'September',
                            10 => 'October',
                            11 => 'November',
                            12 => 'December',
                        ];
                    @endphp

                    @foreach ($data as $item)
                        <tr>
                            <td>{{ $months[$item->month] ?? 'Unknown' }} {{ $item->year }}</td>
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
                                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#distribute{{ $item->id }}" @disabled($plan['total'] <= 0)>
                                        <i class="bx bx-wallet"></i> Bagikan Profit
                                    </button>
                                    @if ($plan['total'] <= 0)
                                        <div class="small text-muted">
                                            {{ $plan['net_profit'] <= 0 ? 'Net profit harus lebih dari 0' : 'Belum ada investor' }}
                                        </div>
                                    @endif
                                    <div class="modal fade" id="distribute{{ $item->id }}" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Bagikan Profit {{ $months[$item->month] ?? '' }} {{ $item->year }}</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <form action="{{ route('admin.financials.distribute', [$item->id, $id]) }}" method="POST">
                                                    @csrf
                                                    <div class="modal-body">
                                                        <p class="mb-2">
                                                            Rp {{ number_format($plan['total'], 0, ',', '.') }} akan masuk ke wallet
                                                            {{ $plan['shares']->count() }} investor, sesuai porsi lot yang mereka pegang saat ini.
                                                        </p>
                                                        @if ($plan['undistributed'] > 0)
                                                            <p class="small text-muted mb-2">
                                                                Rp {{ number_format($plan['undistributed'], 0, ',', '.') }} dari net profit
                                                                Rp {{ number_format($plan['net_profit'], 0, ',', '.') }} tidak dibagikan
                                                                (porsi lot yang belum terjual + pembulatan).
                                                            </p>
                                                        @endif
                                                        <table class="table table-sm mb-2">
                                                            <thead>
                                                                <tr><th>Investor</th><th class="text-end">Lot</th><th class="text-end">Profit</th></tr>
                                                            </thead>
                                                            <tbody>
                                                                @foreach ($plan['shares'] as $share)
                                                                    <tr>
                                                                        <td>{{ $investorNames[$share['user_id']] ?? '#' . $share['user_id'] }}</td>
                                                                        <td class="text-end">{{ number_format($share['lot'], 0, ',', '.') }}</td>
                                                                        <td class="text-end">Rp {{ number_format($share['amount'], 0, ',', '.') }}</td>
                                                                    </tr>
                                                                @endforeach
                                                            </tbody>
                                                        </table>
                                                        <p class="small text-danger mb-0">
                                                            Tidak bisa dibatalkan. Setelah dibagikan, laporan ini tidak bisa diubah atau dihapus.
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
                                            <form action="{{ route('admin.financials.update', [$item->id, $id]) }}"
                                                method="POST">
                                                @csrf
                                                <div class="modal-body">
                                                    <div class="row g-2">
                                                        <div class="col mb-3">
                                                            <label for="month" class="form-label">Month</label>
                                                            <select name="month" class="form-control" required
                                                                id="month">
                                                                <option value="">-Select Month-</option>
                                                                <option value="1"
                                                                    @if ($item->month == 1) selected @endif>
                                                                    January</option>
                                                                <option value="2"
                                                                    @if ($item->month == 2) selected @endif>
                                                                    February</option>
                                                                <option value="3"
                                                                    @if ($item->month == 3) selected @endif>March
                                                                </option>
                                                                <option value="4"
                                                                    @if ($item->month == 4) selected @endif>April
                                                                </option>
                                                                <option value="5"
                                                                    @if ($item->month == 5) selected @endif>May
                                                                </option>
                                                                <option value="6"
                                                                    @if ($item->month == 6) selected @endif>June
                                                                </option>
                                                                <option value="7"
                                                                    @if ($item->month == 7) selected @endif>July
                                                                </option>
                                                                <option value="8"
                                                                    @if ($item->month == 8) selected @endif>August
                                                                </option>
                                                                <option value="9"
                                                                    @if ($item->month == 9) selected @endif>
                                                                    September</option>
                                                                <option value="10"
                                                                    @if ($item->month == 10) selected @endif>
                                                                    October</option>
                                                                <option value="11"
                                                                    @if ($item->month == 11) selected @endif>
                                                                    November</option>
                                                                <option value="12"
                                                                    @if ($item->month == 12) selected @endif>
                                                                    December</option>
                                                            </select>
                                                        </div>
                                                        <div class="col mb-3">
                                                            <label for="year" class="form-label">Year</label>
                                                            <input type="number" class="form-control" name="year"
                                                                id="year" required placeholder="Input Year"
                                                                value="{{ $item->year }}">
                                                        </div>
                                                    </div>
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
                                                    <input type="hidden" name="property_investment_id" id=""
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
                                <a href="{{ route('admin.financials.destroy',[$item->id,$id]) }}" class="btn btn-danger mb-2 btn-sm"><i class="bx bx-trash"></i></a>
                                @endunless
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
