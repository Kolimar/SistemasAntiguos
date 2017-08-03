<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PagoParticular extends Model
{
  public $timestamps = false;
  protected $table = 'pagos_particulares';
  protected $fillable = [
      'id_particular',
      'pago',
      'fecha',
      'id_estudio',
      'created_at',
      'created_by'
  ];

  // UNA PRECIO POR OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UN PAGO PERTENECE A UN PARTICULARS
  public function particular()
  {
      return $this->belongsTo('App\Particular','id_particular');
  }

  // UN PAGO DE PARTICULAR PERTENECE A UN ESTUDIO
  public function estudio()
  {
      return $this->belongsTo('App\Estudio','id_estudio');
  }

  // UN PAGO DE OBRA SOCIAL PUEDE TEENR MUCHOS PAGOS EXTRAS
  public function pagosExtrasParticulares()
  {
      return $this->hasMany('App\PagoExtraParticular','id_pago_particular');
  }

}
