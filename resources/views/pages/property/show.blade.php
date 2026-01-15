@extends('layouts.app')
@section('content')
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-12">
                    <table class="table">
                        <tr>
                            <th style="width: 15%">Property Name</th>
                            <th style="width: 5%">:</th>
                            <th>{{ $data->property_name }}</th>
                        </tr>
                        <tr>
                            <th>Property Location</th>
                            <th>:</th>
                            <th>{{ $data->property_location }}</th>
                        </tr>
                        <tr>
                            <th>Bedroom</th>
                            <th>:</th>
                            <th>{{ $data->bedroom }}</th>
                        </tr>
                        <tr>
                            <th>Bathroom</th>
                            <th>:</th>
                            <th>{{ $data->bathroom }}</th>
                        </tr>
                        <tr>
                            <th>Land Area</th>
                            <th>:</th>
                            <th>{{ $data->land_area }} m²</th>
                        </tr>
                        <tr>
                            <th>Building Area</th>
                            <th>:</th>
                            <th>{{ $data->building_area }} m²</th>
                        </tr>
                        <tr>
                            <th>Listing</th>
                            <th>:</th>
                            <th>
                                <a href="{{ $data->listing_url }}" target="_blank" class="btn btn-primary btn-sm">Visit
                                    Listing</a>
                            </th>
                        </tr>
                        <tr>
                            <th>Images</th>
                            <th>:</th>
                            <th>
                                @foreach ($images as $img)
                                    <img src="{{ Storage::url($img->image_url) }}" alt="{{ $img->image_url }}" style="width: 50px">
                                @endforeach
                            </th>
                        </tr>
                        <tr>
                            <th>Documents</th>
                            <th>:</th>
                            <th>
                                @foreach ($docs as $docs)
                                    <a href="{{ Storage::url($docs->document_url) }}" target="_blank"
                                        class="btn btn-primary btn-sm"><i class="bx bx-file"></i>
                                        {{ $docs->document_name }}</a>
                                @endforeach
                            </th>
                        </tr>
                    </table>
                    <a href="{{ route('admin.properties') }}" class="btn btn-secondary mt-2">Back</a>
                </div>
            </div>
        </div>
    </div>
@endsection
