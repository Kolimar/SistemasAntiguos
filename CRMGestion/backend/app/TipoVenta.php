<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoVenta extends Model
{
  public $timestamps = false;

  protected $table = 'tipos_ventas';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    // MUCHOS TIPOS DE EMPRESA PUEDEN SER USADOS POR MUCHOS BRIEFS
    public function briefs()
    {
        return $this->belongsToMany('App\Brief', 'briefs_tipos_ventas', 'id_tipo_venta', 'id_brief');
    }

    // MUCHOS TIPOS DE EMPRESA PUEDEN SER USADOS POR MUCHOS CLIENTES
    public function clientes()
    {
        return $this->belongsToMany('App\Cliente', 'clientes_tipos_ventas', 'id_tipo_venta', 'id_cliente');
    }

    // UN METODO DE FACTURACION PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
