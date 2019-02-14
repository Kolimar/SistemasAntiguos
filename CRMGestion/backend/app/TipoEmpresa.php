<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoEmpresa extends Model
{
  public $timestamps = false;

  protected $table = 'tipos_empresas';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    // MUCHOS TIPOS DE EMPRESA PUEDEN SER USADOS POR MUCHOS BRIEFS
    public function briefs()
    {
        return $this->belongsToMany('App\Brief', 'briefs_tipos_empresas', 'id_tipo_empresa', 'id_brief');
    }

    // MUCHOS TIPOS DE EMPRESA PUEDEN SER USADOS POR MUCHOS CLIENTES
    public function clientes()
    {
        return $this->belongsToMany('App\Cliente', 'clientes_tipos_empresas', 'id_tipo_empresa', 'id_cliente');
    }

    // UN TIPO DE EMPRESA PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
