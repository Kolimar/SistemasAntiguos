<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subtarea extends Model
{
	public $timestamps = false;

	protected $table = 'subtareas';

    protected $fillable = [
        'titulo',
        'descripcion',
        'completa',
        'id_tarea',
        'created_by',
        'created_at',
    ];

    public function tarea()
    {
        return $this->belongsTo('App\Tarea');
    }

		// UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
		public function creadaPor()
		{
				return $this->belongsTo('App\User','created_by');
		}

}
