<?php

namespace App\Http\Requests\User;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'username' => [
                Rule::requiredIf(request()->routeIs('configuration.users.store')),
                Rule::unique('users')->ignore($this->user)
            ],
            'email' => [
                'required',
                Rule::unique('users')->ignore($this->user)
            ],
            'password' => [
                Rule::requiredIf(request()->routeIs('configuration.users.store')),
                'confirmed',
                'min:8'
            ]
        ];
    }
}
