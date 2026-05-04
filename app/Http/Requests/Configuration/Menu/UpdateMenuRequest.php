<?php

namespace App\Http\Requests\Configuration\Menu;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'         => 'required|string|max:255',
            'url'          => [
                'required',
                'string',
                Rule::unique('menus', 'url')->ignore($this->menu), // Mengabaikan ID menu saat ini
            ],
            'category'     => 'required|string',
            'icon'         => 'nullable|string',
            'main_menu_id' => 'nullable|exists:menus,id',
            'orders'       => 'nullable|integer',
        ];
    }
}
