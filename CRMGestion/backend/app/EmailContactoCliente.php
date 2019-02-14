<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmailContactoCliente extends Model
{
  public $timestamps = false;
  protected $table = 'emails_contactos_clientes';
  protected $fillable = [
      'id_contacto_cliente',
      'tipo',
      'email',
      'created_at',
      'created_by'
  ];

  // UN EMAIL PERTENECE A UN CONTACTO
  public function contacto()
  {
      return $this->belongsTo('App\ContactoCliente','id_contacto_cliente');
  }

  // UN EMAIL DE CONTACTO DE CLIENTE PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

}
