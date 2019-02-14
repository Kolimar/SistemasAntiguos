<?php

namespace App;

use App\dispositivo;
use App\medicion;
use Illuminate\Database\Eloquent\Model;

class variable extends Model
{
	const ACTIVA = 1;
    const NO_ACTIVA = 0;

        protected $fillable = [
    		'status',
    		'code',
    		'dispositivo_id',
            'unidad',
    		'maximo',
    		'minimo',
    		'nombre',
    		'rango_maximo',
    		'rango_minimo',
            'fecha_ultima_medicion',
            'ultima_medicion',
            'cantidad_mediciones',
            'suma_mediciones',
            'json',

    	];
        protected $hidden = [
        'json',
        'unidad',
        ];
    	//retorna true si esta activa
    	public function estaActiva()
    	{
    		return $this->activo==variable::ACTIVA;
    	}
    	//retorna true si esta la medicion esta en rango
    	public function estaEnRango($medicion)
    	{
    		if ($this->rango_maximo<$medicion and $this->rango_minimo>$medicion) {
    			return true;
    		}else{
    			return false;
    		}
    	}
    	//retorna true si esta la medicion supera los maximos o minimos
    	public function estaEnRangoAceptable($medicion)
    	{
    		if ($this->maximo<$medicion and $this->minimo>$medicion) {
    			return true;
    		}else{
    			return false;
    		}
    	}
	   public function ultimaMedicion()
		{
		   return $this->ultima_medicion;
		}

        public function dispositivo()
        {
          return  $this->belongsTo(dispositivo::class);
        }
        public function medicion()
        {
          return  $this->hasMany(medicion::class);
        }
        public function Historico()
        {
          return  $this->hasMany(Historico::class);
        }
}
