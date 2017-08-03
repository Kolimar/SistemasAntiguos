<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Prestacion extends Model
{

  public $timestamps = false;
  protected $table = 'prestaciones';
  protected $fillable = [
      'nombre',
      'created_at',
      'created_by'
  ];

  // UNA PRESTACION PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

  // UNA O MUCHAS PRESTACIONES PUEDEN TENER MUCHOS PRECIOS
  public function obrasSociales()
  {
      return $this->belongsToMany('App\ObraSocial', 'precios_x_obras_sociales', 'id_prestacion', 'id_obra_social')->withPivot('id','precio');
  }

  // UNA O MUCHAS PRESTACIONES PUEDEN TENER MUCHOS PRECIOS
  public function particulares()
  {
      return $this->belongsToMany('App\Particular', 'precios_x_particulares', 'id_prestacion', 'id_particular')->withPivot('id','precio');
  }

  // UNA PRESTACION PÚEDE PERTENECER A MUCHOS ESTUDIOS
  public function estudios()
  {
      return $this->hasMany('App\Estudio','id_prestacion');
  }

}
