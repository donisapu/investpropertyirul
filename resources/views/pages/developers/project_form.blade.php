@extends('layouts.app')
@section('content')

    <form action="{{ $action }}" method="POST" enctype="multipart/form-data">
        @if (session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        @csrf
        <div class="card">
            <div class="card-header h5">{{ $title }}</div>
            <div class="card-body">

                <div class="mb-3">
                    <label for="" class="form-label">Project Name</label>
                    <input type="text" class="form-control" name="title" placeholder="Title" id=""
                        @if ($btn == 'edit') value="{{ $data->title }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Project Banner</label>
                    <input type="file" name="banner_image" class="form-control" id="">
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Project Location</label>
                    <input type="text" class="form-control" name="location" placeholder="Project Location" id=""
                        @if ($btn == 'edit') value="{{ $data->location }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Description 1</label>
                    <textarea name="description" class="form-control" placeholder="Project Description" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->description }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Description 2</label>
                    <textarea name="description_1" class="form-control" placeholder="Project Description" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->description_1 }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Description 3</label>
                    <textarea name="description_2" class="form-control" placeholder="Project Description" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->description_2 }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Description 4</label>
                    <textarea name="description_3" class="form-control" placeholder="Project Description" id="" cols="30"
                        rows="10">
@if ($btn == 'edit')
{{ $data->description_3 }}
@endif
</textarea>
                </div>
                <div class="mb-3">
                    <label for="">Project Highlight</label>
                    <input type="file" name="highlight_path" class="form-control" id="">
                </div>
                <div class="mb-3">
                    <label for="">Project Highlight 2</label>
                    <input type="file" name="highlight_1_path" class="form-control" id="">
                </div>
                {{-- YOUTUBE VIDEO --}}
                <div class="col-md-12">
                    <label class="form-label fw-medium">YouTube Video</label>

                    <input type="url" name="youtube_url" id="youtubeInput" class="form-control"
                        @if ($btn == 'edit') value="{{ $data->youtube_url }}" @endif
                        placeholder="https://www.youtube.com/watch?v=...">
                    <small class="text-danger error" id="error-youtubeInput"></small>

                    <div class="ratio ratio-16x9 mt-3 d-none" id="youtubePreviewWrapper">
                        <iframe id="youtubePreview" src="" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Url Map</label>
                    <input type="text" class="form-control" name="maps_url" placeholder="Embed url map" id=""
                        @if ($btn == 'edit') value="{{ $data->maps_url }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Type</label>
                    <input type="text" name="type" class="form-control" id=""
                        @if ($btn == 'edit') value="{{ $data->type }}" @endif>
                </div>
                <div class="mb-3">
                    <label for="">Status</label>
                    <select name="status" class="form-control" id="">
                        <option value="Segera Hadir" @if ($btn == 'edit' && $data->status == 'Segera Hadir') selected @endif>Segera Hadir
                        </option>
                        <option value="Dalam Proses" @if ($btn == 'edit' && $data->status == 'Dalam Proses') selected @endif>Dalam Proses
                        </option>
                        <option value="Selesai" @if ($btn == 'edit' && $data->status == 'Selesai') selected @endif>Selesai</option>
                        <option value="Terjual" @if ($btn == 'edit' && $data->status == 'Terjual') selected @endif>Terjual</option>
                    </select>
                </div>

            </div>
        </div>
        <div class="card mt-3">
            <div class="card-header h5">Project Images</div>
            <div class="card-body">
                {{-- existing images --}}
                @if ($btn == 'edit' && isset($images))
                    <div class="row mb-3">
                        @foreach ($images as $img)
                            <div class="col-3 mb-3 text-center">
                                <img src="{{ Storage::url($img->image_path) }}" class="img-fluid rounded mb-2">
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

        <button class="btn btn-primary mt-3" type="submit">Submit</button>

    </form>
@endsection
@push('scripts')
    <script>
        const imageWrapper = document.getElementById('imageWrapper');

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

        imageWrapper.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-image')) {
                e.target.closest('.image-item').remove();
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-image')) {
                fetch(`/admin/projects-image/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                }).then(() => {
                    e.target.closest('.col-3').remove();
                });
            }
        });

        const ytInput = document.getElementById('youtubeInput');
        const ytPreview = document.getElementById('youtubePreview');
        const ytWrapper = document.getElementById('youtubePreviewWrapper');

        function extractYoutubeId(url) {
            if (!url) return null;

            const regExp =
                /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
            const match = url.match(regExp);

            return match ? match[1] : null;
        }

        function isValidYoutube(url) {
            return !!extractYoutubeId(url);
        }

        function updateYoutubePreview() {
            const videoId = extractYoutubeId(ytInput.value);

            if (videoId) {
                ytPreview.src = `https://www.youtube.com/embed/${videoId}`;
                ytWrapper.classList.remove('d-none');
            } else {
                ytPreview.src = '';
                ytWrapper.classList.add('d-none');
            }
        }

        ytInput.addEventListener('input', updateYoutubePreview);

        // Auto-load preview on edit page
        updateYoutubePreview();

        // YouTube
        const yt = document.getElementById('youtubeInput')?.value.trim();
        if (yt && !isValidYoutube(yt)) {
            showError('youtube_url', 'Invalid YouTube URL.');
            isValid = false;
        }
    </script>
@endpush
