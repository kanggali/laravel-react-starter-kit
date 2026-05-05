<?php

namespace App\Http\Requests\Configuration\User;

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
        $isStore = $this->routeIs('configuration.user.store');

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                // Pastikan unik, abaikan ID user saat ini jika sedang update
                Rule::unique('users', 'username')->ignore($this->user?->id),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                // Pastikan unik, abaikan ID user saat ini jika sedang update
                Rule::unique('users', 'email')->ignore($this->user?->id),
            ],
            // Tambahkan validasi untuk role_ids yang dikirim dari Select2
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['exists:roles,id'],

            // Password hanya wajib diisi saat store (tambah user baru)
            'password' => [
                $isStore ? 'required' : 'nullable',
                'confirmed',
                'min:8',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'role_ids' => 'roles',
            'role_ids.*' => 'role',
        ];
    }


}
