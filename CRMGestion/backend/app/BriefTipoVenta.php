<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BriefTipoVenta extends Model
{

  public $timestamps = false;

  protected $table = 'briefs_tipos_ventas';

    protected $fillable = [
        'id_brief',
        'id_tipo_venta',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
