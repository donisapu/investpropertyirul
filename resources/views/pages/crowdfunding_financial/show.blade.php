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
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
