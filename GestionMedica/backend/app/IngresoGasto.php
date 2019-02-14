<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class IngresoGasto extends Model
{

  public $timestamps = false;
  protected $table = 'ingresos_gastos';
  protected $fillable = [
      'fecha',
      'motivo',
      'monto',
      'descripcion',
      'tipo_caja',
      'created_at',
      'created_by',
  ];

  // UNA OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

}
