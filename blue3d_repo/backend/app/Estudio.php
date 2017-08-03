<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Estudio extends Model
{

  public $timestamps = false;
  protected $table = 'estudios';
  protected $fillable = [
      'fecha',
      'hora',
      'id_paciente',
      'id_doctor',
      'id_prestacion',
      'observaciones',
      'n_factura',
      'created_at',
      'created_by'
  ];

  // UN ESTUDIO PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UN ESTUDIO PUEDE TENER ASIGNADO UN DOCTOR
  public function doctor()
  {
      return $this->belongsTo('App\Doctor', 'id_doctor');
  }

  // UN ESTUDIO PUEDE TENER ASIGNADO UN PACIENTE
  public function paciente()
  {
      return $this->belongsTo('App\Paciente', 'id_paciente');
  }

  // UN ESTUDIO PUEDE TENER ASIGNADO UNA PRESTACION
  public function prestacion()
  {
      return $this->belongsTo('App\Prestacion','id_prestacion');
  }

  // UN ESTUDIO PUEDE TENER MUCHOS PAGOS DE OBRAS SOCIALES
  public function pagosObrasSociales()
  {
      return $this->hasMany('App\PagoObraSocial','id_estudio');
  }

  // UN ESTUDIO PUEDE TENER MUCHOS PAGOS DE PARTICULARES
  public function pagosParticulares()
  {
      return $this->hasMany('App\PagoParticular','id_estudio');
  }

}
