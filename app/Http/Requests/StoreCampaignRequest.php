<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
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
            'property_id' => 'required|exists:properties,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:active,inactive',
            'action' => 'required|in:draft,publish',
        ];
    }

    public function messages(): array
    {
        return [
            'property_id.required' => 'Nama properti wajib dipilih.',
            'discount_percent.max' => 'Diskon tidak boleh lebih dari 100%.',
            'end_date.after_or_equal' => 'Tanggal berakhir harus setelah tanggal mulai.',
        ];
    }
}
