<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PagoObraSocial extends Model
{

  public $timestamps = false;
  protected $table = 'pagos_obras_sociales';
  protected $fillable = [
      'id_obra_social',
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

  // UNA UN PAGO PERTENECE A UNA OBRA SOCIAL
  public function obraSocial()
  {
      return $this->belongsTo('App\ObraSocial','id_obra_social');
  }

  // UN PAGO DE OBRA SOCIAL PERTENECE A UN ESTUDIO
  public function estudio()
  {
      return $this->belongsTo('App\Estudio','id_estudio');
  }

  // UN PAGO DE OBRA SOCIAL PUEDE TEENR MUCHOS PAGOS EXTRAS
  public function pagosExtrasObrasSociales()
  {
      return $this->hasMany('App\PagoExtraObraSocial','id_pago_os');
  }

}
