<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MotivoLog extends Model
{
  public $timestamps = false;

  protected $table = 'motivos_logs';

    protected $fillable = [
        'nombre',
        'es_milestone',
        'interes_gerencial',
        'tipo',
        'created_at',
        'created_by'
    ];

    // UN ROL DE CONTACTO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

    // UN MOTIVO DE LOG PUEDE TENER MUCHOS LOGS
    public function logs()
    {
        return $this->hasMany('App\Log','id_motivo');
    }

}
