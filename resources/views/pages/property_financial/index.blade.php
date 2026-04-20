@extends('layouts.app')
@section('content')
    <div class="card">
        <div class="card-header">
            <table id="propertiesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Property Name</th>
                        <th>Property Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $no=1;
                    @endphp
                    @foreach ($data as $data)
                        <tr>
                            <td>{{ $no++ }}</td>
                            <td>{{ $data->property->property_name }}</td>
                            <td>{{ $data->property->property_location }}</td>
                            <td><a href="{{ route('admin.financials.show',$data->id) }}" class="btn btn-primary btn-sm">Financials</a></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
