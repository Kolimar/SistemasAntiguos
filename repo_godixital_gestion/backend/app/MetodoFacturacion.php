<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetodoFacturacion extends Model
{
  
  public $timestamps = false;

  protected $table = 'metodos_facturacion';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    public function briefs()
    {
        return $this->hasMany('App\Brief');
    }

    public function clientes()
    {
        return $this->hasMany('App\Cliente');
    }

    // UN METODO DE FACTURACION PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
