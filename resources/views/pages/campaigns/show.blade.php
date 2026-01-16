@extends('layouts.app')
@section('content')
<div class="container-fluid">
    <div class="card shadow-sm border-0">
        <div class="card-body p-4">
            <div class="row">
                <div class="col-md-12 mb-4 ml-2">
                    <a href="{{ route('admin.campaigns') }}" class="btn btn-outline-secondary">
                        ← Back to List
                    </a>
                </div>
            </div>
            <div class="row g-4">
                {{-- LEFT: IMAGE --}}
                <div class="col-md-3 text-center">
                    <img 
                        src="{{ Storage::url($data['banner_path']) }}" 
                        alt="{{ $data['title'] }}"
                        class="img-fluid rounded-3 shadow-sm mb-3"
                        style="max-width: 220px;"
                    >

                    {{-- 🔴 ACTION BUTTONS START HERE --}}
                    @if($data['status'] === 'draft')
                        <form action="{{ route('admin.campaigns.publish', $data['id']) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <button type="submit" class="btn btn-success btn-sm w-100">
                                Publish
                            </button>
                        </form>

                    @elseif($data['status'] === 'active')
                        <form action="{{ route('admin.campaigns.deactivate', $data['id']) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <button type="submit" class="btn btn-warning btn-sm w-100">
                                Deactivate
                            </button>
                        </form>

                    @elseif($data['status'] === 'inactive')
                        <form action="{{ route('admin.campaigns.activate', $data['id']) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <button type="submit" class="btn btn-primary btn-sm w-100">
                                Activate
                            </button>
                        </form>
                    @endif
                    {{-- 🔴 ACTION BUTTONS END HERE --}}
                </div>

                {{-- RIGHT: DETAILS --}}
                <div class="col-md-9">
                    <h5 class="fw-semibold mb-3 border-bottom pb-2">
                        Discount Information
                    </h5>

                    <table class="table table-borderless align-middle mb-0">
                        <tbody>
                            <tr>
                                <td class="text-muted" style="width: 180px;">Discount Title</td>
                                <td>{{ $data['title'] }}</td>
                            </tr>
                            
                            <tr>
                                <td class="text-muted" style="width: 180px;">Property Name</td>
                                <td>{{ $data['property_name'] }}</td>
                            </tr>

                            <tr>
                                <td class="text-muted">Discount Percentage</td>
                                <td>
                                    @if($data['discount_percent'])
                                        <a href="{{ $data['discount_percent'] }}" target="_blank" class="text-decoration-none">
                                            {{ $data['discount_percent'] }}
                                        </a>
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted">Start Date</td>
                                <td>
                                    @if($data['start_date'])
                                        {{ $data['start_date'] }}
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted">End Date</td>
                                <td>
                                    @if($data['end_date'])
                                        {{ $data['end_date'] }}
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted align-top">Description</td>
                                <td class="text-secondary" style="line-height: 1.7;">
                                    {{ $data['description'] ?? '-' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
