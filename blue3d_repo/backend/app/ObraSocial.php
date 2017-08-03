<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ObraSocial extends Model
{

  public $timestamps = false;
  protected $table = 'obras_sociales';
  protected $fillable = [
      'nombre',
      'created_at',
      'created_by'
  ];

  // UNA OBRA SOCIAL PUEDE PERTENECER A MUCHOS PACIENTES
  public function pacientes()
  {
      return $this->hasMany('App\Paciente','id_obra_social');
  }

  // UNA OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UNA O MUCHAS OBRAS SOCIALES PUEDEN TENER MUCHOS PRECIOS
  public function prestaciones()
  {
      return $this->belongsToMany('App\Prestacion','precios_x_obras_sociales', 'id_obra_social', 'id_prestacion')->withPivot('id','precio');
  }

  // UNA OBRA SOCIAL PUEDE TENER MUCHOS PAGOS DE OBRAS SOCIALES
  public function pagosObrasSociales()
  {
      return $this->hasMany('App\PagoObraSocial','id_obra_social');
  }

}
