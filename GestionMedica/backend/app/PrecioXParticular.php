<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PrecioXParticular extends Model
{
  public $timestamps = false;
  protected $table = 'precios_x_particulares';
  protected $fillable = [
      'id_prestacion',
      'id_particular',
      'precio',
      'created_by'
  ];

  // UNA PRECIO POR OBRA SOCIAL PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }
}
