<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
  public $timestamps = false;

  protected $table = 'formas_pagos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'created_at',
        'created_by'
    ];

    // UNA FORMA DE PAGO PUEDE ESTAR EN MUCHOS CLIENTES
    public function clientes()
    {
        return $this->hasMany('App\Cliente', 'id_forma_pago');
    }

    // UNA FORMA DE PAGO PUEDE SER CREADA POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
