@extends('layouts.app')

@section('content')
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white fw-semibold">
            Landing Settings
        </div>

        <form id="websiteSettingForm" action="{{ route('admin.landing-settings.update') }}" method="POST"
            enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="card-body p-4">
                <div class="row g-4">
                    {{-- LOGO --}}
                    <div class="col-md-12">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label fw-medium mb-0">Hero Image</label>
                            <span class="badge bg-light text-secondary border fw-normal" data-bs-toggle="tooltip"
                                title="Dimensi ideal untuk tampilan Desktop & Mobile">
                                Max: 10MB | 1920x1280px
                            </span>
                        </div>

                        {{-- ID diubah jadi heroDropzone --}}
                        <div id="heroDropzone" class="border rounded-3 p-3 text-center position-relative"
                            style="cursor:pointer; border-style:dashed; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:150px;">
                            <input type="file" name="hero_path" id="heroInput" class="d-none" accept="image/*">

                            <img id="heroPreview" src="{{ $setting->hero_path ? Storage::url($setting->hero_path) : '' }}"
                                class="img-fluid rounded mb-2"
                                style="{{ $setting->hero_path ? '' : 'display:none;' }} max-height:120px;">

                            {{-- ID diubah jadi heroDropText --}}
                            <div id="heroDropText" class="text-muted"
                                style="{{ $setting->hero_path ? 'display:none;' : '' }}">
                                <strong>Drag & drop</strong> or click to upload Hero
                            </div>
                        </div>
                        <small class="text-danger error" id="error-heroInput"></small>
                    </div>

                    <div class="col-md-12">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label fw-medium mb-0">Location Mapping</label>
                            <span class="badge bg-light text-secondary border fw-normal" data-bs-toggle="tooltip"
                                title="Dimensi ideal untuk tampilan Desktop & Mobile">
                                Max: 10MB | 1920x1280px
                            </span>
                        </div>

                        {{-- ID diubah jadi mappingDropzone --}}
                        <div id="mappingDropzone" class="border rounded-3 p-3 text-center position-relative"
                            style="cursor:pointer; border-style:dashed; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:150px;">
                            {{-- ID dibenarkan jadi mappingInput --}}
                            <input type="file" name="mapping_path" id="mappingInput" class="d-none" accept="image/*">

                            {{-- ID dibenarkan jadi mappingPreview --}}
                            <img id="mappingPreview"
                                src="{{ $setting->mapping_path ? Storage::url($setting->mapping_path) : '' }}"
                                class="img-fluid rounded mb-2"
                                style="{{ $setting->mapping_path ? '' : 'display:none;' }} max-height:120px;">

                            {{-- ID diubah jadi mappingDropText --}}
                            <div id="mappingDropText" class="text-muted"
                                style="{{ $setting->mapping_path ? 'display:none;' : '' }}">
                                <strong>Drag & drop</strong> or click to upload Location Mapping
                            </div>
                        </div>
                        <small class="text-danger error" id="error-mappingInput"></small>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-medium">Header</label>
                        <input type="text" name="header" id="header" class="form-control"
                            value="{{ old('header', $setting->header) }}">

                        @error('header')
                            <small class="text-danger">{{ $message }}</small>
                        @enderror
                        <small class="text-danger error" id="error-header"></small>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-medium">Subheader</label>
                        <input type="text" name="subheader" id="subheader" class="form-control"
                            value="{{ old('subheader', $setting->subheader) }}">

                        @error('subheader')
                            <small class="text-danger">{{ $message }}</small>
                        @enderror
                        <small class="text-danger error" id="error-subheader"></small>
                    </div>

                    <div class="col-12">
                        <label class="form-label fw-medium">Description</label>
                        <textarea id="description" name="description" rows="3" class="form-control">{{ old('description', $setting->description) }}</textarea>
                        <small class="text-danger error" id="error-description"></small>

                    </div>
                    <div class="col-12">
                        <label class="form-label fw-medium">Developer Project Description</label>
                        <textarea id="developer_project_desc" name="developer_project_desc" rows="3" class="form-control">{{ old('developer_project_desc', $setting->developer_project_desc) }}</textarea>
                        <small class="text-danger error" id="error-developer_project_desc"></small>

                    </div>
                    <div class="col-12">
                        <label class="form-label fw-medium">Location Description</label>
                        <textarea id="location_desc" name="location_desc" rows="3" class="form-control">{{ old('location_desc', $setting->location_desc) }}</textarea>
                        <small class="text-danger error" id="error-location_desc"></small>

                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-medium">Location</label>
                        <input type="text" name="location" id="location" class="form-control"
                            value="{{ old('location', $setting->location) }}">

                        @error('location')
                            <small class="text-danger">{{ $message }}</small>
                        @enderror
                        <small class="text-danger error" id="error-location"></small>
                    </div>

                    <div class="col-md-12">
                        <div class="card mt-3">
                            <div class="card-header h5">Landmarks</div>
                            <div class="card-body">

                                {{-- existing documents --}}
                                <ul class="list-group mb-3">
                                    @foreach ($landmark as $landmark)
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <a href="{{ Storage::url($landmark->image_path) }}" target="_blank">
                                                {{ $landmark->name }} ({{ $landmark->distance }})
                                            </a>
                                            <button type="button" class="btn btn-sm btn-danger delete-document"
                                                data-id="{{ $landmark->id }}">
                                                Delete
                                            </button>
                                        </li>
                                    @endforeach
                                </ul>

                                {{-- add new documents --}}
                                <button type="button" class="btn btn-sm btn-primary mb-2" id="addDocument">
                                    + Add Landmark
                                </button>

                                <div id="documentWrapper">
                                    <div class="document-item row mb-2 align-items-center">
                                        <div class="col-3">
                                            <input type="text" name="name[]" class="form-control"
                                                placeholder="Landmark Name">
                                        </div>
                                        <div class="col-3">
                                            <input type="text" name="distance[]" class="form-control"
                                                placeholder="Landmark Distance">
                                        </div>
                                        <div class="col-5">
                                            <input type="file" name="images[]" class="form-control" accept="image/*">
                                        </div>
                                        <div class="col-1">
                                            <button type="button"
                                                class="btn btn-danger btn-sm remove-document">✕</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-medium">Slider Title</label>
                        <input type="text" name="slider_title" id="slider_title" class="form-control"
                            value="{{ old('slider_title', $setting->slider_title) }}">

                        @error('slider_title')
                            <small class="text-danger">{{ $message }}</small>
                        @enderror
                        <small class="text-danger error" id="error-slider_title"></small>
                    </div>

                    <div class="col-md-12">
                        <div class="card mt-3">
                            <div class="card-header h5">Sliders</div>
                            <div class="card-body">

                                {{-- existing documents --}}
                                <ul class="list-group mb-3">
                                    @foreach ($slider as $slider)
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <a href="{{ Storage::url($slider->image_path) }}" target="_blank">Lihat
                                                Gambar
                                            </a>
                                            <button type="button" class="btn btn-sm btn-danger delete-image"
                                                data-id="{{ $slider->id }}">
                                                Delete
                                            </button>
                                        </li>
                                    @endforeach
                                </ul>

                                {{-- add new documents --}}
                                <button type="button" class="btn btn-sm btn-primary mb-2" id="addImage">
                                    + Add Image
                                </button>
                                <small class="text-muted ms-2 d-inline-block">
                                    *Maks. ukuran gambar: 10MB (Rekomendasi: 1920x1280, JPG/PNG)
                                </small>

                                <div id="imageWrapper">
                                    <div class="document-item row mb-2 align-items-center">
                                        <div class="col-5">
                                            <input type="file" name="sliders[]" class="form-control"
                                                accept="image/*">
                                        </div>
                                        <div class="col-1">
                                            <button type="button"
                                                class="btn btn-danger btn-sm remove-document">✕</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {{-- ACTION --}}
            <div class="card-footer bg-white text-end">
                <button type="submit" class="btn btn-primary">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
@endsection

@push('scripts')
    <script>
        // Fungsi helper untuk setup individual dropzone supaya kode gak duplikat gila-gilaan
        function setupDropzone(dropzoneId, inputId, previewId, textId) {
            const dropzone = document.getElementById(dropzoneId);
            const input = document.getElementById(inputId);
            const preview = document.getElementById(previewId);
            const text = document.getElementById(textId);

            if (!dropzone || !input) return;

            dropzone.addEventListener('click', () => input.click());

            input.addEventListener('change', () => {
                showPreview(input.files[0], preview, text);
            });

            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('bg-light');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('bg-light');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('bg-light');

                const file = e.dataTransfer.files[0];
                input.files = e.dataTransfer.files;
                showPreview(file, preview, text);
            });
        }

        function showPreview(file, previewElement, textElement) {
            if (!file || !file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
                if (textElement) textElement.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }

        // Jalankan pasang dropzone untuk Hero dan Mapping secara terpisah
        setupDropzone('heroDropzone', 'heroInput', 'heroPreview', 'heroDropText');
        setupDropzone('mappingDropzone', 'mappingInput', 'mappingPreview', 'mappingDropText');


        // ================= LOGIK HANDLING FORM & LANDMARK =================
        const form = document.getElementById('websiteSettingForm');
        form.addEventListener('submit', function(e) {
            let isValid = true;
            if (!isValid) {
                e.preventDefault();
            } else {
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerText = 'Saving...';
            }
        });

        const documentWrapper = document.getElementById('documentWrapper');
        document.getElementById('addDocument').addEventListener('click', function() {
            const count = documentWrapper.querySelectorAll('.document-item').length;
            if (count >= 10) return;

            const div = document.createElement('div');
            div.className = 'document-item row mb-2 align-items-center';
            div.innerHTML = `
            <div class="col-3">
                <input type="text" name="name[]" class="form-control" placeholder="Landmark Name">
            </div>
            <div class="col-3">
                <input type="text" name="distance[]" class="form-control" placeholder="Landmark Distance">
            </div>
            <div class="col-5">
                <input type="file" name="images[]" class="form-control" accept="image/*">
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-danger btn-sm remove-document">✕</button>
            </div>
        `;
            documentWrapper.appendChild(div);
        });

        documentWrapper.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-document')) {
                e.target.closest('.document-item').remove();
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-document')) {
                fetch(`/admin/landmark/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                }).then((response) => {
                    if (response.ok) {
                        e.target.closest('.list-group-item').remove();
                    }
                });
            }
        });

        const imageWrapper = document.getElementById('imageWrapper');
        document.getElementById('addImage').addEventListener('click', function() {
            const count = imageWrapper.querySelectorAll('.image-item').length;
            if (count >= 10) return;

            const div = document.createElement('div');
            div.className = 'image-item row mb-2 align-items-center';
            div.innerHTML = `
            <div class="col-5">
                <input type="file" name="sliders[]" class="form-control" accept="image/*">
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-danger btn-sm remove-image">✕</button>
            </div>
        `;
            imageWrapper.appendChild(div);
        });

        imageWrapper.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-image')) {
                e.target.closest('.image-item').remove();
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-image')) {
                fetch(`/admin/slider/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                }).then((response) => {
                    if (response.ok) {
                        e.target.closest('.list-group-item').remove();
                    }
                });
            }
        });
    </script>
@endpush
