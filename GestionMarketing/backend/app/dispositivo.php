<?php

namespace App;

use App\perfilCliente;
use App\variable;
use Illuminate\Database\Eloquent\Model;
use App\Transformers\DispositivoTransformer;


class dispositivo extends Model
{
    public $transformer = DispositivoTransformer::class;
    const ENCENDIDO = 1;
    const NO_ENCENDIDO = 0;

    protected $fillable = [
    	'encendido',
        'encendido_real',
    	'perfil_cliente_id',
    	'nombre',
    	'nro_serie',
    	'ubicacion',
        'fecha_ultima_medicion',
    ];

    public function variables()
    {
    	return $this->hasMany(variable::class);
    }
    public function cliente()
    {
    	return $this->belongsTo(perfilCliente::class);
    }
    public function setNameAttribute($valor){

        $this->attributes['nombre'] = strtolower($valor);
    }
    public function getNameAttribute($valor){

        return ucwords($valor);
    }
}
