<?php

namespace App\Http\Requests;

class UpdateDeveloperRequest extends StoreDeveloperRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'image'           => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'phone'           => 'nullable|string|max:20',
            'youtube_url'     => 'nullable|url',
            'facebook_url'    => 'nullable|url',
            'instagram_url'   => 'nullable|url',
            'tiktok_url'      => 'nullable|url',
            'status'          => 'in:draft,published',
        ];
    }
}
