<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CanalAdquisicion extends Model
{
  public $timestamps = false;

  protected $table = 'canales_adquisicion';

    protected $fillable = [
        'nombre',
        'created_at',
        'created_by'
    ];

    // MUCHOS CANALES DE ADQUISICION PUEDEN SER USADOS POR MUCHOS BRIEFS
    public function briefs()
    {
        return $this->belongsToMany('App\Brief', 'briefs_canales_adquisicion', 'id_canal_adquisicion', 'id_brief');
    }

    // MUCHOS CANALES DE ADQUISICION PUEDEN SER USADOS POR MUCHOS CLIENTES
    public function clientes()
    {
        return $this->belongsToMany('App\Cliente', 'clientes_canales_adquisicion', 'id_canal_adquisicion', 'id_cliente');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
