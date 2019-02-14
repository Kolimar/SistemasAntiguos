<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BriefTipoEmpresa extends Model
{
  
  public $timestamps = false;

  protected $table = 'briefs_tipos_empresas';

    protected $fillable = [
        'id_brief',
        'id_tipo_empresa',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
