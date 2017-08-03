<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\dispositivo;

class DispositivoTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
public function transform(dispositivo $dispositivo)
    {
        return [
        'identificador'  => $dispositivo->id,
        'leyenda'  => $dispositivo->nombre,
        'numero_de_serie' => $dispositivo->nro_serie,
        'ubicacion_actual' =>(string)$dispositivo->ubicacion ,
        'identificador_usuario' =>$dispositivo->perfil_cliente_id,
        'fechaCreacion' => $dispositivo->created_at,
        'fechaActualizacion' => $dispositivo->updated_at,
        'estado' =>$dispositivo->encendido,
        //'fechaEliminacion' => isset($user->deleted_at)?(string) $user->deleted_at : null,
        ];
    }

    public static function originalAttribute($index)
    {
        $attributes = [
            'identificador'  => 'id',
            'leyenda'  => 'nombre',
            'numero_de_serie' => 'nro_serie',
            'ubicacion_actual' => 'ubicacion' ,
            'identificador_usuario' =>'perfil_cliente_id',
            'fechaCreacion' => 'created_at',
            'fechaActualizacion' => 'updated_at',
            'estado' =>'encendido',
        ];

        return isset($attributes[$index]) ? $attributes[$index]: null;
    }
}
