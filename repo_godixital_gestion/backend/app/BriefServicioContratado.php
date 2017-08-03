<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BriefServicioContratado extends Model
{
  
  public $timestamps = false;

  protected $table = 'servicios_contratados';

    protected $fillable = [
        'cantidad_mensual',
        'fecha_comienzo',
        'id_servicio',
        'id_brief',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
