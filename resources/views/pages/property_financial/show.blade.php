@extends('layouts.app')
@section('content')
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
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
