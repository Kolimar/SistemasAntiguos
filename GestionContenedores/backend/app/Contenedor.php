<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\logBookings;
use App\logContenedores;

class Contenedor extends Model
{
	protected $fillable = [
        'codigo',
        'size',
        'tipo',
        'estado',
        'bloqueado',
        'fecha_ultimo_movimiento',
        'deposito_id',
    ];

    public function setCodeAttribute($valor){

    $this->attributes['codigo'] = strtoupper($valor);
	}
    public function getCodeAttribute($valor){

        return strtoupper($valor);
    }

     public function logBookings()
    {
        return $this->HasMany(logBookings::class);
  
    }
     public function logContenedores()
    {
        return $this->HasMany(logContenedores::class);
  
    }
}
