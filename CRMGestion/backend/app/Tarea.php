<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{

  public $timestamps = false;
	protected $table = 'tareas';
    protected $fillable = [
        'id_tarea_template',
        'id_servicio_tarea_template',
        'id_tipo_tarea',
        'id_depende_de',
        'workflow_name',
        'titulo',
        'descripcion',
        'fecha_limite',
        'fecha_ejecucion',
        'urgente',
        'falta_info',
        'prioridad',
        'id_cliente',
        'id_servicio',
        'id_asignado',
        'created_by',
        'estado',
        'cantidad_subtareas',
        'cantidad_subtareas_completadas',
        'es_critica',
        'ultimo_milestone',
        'visible',
        'created_at',
    ];

    public function depende_de()
    {
        return $this->belongsTo('App\Tarea');
    }

    public function tareas()
    {
        return $this->hasMany('App\Subtarea');
    }

    public function asignado()
    {
        return $this->belongsTo('App\User');
    }

    // UNA TAREA PUEDE TENER ASOCIADA UN CLIETNE
    public function cliente()
    {
        return $this->belongsTo('App\Cliente', 'id_cliente');
    }

    // UNA TAREA PUEDE TENER ASOCIADO UN SERVICIO
    public function servicio()
    {
        return $this->belongsTo('App\Servicio','id_servicio');
    }

    // UNA TAREA TIENE ASOCIADA UNA TAREA TEMPLATE DE SERVICIO
    public function TareaTemplateDeServicio()
    {
        return $this->belongsTo('App\ServicioTareaTemplate','id_servicio_tarea_template');
    }

    // UNA TAREA TIENE UNA TAREA TEMPLATE
    public function tareaTemplate()
    {
        return $this->belongsTo('App\TareaTemplate','id_tarea_template');
    }

    // UNA TAREA TIENE UN TIPO DE TAREA
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
