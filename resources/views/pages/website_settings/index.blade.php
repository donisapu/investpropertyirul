@extends('layouts.app')

@section('content')
<div class="container-fluid">

    <div class="card shadow-sm border-0">
        <div class="card-header bg-white fw-semibold">
            Website Settings
        </div>

        <form 
            id="websiteSettingForm"
            action="{{ route('admin.website-settings.update') }}" 
            method="POST" 
            enctype="multipart/form-data"
        >
            @csrf
            @method('PUT')

            <div class="card-body p-4">
                <div class="row g-4">
                        {{-- LOGO --}}
                    <div class="col-md-12">
                        <label class="form-label fw-medium">Website Logo</label>

                        <div 
                            id="dropzone"
                            class="border rounded-3 p-3 text-center position-relative"
                            style="cursor:pointer; border-style:dashed; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:150px;"
                        >
                            <input 
                                type="file" 
                                name="logo" 
                                id="logoInput"
                                class="d-none"
                                accept="image/*"
                            >

                            <img 
                                id="logoPreview"
                                src="{{ $setting->logo_url }}"
                                class="img-fluid rounded mb-2"
                                style="{{ $setting->logo_url ? '' : 'display:none;' }} max-height:120px;"
                            >

                            <div id="dropText" class="text-muted">
                                <strong>Drag & drop</strong> or click to upload logo
                            </div>
                        </div>
                        <small class="text-danger error" id="error-logoInput"></small>

                        @error('logo')
                            <small class="text-danger">{{ $message }}</small>
                        @enderror
                    </div>

                    {{-- BASIC INFO --}}
                    <div class="col-md-12">
                        <label class="form-label fw-medium">Website Name</label>
                        <input
                            type="text"
                            name="site_name"
                            id="site_name"
                            class="form-control"
                            value="{{ old('site_name', $setting->site_name) }}"
                        >

                        @error('site_name')
                            <small class="text-danger">{{ $message }}</small>
                        @enderror
                        <small class="text-danger error" id="error-site_name"></small>

                    </div>

                    <div class="col-12">
                        <label class="form-label fw-medium">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            class="form-control"
                        >{{ old('description', $setting->description) }}</textarea>
                        <small class="text-danger error" id="error-description"></small>

                    </div>

                    {{-- ADDRESS --}}
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            rows="2"
                            class="form-control"
                        >{{ old('address', $setting->address) }}</textarea>
                        <small class="text-danger error" id="error-address"></small>

                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">Location (Google Maps Link)</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            class="form-control"
                            value="{{ old('location', $setting->location) }}"
                        >
                        <small class="text-danger error" id="error-location"></small>
                    </div>

                    {{-- CONTACT --}}
                    <div class="col-md-6">
                        <label class="form-label fw-medium">WhatsApp</label>
                        <input
                            type="text"
                            id="whatsapp"
                            name="whatsapp"
                            class="form-control"
                            placeholder="628123xxxx"
                            value="{{ old('whatsapp', $setting->whatsapp) }}"
                        >
                        <small class="text-danger error" id="error-whatsapp"></small>

                    </div>

                    {{-- SOCIAL MEDIA --}}
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Instagram</label>
                        <input
                            type="url"
                            id="instagram_url"
                            name="instagram_url"
                            class="form-control"
                            value="{{ old('instagram_url', $setting->instagram_url) }}"
                        >
                        <small class="text-danger error" id="error-instagram_url"></small>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">TikTok</label>
                        <input
                            type="url"
                            name="tiktok_url"
                            id="tiktok_url"
                            class="form-control"
                            value="{{ old('tiktok_url', $setting->tiktok_url) }}"
                        >
                        <small class="text-danger error" id="error-tiktok_url"></small>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">LinkedIn</label>
                        <input
                            type="url"
                            id="linkedin_url"
                            name="linkedin_url"
                            class="form-control"
                            value="{{ old('linkedin_url', $setting->linkedin_url) }}"
                        >
                        <small class="text-danger error" id="error-linkedin_url"></small>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">Facebook</label>
                        <input
                            type="url"
                            id="facebook_url"
                            name="facebook_url"
                            class="form-control"
                            value="{{ old('facebook_url', $setting->facebook_url) }}"
                        >
                        <small class="text-danger error" id="error-facebook_url"></small>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">YouTube Channel</label>
                        <input
                            type="url"
                            name="id"
                            name="youtube_url"
                            class="form-control"
                            value="{{ old('youtube_url', $setting->youtube_url) }}"
                        >
                        <small class="text-danger error" id="error-youtube_url"></small>
                    </div>

                    {{-- YOUTUBE VIDEO --}}
                    <div class="col-md-6">
                        <label class="form-label fw-medium">YouTube Video</label>

                        <input
                            type="url"
                            name="youtube_video_url"
                            id="youtubeInput"
                            class="form-control"
                            value="{{ old('youtube_video_url', $setting->youtube_video_url) }}"
                            placeholder="https://www.youtube.com/watch?v=..."
                        >
                        <small class="text-danger error" id="error-youtubeInput"></small>

                        <div class="ratio ratio-16x9 mt-3 d-none" id="youtubePreviewWrapper">
                            <iframe
                                id="youtubePreview"
                                src=""
                                allowfullscreen
                            ></iframe>
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

</div>
@endsection

@push('scripts')
<script>
    const dropzone = document.getElementById('dropzone');
    const input = document.getElementById('logoInput');
    const preview = document.getElementById('logoPreview');
    const text = document.getElementById('dropText');

    dropzone.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
        showPreview(input.files[0]);
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
        showPreview(file);
    });

    function showPreview(file) {
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            text.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

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

    const form = document.getElementById('websiteSettingForm');
    form.addEventListener('submit', function(e) {
        // Disable submit button to prevent multiple submissions
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerText = 'Saving...';

        e.preventDefault();

        let isValid = true;
        clearErrors();

        // Website name
        const siteName = document.getElementById('site_name').value.trim();
        if (!siteName) {
            showError('site_name', 'Website name is required.');
            isValid = false;
        }

        // WhatsApp
        const wa = document.getElementById('whatsapp').value.trim();
        if (wa && (!/^\d{8,15}$/.test(wa))) {
            showError('whatsapp', 'WhatsApp must be numeric (8–15 digits).');
            isValid = false;
        }

        // YouTube
        const yt = document.getElementById('youtubeInput')?.value.trim();
        if (yt && !isValidYoutube(yt)) {
            showError('video_url', 'Invalid YouTube URL.');
            isValid = false;
        }

        if (isValid) {
            form.submit();
        } else {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerText = 'Save Changes';
        }
    });

</script>
@endpush