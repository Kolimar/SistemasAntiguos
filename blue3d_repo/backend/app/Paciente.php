<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{

  public $timestamps = false;
  protected $table = 'pacientes';
  protected $fillable = [
      'dni',
      'fecha_nacimiento',
      'nombres',
      'apellidos',
      'n_afiliado',
      'domicilio',
      'n_departamento',
      'barrio',
      'telefono',
      'celular',
      'email',
      'observaciones',
      'plan_os',
      'id_obra_social',
      'id_particular',
      'created_at',
      'created_by'
  ];

  // UN PACIENTE POSEE SOLO UNA OBRA SOCIAL
  public function obraSocial()
  {
      return $this->belongsTo('App\ObraSocial','id_obra_social');
  }

  // UN PACIENTE POSEE SOLO UN PARTICULAR
  public function particular()
  {
      return $this->belongsTo('App\Particular','id_particular');
  }

  // UN PACIENTE PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UN PACIENTE PUEDE TENER MUCHOS ESTUDIOS
  public function estudios()
  {
      return $this->hasMany('App\Paciente','id_paciente');
  }

}
