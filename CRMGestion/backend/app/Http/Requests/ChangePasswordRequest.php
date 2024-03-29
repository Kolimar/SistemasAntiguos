<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
          'new_password' => 'required',
          'password_confirmation' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'new_password.required' => 'La nueva contraseña es requerida',
            'password_confirmation.required' => 'Debe repetir la contraseña',
        ];
    }

}
