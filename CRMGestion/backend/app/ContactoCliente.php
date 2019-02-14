<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactoCliente extends Model
{
  public $timestamps = false;
  protected $table = 'contactos_clientes';

    protected $fillable = [
        'nombre',
        'es_principal',
        'religion_judia',
        'medio_contacto',
        'comentarios',
        'eliminado',
        'created_by',
        'created_at',
    ];


    // UN CONTACTO PUEDE TENER MUCHOS TELEFONOS DE CONTACTO
    public function telefonosContactos()
    {
        return $this->hasMany('App\TelefonoContactoCliente','id_contacto_cliente');
    }

    // UN CONTACTO PUEDE TENER MUCHOS EMAILS DE CONTACTO
    public function emailsContactos()
    {
        return $this->hasMany('App\EmailContactoCliente','id_contacto_cliente');
    }

    // MUCHOS CONTACTOS DE CLIENTES PUEDEN PERTENECER A MUCHOS CLIENTES
    public function clientes()
    {
        return $this->belongsToMany('App\Cliente', 'clientes_contactos', 'id_contacto_cliente', 'id_cliente');
    }

    // MUCHOS CONTACTOS DE CLIENTES PUEDES TENER MUCHOS ROLES
    public function rolesContactos()
    {
        return $this->belongsToMany('App\RolContacto', 'contactos_clientes_roles', 'id_contacto_cliente', 'id_rol_contacto');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
