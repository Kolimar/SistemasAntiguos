<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\User;
class UserTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(User $user)
    {
        return [
        'identificador'  => $user->id,
        'nombre'  => $user->name,
        'apellido' => $user->last_name,
        'nombre_empresa' =>(string)$user->empresa , 
        'imagen_visible' => url("img/{$user->avatar}"),
        'correo' =>(string)$user->email,
        'habilitado'=>(int)$user->verified,
        'esAdministrador' => ($user->admin==='true'),
        'fechaCreacion' => $user->created_at,
        'fechaActualizacion' => $user->updated_at,
        'fechaEliminacion' => isset($user->deleted_at)?(string) $user->deleted_at : null,
        ];
    }

    public static function originalAttribute($index)
    {
        $attributes = [
            'identificador'  => 'id',
            'nombre'  => 'name',
            'apellido' => 'last_name',
            'nombre_empresa' => 'empresa' , 
            'imagen_visible' => 'avatar',
            'correo' =>'email',
            'habilitado'=>'verified',
            'esAdministrador' => 'admin',
            'fechaCreacion' => 'created_at',
            'fechaActualizacion' => 'updated_at',
            'fechaEliminacion' => 'deleted_at',
        ];

        return isset($attributes[$index]) ? $attributes[$index]: null;
    }
}
