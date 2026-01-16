@extends('layouts.app')

@section('content')
<form id="developerForm" action="{{ $action }}" method="POST" enctype="multipart/form-data">
    @csrf

    {{-- BASIC INFORMATION --}}
    <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white fw-semibold">
            Developer Information
        </div>

        <div class="card-body p-4">
            <div class="row g-3">

                <div class="col-md-6">
                    <label class="form-label fw-medium">Developer Name</label>
                    <input
                        type="text"
                        class="form-control"
                        name="name"
                        id="name"
                        placeholder="e.g. John Doe"
                        value="{{ $btn == 'edit' ? $data->name : '' }}"
                    >
                    <small class="text-danger error" id="error-name"></small>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-medium">Phone Number</label>
                    <input
                        type="text"
                        class="form-control"
                        name="phone"
                        id="phone"
                        placeholder="+628123456789"
                        value="{{ $btn == 'edit' ? $data->phone : '' }}"
                    >
                    <small class="text-danger error" id="error-phone"></small>
                </div>

            </div>

            <hr class="my-4">

            <h6 class="fw-semibold mb-3">Social Media Links</h6>

            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">YouTube</label>
                    <input
                        type="text"
                        class="form-control"
                        name="youtube_url"
                        id="youtube_url"
                        placeholder="https://youtube.com/..."
                        value="{{ $btn == 'edit' ? $data->youtube_url : '' }}"
                    >
                    <small class="text-danger error" id="error-youtube_url"></small>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Facebook</label>
                    <input
                        type="text"
                        class="form-control"
                        name="facebook_url"
                        id="facebook_url"
                        placeholder="https://facebook.com/..."
                        value="{{ $btn == 'edit' ? $data->facebook_url : '' }}"
                    >
                    <small class="text-danger error" id="error-facebook_url"></small>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Instagram</label>
                    <input
                        type="text"
                        class="form-control"
                        name="instagram_url"
                        id="instagram_url"
                        placeholder="https://instagram.com/..."
                        value="{{ $btn == 'edit' ? $data->instagram_url : '' }}"
                    >
                    <small class="text-danger error" id="error-instagram_url"></small>
                </div>

                <div class="col-md-6">
                    <label class="form-label">TikTok</label>
                    <input
                        type="text"
                        class="form-control"
                        name="tiktok_url"
                        id="tiktok_url"
                        placeholder="https://tiktok.com/@..."
                        value="{{ $btn == 'edit' ? $data->tiktok_url : '' }}"
                    >
                    <small class="text-danger error" id="error-tiktok_url"></small>
                </div>
            </div>

            <div class="mt-4">
                <label class="form-label fw-medium">Description</label>
                <textarea
                    name="description"
                    id="description"
                    rows="5"
                    class="form-control"
                    placeholder="Short description about the developer..."
                >{{ $btn == 'edit' ? $data->description : '' }}</textarea>
                <small class="text-danger error" id="error-description"></small>
            </div>

            <div class="mt-4">
                <label class="form-label fw-medium">Status</label>
                <select name="status" class="form-select">
                    <option value="draft" {{ $btn == 'edit' && $data->status === 'draft' ? 'selected' : '' }}>
                        Draft
                    </option>
                    <option value="published" {{ $btn == 'edit' && $data->status === 'published' ? 'selected' : '' }}>
                        Published
                    </option>
                </select>
            </div>
        </div>
    </div>

    {{-- IMAGE --}}
    <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white fw-semibold">
            Profile Image
        </div>

        <div class="card-body p-4">
            @if ($btn == 'edit' && $data->image_path)
                <div class="mb-4 text-center">
                    <img
                        src="{{ Storage::url($data->image_path) }}"
                        class="rounded-3 shadow-sm mb-2"
                        style="max-width: 180px;"
                    >
                </div>
            @endif

            <label class="form-label fw-medium">Upload New Image</label>
            <input
                type="file"
                name="image"
                id="image"
                class="form-control"
                accept="image/*"
            >
            <small class="text-danger error" id="error-image"></small>
        </div>
    </div>

    {{-- ERRORS --}}
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- ACTIONS --}}
    <div class="d-flex gap-2">
        <button class="btn btn-primary px-4" type="submit">
            {{ $btn === 'edit' ? 'Update Developer' : 'Create Developer' }}
        </button>

        <a href="{{ route('admin.developers') }}" class="btn btn-outline-secondary">
            Cancel
        </a>
    </div>

</form>
@endsection


@push('scripts')
    <script>
        document.getElementById('developerForm').addEventListener('submit', function (e) {
            let isValid = true;

            // Clear old errors
            document.querySelectorAll('.error').forEach(el => el.textContent = '');

            // Helpers
            const showError = (id, message) => {
                document.getElementById('error-' + id).textContent = message;
                isValid = false;
            };

            const isValidUrl = (url) => {
                try {
                    new URL(url);
                    return true;
                } catch (_) {
                    return false;
                }
            };

            // Fields
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();

            const links = [
                { id: 'youtube_url', label: 'YouTube' },
                { id: 'facebook_url', label: 'Facebook' },
                { id: 'instagram_url', label: 'Instagram' },
                { id: 'tiktok_url', label: 'TikTok' }
            ];

            // Name validation
            if (!name) {
                showError('name', 'Developer name is required.');
            }

            // Phone validation
            const phoneRegex = /^\+?[0-9]+$/;

            if (!phone) {
                showError('phone', 'Phone number is required.');
            } else if (!phoneRegex.test(phone)) {
                showError('phone', 'Only numbers and optional (+) allowed.');
            } else if (phone.length > 14) {
                showError('phone', 'Phone number must not exceed 14 characters.');
            }

            // Links validation
            links.forEach(link => {
                const value = document.getElementById(link.id).value.trim();
                if (value && !isValidUrl(value)) {
                    showError(link.id, `${link.label} link must be a valid URL.`);
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    </script>
@endpush