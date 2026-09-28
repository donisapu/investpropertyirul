<a href="{{ route('admin.sell-request.accept',$row->id) }}" class="btn btn-sm btn-success">
    <i class="bx bx-check"></i>
</a>
<a href="{{ route('admin.sell-request.decline', $row->id) }}" class="btn btn-sm btn-danger">
    <i class="bx bx-x"></i>
</a>
