@extends('layouts.app')
@section('content')
    <div class="card">
        <div class="card-header">
            <h4>Profile Setting</h4>
        </div>
        <div class="card-body">
            <form action="{{ route('admin.profile.update',$data->id) }}" method="POST">
                @csrf
                <div class="form-group mb-3">
                    <label for="" class="form-label">Name</label>
                    <input type="text" name="name" class="form-control" value="{{ $data->name }}" id="">
                </div>
                <div class="form-group mb-3">
                    <label for="" class="form-label">Password</label>
                    <input type="password" class="form-control" name="password" id="">
                </div>
                <button class="btn btn-primary" type="submit">Save</button>
            </form>
        </div>
    </div>
@endsection
