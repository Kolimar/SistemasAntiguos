<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
  public $timestamps = false;
  protected $table = 'contactos';

    protected $fillable = [
        'nombre',
        'es_principal',
        'religion_judia',
        'medio_contacto',
        'comentarios',
        'created_by',
        'created_at',
    ];

    // UN CONTACTO PUEDE TENER MUCHOS TELEFONOS DE CONTACTO
    public function telefonosContactos()
    {
        return $this->hasMany('App\TelefonoContacto','id_contacto');
    }

    // UN CONTACTO PUEDE TENER MUCHOS EMAILS DE CONTACTO
    public function emailsContactos()
    {
        return $this->hasMany('App\EmailContacto','id_contacto');
    }

    // MUCHOS BRIEFS PUEDENE TENER MUCHOS CONTACTOS
    public function briefs()
    {
        return $this->belongsToMany('App\Brief', 'briefs_contactos', 'id_contacto', 'id_brief');
    }

    // MUCHOS CONTACTOS DE BRIEFS PUEDES TENER MUCHOS ROLES
    public function rolesContactos()
    {
        return $this->belongsToMany('App\RolContacto', 'contactos_roles', 'id_contacto', 'id_rol_contacto');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
