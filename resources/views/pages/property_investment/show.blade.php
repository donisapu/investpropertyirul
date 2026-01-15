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
                            <th>{{ $data->property->property_name }}</th>
                        </tr>
                        <tr>
                            <th>Property Location</th>
                            <th>:</th>
                            <th>{{ $data->property->property_location }}</th>
                        </tr>
                        <tr>
                            <th>Bedroom</th>
                            <th>:</th>
                            <th>{{ $data->property->bedroom }}</th>
                        </tr>
                        <tr>
                            <th>Bathroom</th>
                            <th>:</th>
                            <th>{{ $data->property->bathroom }}</th>
                        </tr>
                        <tr>
                            <th>Land Area</th>
                            <th>:</th>
                            <th>{{ $data->property->land_area }} m²</th>
                        </tr>
                        <tr>
                            <th>Building Area</th>
                            <th>:</th>
                            <th>{{ $data->property->building_area }} m²</th>
                        </tr>
                        <tr>
                            <th>Listing</th>
                            <th>:</th>
                            <th>
                                <a href="{{ $data->property->listing_url }}" target="_blank" class="btn btn-primary btn-sm">Visit
                                    Listing</a>
                            </th>
                        </tr>
                        <tr>
                            <th>Property Value</th>
                            <th>:</th>
                            <th>{{ number_format($data->property_value) }}</th>
                        </tr>
                        <tr>
                            <th>Total Lot</th>
                            <th>:</th>
                            <th>{{ number_format($data->total_lot) }}</th>
                        </tr>
                        <tr>
                            <th>Price Per Lot</th>
                            <th>:</th>
                            <th>{{ number_format($data->price_perlot) }}</th>
                        </tr>
                        <tr>
                            <th>Minimum Lot Size</th>
                            <th>:</th>
                            <th>{{ number_format($data->min_lot_size) }}</th>
                        </tr>
                        <tr>
                            <th>Maximum Lot Size</th>
                            <th>:</th>
                            <th>{{ number_format($data->max_lot_size) }}</th>
                        </tr>
                        <tr>
                            <th>Estimated ROI</th>
                            <th>:</th>
                            <th>{{ $data->estimated_roi }}%</th>
                        </tr>
                        <tr>
                            <th>ROI Period</th>
                            <th>:</th>
                            <th>{{ $data->roi_period }}</th>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <th>:</th>
                            <th>{{ $data->status }}</th>
                        </tr>
                        <tr>
                            <th>Images</th>
                            <th>:</th>
                            <th>
                                @foreach ($img as $img)
                                    <img src="{{ Storage::url($img->image_url) }}" alt="{{ $img->image_url }}" style="width: 50px">
                                @endforeach
                            </th>
                        </tr>
                        <tr>
                            <th>Documents</th>
                            <th>:</th>
                            <th>
                                @foreach ($doc as $docs)
                                    <a href="{{ Storage::url($docs->document_url) }}" target="_blank"
                                        class="btn btn-primary btn-sm"><i class="bx bx-file"></i>
                                        {{ $docs->document_name }}</a>
                                @endforeach
                            </th>
                        </tr>
                    </table>
                    <a href="{{ route('admin.investment-properties') }}" class="btn btn-secondary mt-2">Back</a>
                </div>
            </div>
        </div>
    </div>
@endsection
