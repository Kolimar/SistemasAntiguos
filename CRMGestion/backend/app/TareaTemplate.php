<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TareaTemplate extends Model
{
    public $timestamps = false;

	protected $table = 'tareas_templates';

    protected $fillable = [
        'titulo',
        'descripcion',
        'es_critica',
        'ultimo_milestone',
        'dias_sugeridos',
        'asigna_pm_automatico',
        'id_tipo_tarea',
        'created_at',
        'created_by',
    ];

    // UNA TAREA TEMPLATE PERTENECE A UN TIPO DE TAREA
    public function tipoTarea()
    {
        return $this->belongsTo('App\TipoTarea','id_tipo_tarea');
    }

    // UNA TAREA TEMPLATE PUEDE ESTAR EN MUCHAS TAREAS
    public function tareas()
    {
        return $this->hasMany('App\Tarea','id_tarea_template');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
