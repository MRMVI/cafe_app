<?php

namespace App\Http\Requests;

use App\Models\Item;
use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // check roles
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
            'price' => 'sometimes|string|min:0',
            'is_available' => 'sometimes|string',
            'category' => 'sometimes|in:' . implode(',', Item::CATEGORIES),
            'photo' => 'sometimes|image|mimes:jpg,jpeg,png',
        ];
    }
}
