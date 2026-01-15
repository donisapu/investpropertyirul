@extends('layouts.app')
@section('content')
    <form action="{{ $action }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="card">
            <div class="card-header h5">{{ $title }}</div>
            <div class="card-body">

                <div class="mb-3">
                    <label for="" class="form-label">Property Name</label>
                    <input type="text" class="form-control" name="property_name" placeholder="Property Name"
                        id="" @if ($btn == 'edit') value="{{ $data->property_name }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Property Location</label>
                    <input type="text" class="form-control" name="property_location" placeholder="Property Location"
                        id="" @if ($btn == 'edit') value="{{ $data->property_location }}" @endif>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-4">
                            <label for="" class="form-label">Bedroom</label>
                            <input type="number" min="1" class="form-control" name="bedroom" placeholder="Bedroom"
                                id="" @if ($btn == 'edit') value="{{ $data->bedroom }}" @endif>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Bathroom</label>
                            <input type="number" min="1" class="form-control" name="bathroom" placeholder="Bathroom"
                                id="" @if ($btn == 'edit') value="{{ $data->bathroom }}" @endif>
                        </div>
                        <div class="col-4">
                            <label for="" class="form-label">Property Type</label>
                            <select name="property_type" class="form-control" id="">
                                <option value="House" @if ($btn == 'edit' && $data->property_type == 'House') selected @endif>House</option>
                                <option value="Villa" @if ($btn == 'edit' && $data->property_type == 'Villa') selected @endif>Villa</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-6">
                            <label for="" class="form-label">Land Area (m²)</label>
                            <input type="number" class="form-control" name="land_area" id=""
                                placeholder="Land Area in m²"
                                @if ($btn == 'edit') value="{{ $data->land_area }}" @endif>
                        </div>
                        <div class="col-6">
                            <label for="" class="form-label">Building Area (m²)</label>
                            <input type="number" class="form-control" name="building_area" id=""
                                placeholder="Building Area in m²"
                                @if ($btn == 'edit') value="{{ $data->building_area }}" @endif>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Listing Url</label>
                    <textarea name="listing_url" class="form-control" placeholder="Lising Url on Airbnb etc (optional)" id=""
                        cols="30" rows="2">
@if ($btn == 'edit')
{{ $data->listing_url }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Detail</label>
                    <textarea name="detail" class="form-control" placeholder="Property Detail" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->detail }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Financial</label>
                    <textarea name="financial" class="form-control" placeholder="Property Financial" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->financial }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Market</label>
                    <textarea name="market" class="form-control" placeholder="Property Market" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->market }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Timeline</label>
                    <textarea name="timeline" class="form-control" placeholder="Property Timeline" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->timeline }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Url Map</label>
                    <input type="text" class="form-control" name="map_url" placeholder="Embed url map"
                        id="" @if ($btn == 'edit') value="{{ $data->map_url }}" @endif>
                </div>

            </div>
        </div>
        <div class="card mt-3">
            <div class="card-header h5">Property Images</div>
            <div class="card-body">

                {{-- existing images --}}
                @if ($btn == 'edit' && isset($images))
                    <div class="row mb-3">
                        @foreach ($images as $img)
                            <div class="col-3 mb-3 text-center">
                                <img src="{{ Storage::url($img->image_url) }}" class="img-fluid rounded mb-2">
                                <button type="button" class="btn btn-sm btn-danger delete-image"
                                    data-id="{{ $img->id }}">
                                    Delete
                                </button>
                            </div>
                        @endforeach
                    </div>
                @endif

                {{-- add new images --}}
                <button type="button" class="btn btn-sm btn-primary mb-2" id="addImage">
                    + Add Image
                </button>

                <div id="imageWrapper">
                    <div class="image-item mb-2 d-flex gap-2">
                        <input type="file" name="images[]" class="form-control" accept="image/*">
                        <button type="button" class="btn btn-danger btn-sm remove-image">✕</button>
                    </div>
                </div>
            </div>
        </div>


        <div class="card mt-3">
            <div class="card-header h5">Property Documents</div>
            <div class="card-body">

                {{-- existing documents --}}
                @if ($btn == 'edit' && isset($docs))
                    <ul class="list-group mb-3">
                        @foreach ($docs as $doc)
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <a href="{{ Storage::url($doc->document_url) }}" target="_blank">
                                    {{ $doc->document_name }}
                                </a>
                                <button type="button" class="btn btn-sm btn-danger delete-document"
                                    data-id="{{ $doc->id }}">
                                    Delete
                                </button>
                            </li>
                        @endforeach
                    </ul>
                @endif

                {{-- add new documents --}}
                <button type="button" class="btn btn-sm btn-primary mb-2" id="addDocument">
                    + Add Document
                </button>

                <div id="documentWrapper">
                    <div class="document-item row mb-2 align-items-center">
                        <div class="col-5">
                            <input type="text" name="document_names[]" class="form-control"
                                placeholder="Document Name">
                        </div>
                        <div class="col-6">
                            <input type="file" name="documents[]" class="form-control">
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn-danger btn-sm remove-document">✕</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn btn-primary mt-3" type="submit">Submit</button>

    </form>
@endsection
@push('scripts')
    <script>
        const imageWrapper = document.getElementById('imageWrapper');
        const documentWrapper = document.getElementById('documentWrapper');

        document.getElementById('addImage').addEventListener('click', function() {
            const count = imageWrapper.querySelectorAll('.image-item').length;
            if (count >= 6) return;

            const div = document.createElement('div');
            div.className = 'image-item mb-2 d-flex gap-2';
            div.innerHTML = `
            <input type="file" name="images[]" class="form-control" accept="image/*">
            <button type="button" class="btn btn-danger btn-sm remove-image">✕</button>
        `;
            imageWrapper.appendChild(div);
        });

        document.getElementById('addDocument').addEventListener('click', function() {
            const count = documentWrapper.querySelectorAll('.document-item').length;
            if (count >= 4) return;

            const div = document.createElement('div');
            div.className = 'document-item row mb-2 align-items-center';
            div.innerHTML = `
            <div class="col-5">
                <input type="text" name="document_names[]" class="form-control" placeholder="Document Name">
            </div>
            <div class="col-6">
                <input type="file" name="documents[]" class="form-control">
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-danger btn-sm remove-document">✕</button>
            </div>
        `;
            documentWrapper.appendChild(div);
        });

        imageWrapper.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-image')) {
                e.target.closest('.image-item').remove();
            }
        });

        documentWrapper.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-document')) {
                e.target.closest('.document-item').remove();
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-image')) {
                fetch(`/admin/properties-image/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                }).then(() => {
                    e.target.closest('.col-3').remove();
                });
            }

            if (e.target.classList.contains('delete-document')) {
                fetch(`/admin/properties-document/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                }).then(() => {
                    e.target.closest('.list-group-item').remove();
                });
            }
        });
    </script>
@endpush
