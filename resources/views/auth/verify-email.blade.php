@extends('layouts.auth')

@section('content')
<div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner">

            <div class="card">
                <div class="card-body">

                    <!-- Logo -->
                    <div class="app-brand justify-content-center">
                        <a href="/" class="app-brand-link">
                            @php
                                $settings = DB::table('website_settings')->first();
                            @endphp

                            <img src="{{ isset($settings->logo)
                                ? (str_starts_with($settings->logo, 'http') || str_starts_with($settings->logo, '/')
                                    ? $settings->logo
                                    : asset('storage/' . $settings->logo))
                                : asset('assets/img/logo.png') }}"
                                alt="Logo"
                                style="width:100px; margin:10px auto 20px;">
                        </a>
                    </div>

                    <h4 class="mb-2 text-center">
                        Verify Your Email 📧
                    </h4>

                    <p class="text-muted text-center mb-4">
                        Thank you for registering.<br>
                        Before you can continue, please verify your email address by clicking
                        the verification link we sent to your inbox.
                    </p>

                    @if (session('status') == 'verification-link-sent')
                        <div class="alert alert-success">
                            A new verification link has been sent to your email address.
                        </div>
                    @endif

                    <form method="POST" action="{{ route('verification.send') }}">
                        @csrf

                        <button class="btn btn-primary d-grid w-100 mb-3" type="submit">
                            <i class="bx bx-envelope me-1"></i>
                            Resend Verification Email
                        </button>
                    </form>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf

                        <button class="btn btn-outline-secondary d-grid w-100" type="submit">
                            <i class="bx bx-log-out me-1"></i>
                            Logout
                        </button>
                    </form>

                </div>
            </div>

        </div>
    </div>
</div>
@endsection
