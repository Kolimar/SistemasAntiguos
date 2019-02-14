<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Visita extends Model
{

  public $timestamps = false;
  protected $table = 'visitas';
  protected $fillable = [
      'fecha',
      'descripcion',
      'created_at',
      'created_by',
      'id_doctor',
  ];

  // UNA VISITA PERTENECE A UN DOCTOR
  public function doctor()
  {
      return $this->belongsTo('App\Doctor','id_doctor');
  }

  // UNA OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

}
