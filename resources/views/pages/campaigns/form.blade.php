@extends('layouts.app')

@section('content')
<form id="campaignForm" action="{{ $action }}" method="POST" enctype="multipart/form-data">
    @csrf
    
    {{-- CAMPAIGN DISKON --}}
    <div class="card shadow-sm border-0 mb-4">

        <div class="card-body p-4">
            <div class="row g-3">

                {{-- PROPERTY --}}
                <div class="col-md-6">
                    <label class="form-label fw-medium">Property Name</label>
                    <select name="property_id" class="form-select">
                        <option value="">Select Property...</option>
                        @foreach ($properties as $property)
                            <option value="{{ $property->id }}"
                                {{ old('property_id', $btn === 'edit' ? $data->property_id : '') == $property->id ? 'selected' : '' }}>
                                {{ $property->property_name }}
                            </option>
                        @endforeach
                    </select>
                    <small class="text-danger error" id="error-property_id"></small>
                </div>

                {{-- DISCOUNT TITLE --}}
                <div class="col-md-6">
                    <label class="form-label fw-medium">Discount Title</label>
                    <input
                        type="text"
                        class="form-control"
                        name="title"
                        placeholder="Example: Summer Sale"
                        value="{{ old('title', $btn === 'edit' ? $data->title : '') }}"
                    >
                    <small class="text-danger error" id="error-title"></small>
                </div>

                {{-- BANNER --}}
                <div class="col-12">
                    <label class="form-label fw-medium">Banner</label>

                    @if ($btn === 'edit' && $data->banner_path)
                        <div class="mb-3">
                            <img
                                src="{{ Storage::url($data->banner_path) }}"
                                class="rounded shadow-sm"
                                style="max-width: 300px;"
                                id="existingBanner"
                            >
                        </div>
                    @endif

                    <label class="upload-box w-100 text-center" id="bannerUploadBox">
                        <input type="file" name="banner" id="bannerInput" hidden accept="image/*">

                        <div class="border rounded-3 p-4 text-muted upload-content">
                            <div class="fw-semibold upload-text">
                                Drag & Drop or Browse
                            </div>
                            <small class="file-name d-block mt-1"></small>
                        </div>
                    </label>

                    <small class="text-danger error" id="error-banner"></small>
                </div>


                {{-- DESCRIPTION --}}
                <div class="col-12">
                    <label class="form-label fw-medium">Discount Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        class="form-control"
                        placeholder="Write discount description here..."
                    >{{ old('description', $btn === 'edit' ? $data->description : '') }}</textarea>
                    <small class="text-danger error" id="error-description"></small>
                </div>

                {{-- DISCOUNT --}}
                <div class="col-md-4">
                    <label class="form-label fw-medium">Discount (%)</label>
                    <div class="input-group">
                        <input
                            type="number"
                            name="discount_percent"
                            class="form-control"
                            min="1"
                            max="100"
                            oninput="this.value = Math.min(100, Math.max(1, this.value))"
                            value="{{ old('discount_percent', $btn === 'edit' ? $data->discount_percent : '') }}"
                        >
                        <span class="input-group-text">%</span>
                    </div>
                    <small class="text-danger error" id="error-discount_percent"></small>
                </div>

                {{-- START DATE --}}
                <div class="col-md-4">
                    <label class="form-label fw-medium">Discount Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        id="startDate"
                        class="form-control"
                        value="{{ old('start_date', $btn === 'edit' ? $data->start_date?->format('Y-m-d') : '') }}"
                    >
                    <small class="text-danger error" id="error-start_date"></small>
                </div>

                {{-- END DATE --}}
                <div class="col-md-4">
                    <label class="form-label fw-medium">Discount End Date</label>
                    <input
                        type="date"
                        name="end_date"
                        id="endDate"
                        class="form-control"
                        value="{{ old('end_date', $btn === 'edit' ? $data->end_date?->format('Y-m-d') : '') }}"
                    >
                    <small class="text-danger error" id="error-end_date"></small>
                </div>

                {{-- STATUS --}}
                <div class="col-md-6">
                    <label class="form-label fw-medium">Status</label>
                    <div class="d-flex gap-3">
                        <div class="form-check">
                            <label class="form-check-label">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="status"
                                    value="active"
                                    {{ old('status', $btn === 'edit' ? $data->status : 'active') === 'active' ? 'checked' : '' }}
                                > 
                                Active 
                            </label>
                        </div>

                        <div class="form-check">
                            <label class="form-check-label">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="status"
                                    value="inactive"
                                    {{ old('status', $btn === 'edit' ? $data->status : 'inactive') === 'inactive' ? 'checked' : '' }}
                                >
                                Inactive
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    {{-- ACTIONS --}}
    <div class="d-flex justify-content-between">
        <a href="{{ route('admin.campaigns') }}" class="btn btn-outline-secondary">
            Cancel
        </a>

        <div class="d-flex gap-2">
            <button type="submit" name="action" value="draft" class="btn btn-outline-dark">
                Save Draft
            </button>

            <button type="submit" name="action" value="publish" class="btn btn-success">
                {{ $btn === 'edit' ? 'Update Campaign' : 'Create Campaign' }}
            </button>
        </div>
    </div>
</form>
@endsection

@push('scripts')
    <script>
        const startDateInput = document.getElementById('startDate')
        const endDateInput   = document.getElementById('endDate')

        function syncEndDateMin() {
            if (!startDateInput.value) return

            // Set minimum end date
            endDateInput.min = startDateInput.value

            // Auto-fix invalid end date
            if (endDateInput.value && endDateInput.value < startDateInput.value) {
                endDateInput.value = startDateInput.value
            }
        }

        // Run on page load (edit mode)
        syncEndDateMin()

        // Run when start date changes
        startDateInput.addEventListener('change', syncEndDateMin)

        document.getElementById('bannerInput').addEventListener('change', function (e) {
            const file = e.target.files[0]
            const box = document.getElementById('bannerUploadBox')
            const text = box.querySelector('.upload-text')
            const fileName = box.querySelector('.file-name')

            if (file) {
                box.classList.add('selected')
                text.innerText = 'File selected'
                fileName.innerText = file.name
            } else {
                box.classList.remove('selected')
                text.innerText = 'Drag & Drop or Browse'
                fileName.innerText = ''
            }
        })

        document.getElementById('campaignForm').addEventListener('submit', function (e) {
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.error').forEach(el => el.textContent = '');

            // Helper function
            const showError = (id, message) => {
                const el = document.getElementById('error-' + id);
                if (el) el.textContent = message;
                isValid = false;
            };

            // Get field values
            const propertyId = document.querySelector('[name="property_id"]').value;
            const title = document.querySelector('[name="title"]').value.trim();
            const discount = document.querySelector('[name="discount_percent"]').value;
            const startDate = document.querySelector('[name="start_date"]').value;
            const endDate = document.querySelector('[name="end_date"]').value;
            const status = document.querySelector('[name="status"]:checked');

            // Property validation
            if (!propertyId) {
                showError('property_id', 'Property name is required.');
            }

            // Title validation
            if (!title) {
                showError('title', 'Discount title is required.');
            }

            // Discount validation
            if (!discount) {
                showError('discount_percent', 'Discount percentage is required.');
            } else if (discount < 1 || discount > 100) {
                showError('discount_percent', 'Discount must be between 1 and 100%.');
            }

            // Date validation
            if (!startDate) {
                showError('start_date', 'Start date is required.');
            }

            if (!endDate) {
                showError('end_date', 'End date is required.');
            }

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                if (end < start) {
                    showError('end_date', 'End date cannot be earlier than start date.');
                }
            }

            // Status validation
            if (!status) {
                showError('status', 'Campaign status must be selected.');
            }

            // Banner validation (optional)
            const bannerInput = document.querySelector('[name="banner"]');
            if (bannerInput && bannerInput.files.length > 0) {
                const file = bannerInput.files[0];
                const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
                const maxSize = 2 * 1024 * 1024; // 2MB

                if (!allowedTypes.includes(file.type)) {
                    showError('banner', 'Banner must be a JPG, PNG, or WEBP image.');
                }

                if (file.size > maxSize) {
                    showError('banner', 'Banner size must not exceed 2MB.');
                }
            }

            // Prevent form submission if validation fails
            if (!isValid) {
                e.preventDefault();
            }
        });
    </script>
@endpush

