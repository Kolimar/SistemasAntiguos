<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmailContacto extends Model
{
  public $timestamps = false;
  protected $table = 'emails_contactos';
  protected $fillable = [
      'id_contacto',
      'tipo',
      'email',
      'created_at',
      'created_by'
  ];

  // UN EMAIL PERTENECE A UN CONTACTO
  public function contacto()
  {
      return $this->belongsTo('App\Contacto','id_contacto');
  }

  // UN EMAIL DE CONTACTO DE BRIEF PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

}
