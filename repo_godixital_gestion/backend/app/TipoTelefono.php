<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoTelefono extends Model
{
  public $timestamps = false;

  protected $table = 'tipos_telefonos';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    public function telefonos()
    {
        return $this->hasMany('App\TelefonoContacto');
    }

    public function telefonos_clientes()
    {
        return $this->hasMany('App\TelefonoContactoCliente');
    }

    // UN TIPO DE TELEFONO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
