<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoTarea extends Model
{
  public $timestamps = false;

	protected $table = 'tipos_tareas';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    // UN TIPO DE TAREAS PUEDE TENER MUCHAS TAREAS
    public function tareas()
    {
        return $this->hasMany('App\Tarea','id_tipo_tarea');
    }

    // UN TIPO DE TAREAS PUEDE TENER MUCHAS TAREAS TEMPLATES
    public function tareasTemplates()
    {
        return $this->hasMany('App\TareaTemplate','id_tipo_tarea');
    }

    // UN TIPO DE TAREAS PUEDE TENER MUCHAS TAREAS TEMPLATES DE SERVICIO
    public function tareasTemplatesDeServicios()
    {
        return $this->hasMany('App\ServicioTareaTemplate','id_tipo_tarea');
    }

    // UN TIPO DE TAREA PUEDE SER CREADA POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
