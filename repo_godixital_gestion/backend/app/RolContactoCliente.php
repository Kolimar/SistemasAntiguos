<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RolContactoCliente extends Model
{
  public $timestamps = false;

  protected $table = 'roles_contactos';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    // MUCHOS ROLES DE CONTACTOS PUEDEN ESTAR EN MUCHOS CLIENTES
    public function contactosClientes()
    {
        return $this->belongsToMany('App\ContactoCliente', 'contactos_clientes_roles', 'id_rol_contacto', 'id_contacto_cliente');
    }

    // UN ROL DE CONTACTO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }
}
