<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Particular extends Model
{

  public $timestamps = false;
  protected $table = 'particulares';
  protected $fillable = [
      'nombre',
      'created_at',
      'created_by'
  ];

  // UN PARTICULAR PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UNA OBRA SOCIAL PUEDE PERTENECER A MUCHOS PACIENTES
  public function pacientes()
  {
      return $this->hasMany('App\Paciente','id_particular');
  }

  // UNA O MUCHAS PARTICULARES PUEDEN TENER MUCHOS PRECIOS
  public function prestaciones()
  {
      return $this->belongsToMany('App\Prestacion','precios_x_particulares', 'id_particular', 'id_prestacion')->withPivot('id','precio');
  }

  // UN PARTICULAR PUEDE TENER MUCHOS PAGOS DE PARTICULARES
  public function pagoParticulares()
  {
      return $this->hasMany('App\PagoParticular','id_particular');
  }

}
