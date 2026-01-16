<?php

namespace App\Traits;
use Yajra\DataTables\Facades\DataTables;

trait AdminDataTable
{
    protected function dataTable($query, $actionView)
    {
        return DataTables::eloquent($query)
            ->addIndexColumn()
            
            ->editColumn('discount_percent', function ($row) {
                if (!isset($row->discount_percent)) {
                    return '-';
                }

                return $row->discount_percent
                    ? rtrim(rtrim($row->discount_percent, '0'), '.') . '%'
                    : '-';
            })

            ->editColumn('start_date', function ($row) {
                if (!isset($row->start_date)) {
                    return '-';
                }

                return $row->start_date
                    ? \Carbon\Carbon::parse($row->start_date)->format('d M Y')
                    : '-';
            })

            ->editColumn('end_date', function ($row) {
                if (!isset($row->end_date)) {
                    return '-';
                }

                return $row->end_date
                    ? \Carbon\Carbon::parse($row->end_date)->format('d M Y')
                    : '-';
            })

            ->addColumn('action', fn ($row) =>
                view($actionView, compact('row'))
            )
            ->rawColumns(['action'])
            ->make(true);
    }
}
