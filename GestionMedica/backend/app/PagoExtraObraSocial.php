<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PagoExtraObraSocial extends Model
{

  public $timestamps = false;
  protected $table = 'pagos_extras_os';
  protected $fillable = [
      'pago',
      'fecha',
      'id_pago_os',
      'created_at',
      'created_by'
  ];

  // UNA PRECIO POR OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UNA UN PAGO EXTRA DE OBRA SOCIAL PERTENECE A UN PAGO DE OBRA SOCIAL
  public function pagoObraSocial()
  {
      return $this->belongsTo('App\PagoObraSocial','id_pago_os');
  }

}
