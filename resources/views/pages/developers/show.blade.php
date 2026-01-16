@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="card shadow-sm border-0">
        <div class="card-body p-4">
            <div class="row">
                <div class="col-md-12 mb-4 ml-2">
                    <a href="{{ route('admin.developers') }}" class="btn btn-outline-secondary">
                        ← Back to List
                    </a>
                </div>
            </div>
            <div class="row g-4">
                {{-- LEFT: IMAGE --}}
                <div class="col-md-3 text-center">
                    <img 
                        src="{{ Storage::url($data->image_path) }}" 
                        alt="{{ $data->name }}"
                        class="img-fluid rounded-3 shadow-sm mb-3"
                        style="max-width: 220px;"
                    >

                    <h5 class="fw-semibold mb-1">{{ $data->name }}</h5>
                    <small class="text-muted">Developer Profile</small>
                </div>

                {{-- RIGHT: DETAILS --}}
                <div class="col-md-9">
                    <h5 class="fw-semibold mb-3 border-bottom pb-2">
                        Developer Information
                    </h5>

                    <table class="table table-borderless align-middle mb-0">
                        <tbody>
                            <tr>
                                <td class="text-muted" style="width: 180px;">Phone Number</td>
                                <td>{{ $data->phone }}</td>
                            </tr>

                            <tr>
                                <td class="text-muted">Facebook</td>
                                <td>
                                    @if($data->facebook_url)
                                        <a href="{{ $data->facebook_url }}" target="_blank" class="text-decoration-none">
                                            {{ $data->facebook_url }}
                                        </a>
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted">Instagram</td>
                                <td>
                                    @if($data->instagram_url)
                                        <a href="{{ $data->instagram_url }}" target="_blank" class="text-decoration-none">
                                            {{ $data->instagram_url }}
                                        </a>
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted">TikTok</td>
                                <td>
                                    @if($data->tiktok_url)
                                        <a href="{{ $data->tiktok_url }}" target="_blank" class="text-decoration-none">
                                            {{ $data->tiktok_url }}
                                        </a>
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted">YouTube</td>
                                <td>
                                    @if($data->youtube_url)
                                        <a href="{{ $data->youtube_url }}" target="_blank" class="text-decoration-none">
                                            {{ $data->youtube_url }}
                                        </a>
                                    @else
                                        <span class="text-muted">-</span>
                                    @endif
                                </td>
                            </tr>

                            <tr>
                                <td class="text-muted align-top">Description</td>
                                <td class="text-secondary" style="line-height: 1.7;">
                                    {{ $data->description ?? '-' }}
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
