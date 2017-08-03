<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    public $timestamps = false;

    protected $table = 'servicios';

    protected $fillable = [
        'nombre',
        'descripcion',
        'es_recurrente',
        'dias_sugeridos',
        'monto_sugerido',
        'habilitado',
        'created_at',
        'created_by',
    ];

    // UN SERVICIO PUEDE SER PARTE DE MUCHAS TAREAS
    public function tareas()
    {
        return $this->hasMany('App\Tarea','id_servicio');
    }

    // MUCHOS SERVICIOS PUEDEN SER CONTRATADOS POR MUCHOS BRIEFS
    public function briefs()
    {
        return $this->belongsToMany('App\Brief', 'servicios_contratados', 'id_servicio', 'id_brief')->withPivot('cantidad_mensual','fecha_comienzo','created_at','created_by');
    }

    // MUCHOS SERVICIOS PUEDEN SER CONTRATADOS POR MUCHOS CLIENTES
    public function clientes()
    {
        return $this->belongsToMany('App\Cliente', 'clientes_servicios_contratados', 'id_servicio', 'id_cliente')->withPivot('cantidad_mensual','fecha_comienzo','eliminado','created_at','created_by');
    }

    // UN SERVICIO PUEDE TENER MUCHOS TAREAS TEMPLATES DE SERVICIO
    public function tareasTemplatesDeServicios()
    {
        return $this->hasMany('App\ServicioTareaTemplate','id_servicio');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
