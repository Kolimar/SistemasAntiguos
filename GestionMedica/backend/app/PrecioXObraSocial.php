<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PrecioXObraSocial extends Model
{

  public $timestamps = false;
  protected $table = 'precios_x_obras_sociales';
  protected $fillable = [
      'id_prestacion',
      'id_obra_social',
      'precio',
      'created_by'
  ];

  // UNA PRECIO POR OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

}
