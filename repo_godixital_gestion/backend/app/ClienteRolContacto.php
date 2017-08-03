<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClienteRolContacto extends Model
{

  public $timestamps = false;

  protected $table = 'contactos_clientes_roles';

    protected $fillable = [
        'id_contacto_cliente',
        'id_rol_contacto',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
