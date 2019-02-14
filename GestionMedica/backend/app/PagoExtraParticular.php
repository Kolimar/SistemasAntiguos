<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PagoExtraParticular extends Model
{

  public $timestamps = false;
  protected $table = 'pagos_extras_particulares';
  protected $fillable = [
      'pago',
      'fecha',
      'id_pago_particular',
      'created_at',
      'created_by'
  ];

  // UNA PRECIO POR OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UNA UN PAGO EXTRA DE PARTICULAR PERTENECE A UN PAGO DE PARTICULAR
  public function pagoParticular()
  {
      return $this->belongsTo('App\PagoParticular','id_pago_particular');
  }

}
