<?php

namespace App\Http\Requests;

class UpdateCampaignRequest extends StoreCampaignRequest
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
            'is_campaign' => 'boolean',

            'title' => 'required|string|max:255',
            'description' => 'nullable|string',

            'banner' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',

            'discount_percent' => 'required|numeric|min:0|max:100',

            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',

            'status' => 'required|in:draft,active,inactive',
        ];
    }
}
