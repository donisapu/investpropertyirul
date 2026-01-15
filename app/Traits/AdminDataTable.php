<?php

namespace App\Traits;
use Yajra\DataTables\Facades\DataTables;

trait AdminDataTable
{
    protected function dataTable($query, $actionView)
    {
        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->addColumn('action', fn ($row) =>
                view($actionView, compact('row'))
            )
            ->rawColumns(['action'])
            ->make(true);
    }
}
