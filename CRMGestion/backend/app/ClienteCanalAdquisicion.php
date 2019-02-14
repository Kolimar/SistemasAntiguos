<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClienteCanalAdquisicion extends Model
{

    public $timestamps = false;

    protected $table = 'clientes_canales_adquisicion';

    protected $fillable = [
        'id_cliente',
        'id_canal_adquisicion',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
