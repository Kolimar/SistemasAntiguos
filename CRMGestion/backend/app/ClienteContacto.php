<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClienteContacto extends Model
{

  public $timestamps = false;

  protected $table = 'clientes_contactos';

    protected $fillable = [
        'id_cliente',
        'id_contacto_cliente',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
