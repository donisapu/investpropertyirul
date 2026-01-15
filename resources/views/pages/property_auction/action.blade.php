<a href="{{ route('admin.auction-properties.show',$row->id) }}" class="btn btn-sm btn-secondary">
    <i class="bx bx-list"></i>
</a>
<a href="{{ route('admin.auction-properties.edit', $row->id) }}" class="btn btn-sm btn-primary">
    <i class="bx bx-edit"></i>
</a>

<form action="{{ route('admin.auction-properties.destroy', $row->id) }}" method="POST" class="d-inline">
    @csrf
    @method('DELETE')
    <button class="btn btn-sm btn-danger">
        <i class="bx bx-trash"></i>
    </button>
</form>
