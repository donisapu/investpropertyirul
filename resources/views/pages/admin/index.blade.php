@extends('layouts.app')
@section('content')
    <div class="row">
        <div class="col-lg-8 mb-4 order-0">
            <div class="card">
                <div class="d-flex align-items-end row">
                    <div class="col-sm-7">
                        <div class="card-body">
                            <h5 class="card-title text-primary">Selamat Datang {{ Auth::user()->name }} !</h5>
                            <p class="mb-4">
                                Semoga hari Anda menyenangkan dan produktif. Tetap semangat dalam mengelola properti dan investasi Anda!
                            </p>


                        </div>
                    </div>
                    <div class="col-sm-5 text-center text-sm-left">
                        <div class="card-body pb-0 px-0 px-md-4">
                            <img src="../assets/img/illustrations/man-with-laptop-light.png" height="140"
                                alt="View Badge User" data-app-dark-img="illustrations/man-with-laptop-dark.png"
                                data-app-light-img="illustrations/man-with-laptop-light.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-12 col-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                        <div class="avatar flex-shrink-0">
                            <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-home"></i></span>
                        </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Total Properties</span>
                    <h3 class="card-title mb-2">{{ number_format($properties) }}</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-3 col-md-12 col-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                        <div class="avatar flex-shrink-0">
                            <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-chart-trend"></i></span>
                        </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Investment</span>
                    <h3 class="card-title mb-2">{{ number_format($investment) }}</h3>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-12 col-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                        <div class="avatar flex-shrink-0">
                            <span class="avatar-initial rounded bg-label-success"><i class="bx bx-community"></i></span>
                        </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Crowdfunding</span>
                    <h3 class="card-title mb-2">{{ number_format($crowdfunding) }}</h3>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-12 col-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                        <div class="avatar flex-shrink-0">
                            <span class="avatar-initial rounded bg-label-info"><i class="bx bx-key"></i></span>
                        </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Property For Sale</span>
                    <h3 class="card-title mb-2">{{ number_format($property_for_sale) }}</h3>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-12 col-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="card-title d-flex align-items-start justify-content-between">
                        <div class="avatar flex-shrink-0">
                            <span class="avatar-initial rounded bg-label-warning"><i class="bx bx-gavel"></i></span>
                        </div>
                    </div>
                    <span class="fw-semibold d-block mb-1">Auctions</span>
                    <h3 class="card-title mb-2">{{ number_format($auctions) }}</h3>
                </div>
            </div>
        </div>
    </div>
@endsection
