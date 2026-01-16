<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeveloperRequest extends FormRequest
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
            'phone'           => 'required|regex:/^\+?[0-9]+$/|max:14',
            'youtube_url'     => 'nullable|url',
            'facebook_url'    => 'nullable|url',
            'instagram_url'   => 'nullable|url',
            'tiktok_url'      => 'nullable|url',
            'status'          => 'in:draft,published',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Developer name is required.',

            'phone.required' => 'Phone number is required.',
            'phone.regex' => 'Phone number may contain numbers and optional (+) only.',
            'phone.max' => 'Phone number may not exceed 14 characters.',

            'youtube_url.url' => 'YouTube link must be a valid URL.',
            'facebook_url.url' => 'Facebook link must be a valid URL.',
            'instagram_url.url' => 'Instagram link must be a valid URL.',
            'tiktok_url.url' => 'TikTok link must be a valid URL.',
        ];
    }
}
