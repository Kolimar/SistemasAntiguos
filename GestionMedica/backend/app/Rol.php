<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{

  public $timestamps = false;
  protected $table = 'roles';
  protected $fillable = [
      'nombre'
  ];

  // UN ROL PUEDE SER DE MUCHOS USUARIOS
  public function users()
  {
      return $this->hasMany('App\User','id_rol');
  }

}
