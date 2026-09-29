@extends('layouts.app')

@section('content')
    @if (session('success'))
        <div class="alert alert-success alert-dismissible" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="card shadow-sm border-0">
        <div class="card-header bg-white fw-semibold">
            Withdrawal Settings
        </div>

        <form action="{{ route('admin.withdrawal-settings.update') }}" method="POST">
            @csrf
            @method('PUT')

            <div class="card-body p-4">
                <p class="text-muted mb-4">
                    These values apply to new user Withdrawals. The user sees the same fee and limits in the
                    Withdraw form. Existing Withdrawals keep the fee they were created with.
                </p>

                <div class="row g-4">
                    <div class="col-md-4">
                        <label for="admin_fee" class="form-label fw-medium">Admin Fee (Rp)</label>
                        <input type="number" id="admin_fee" name="admin_fee" min="0" step="1" required
                            class="form-control @error('admin_fee') is-invalid @enderror"
                            value="{{ old('admin_fee', $setting->admin_fee) }}">
                        <small class="text-muted">Flat fee added on top of the amount. Set it above the Xendit payout
                            fee.</small>
                        @error('admin_fee')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label for="min_amount" class="form-label fw-medium">Minimum Withdrawal (Rp)</label>
                        <input type="number" id="min_amount" name="min_amount" min="1" step="1" required
                            class="form-control @error('min_amount') is-invalid @enderror"
                            value="{{ old('min_amount', $setting->min_amount) }}">
                        @error('min_amount')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label for="max_amount" class="form-label fw-medium">Maximum Withdrawal (Rp)</label>
                        <input type="number" id="max_amount" name="max_amount" min="1" step="1"
                            class="form-control @error('max_amount') is-invalid @enderror"
                            value="{{ old('max_amount', $setting->max_amount) }}" placeholder="No limit">
                        <small class="text-muted">Leave empty for no limit. The bank's own limit still applies.</small>
                        @error('max_amount')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                </div>

                @if ($setting->exists && $setting->updated_at)
                    <p class="text-muted small mt-4 mb-0">
                        Last updated {{ $setting->updated_at->format('d M Y H:i') }}
                        @if ($setting->updatedBy)
                            by {{ $setting->updatedBy->name ?? $setting->updatedBy->email }}
                        @endif
                    </p>
                @endif
            </div>

            <div class="card-footer bg-white text-end">
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
