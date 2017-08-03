<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{

  public $timestamps = false;
  protected $table = 'doctores';
  protected $fillable = [
      'matricula',
      'nombres',
      'apellidos',
      'especialidad',
      'domicilio',
      'n_departamento',
      'telefono',
      'celular',
      'email',
      'observaciones',
      'created_at',
      'created_by'
  ];

  // UN DOCTOR PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UN DOCTOR PUEDE TENER MUCHAS VISITAS
  public function visitas()
  {
      return $this->hasMany('App\Visita','id_doctor');
  }

  // UN DOCTOR PUEDE TENER MUCHOS ESTUDIOS
  public function estudios()
  {
      return $this->hasMany('App\Estudio','id_doctor');
  }

}
