<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServicioTareaTemplate extends Model
{
    public $timestamps = false;

	protected $table = 'servicios_tareas_templates';

    protected $fillable = [
        'titulo',
        'descripcion',
        'es_critica',
        'ultimo_milestone',
        'dias_sugeridos',
        'asigna_pm_automatico',
        'id_tipo_tarea',
        'id_servicio',
        'created_at',
        'created_by'
    ];

    // UN SERVICIO TAREA TEMPLATE TIENE ASOCIADA UN SERVICIO
    public function servicio()
    {
        return $this->belongsTo('App\Servicio','id_servicio');
    }

    // UN SERVICIO TAREA TEMPLATE TIENE ASOCIADA UN TIPO DE TAREA
    public function tareas()
    {
        return $this->hasMany('App\Tarea','id_servicio_tarea_template');
    }

    // UN SERVICIO TAREA TEMPLATE TIENE ASOCIADA UN TIPO DE TAREA
    public function tipoTarea()
    {
        return $this->belongsTo('App\TipoTarea','id_tipo_tarea');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
