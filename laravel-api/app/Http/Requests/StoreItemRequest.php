<?php

namespace App\Http\Requests;

use App\Models\Item;
use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_available' => 'required|boolean',
            'category' => 'required|in:' . implode(',', Item::CATEGORIES),
            'photo' => 'required|image|mimes:jpg,jpeg,png'
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('is_available')) {
            $this->merge([
                'is_available' => filter_var($this->is_available, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}
