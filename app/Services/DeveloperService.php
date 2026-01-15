<?php

namespace App\Services;

use App\Models\Developer;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DeveloperService
{
    public function store(array $data): Developer
    {
        if (isset($data['image'])) {
            $data['image_path'] = $this->uploadImage($data['image']);
        }

        unset($data['image']);

        return Developer::create($data);
    }

    public function update(Developer $developer, array $data): Developer
    {
        if (isset($data['image'])) {
            if ($developer->image_path) {
                Storage::disk('public')->delete($developer->image_path);
            }

            $data['image_path'] = $this->uploadImage($data['image']);
        }

        unset($data['image']);

        $developer->update($data);

        return $developer;
    }

    public function delete(Developer $developer): void
    {
        if ($developer->image_path) {
            Storage::disk('public')->delete($developer->image_path);
        }

        $developer->delete();
    }

    protected function uploadImage(UploadedFile $file): string
    {
        return $file->store('developers', 'public');
    }
}
