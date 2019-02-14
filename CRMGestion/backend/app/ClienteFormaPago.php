<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClienteFormaPago extends Model
{
  public $timestamps = false;

  protected $table = 'clientes_formas_pagos';

    protected $fillable = [
        'id_cliente',
        'id_forma_pago',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }
}
