<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TelefonoContactoCliente extends Model
{
  public $timestamps = false;
  protected $table = 'telefonos_contactos_clientes';
  protected $fillable = [
      'id_contacto_cliente',
      'telefono',
      'id_tipo_telefono',
      'created_at',
      'created_by'
  ];

  // UN TELEFONO PERTENECE A UN CONTACTO
  public function contacto()
  {
      return $this->belongsTo('App\ContactoCliente','id_contacto_cliente');
  }

  public function tipo_telefono()
  {
      return $this->belongsTo('App\TipoTelefono');
  }

  // UN TELEFONO DE CONTACTO DE CLIENTE PUEDE SER CREADO POR UN USUARIO
  public function creadaPor()
  {
      return $this->belongsTo('App\User','created_by');
  }

}
