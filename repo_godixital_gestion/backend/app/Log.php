<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Carbon\Carbon;

class Log extends Model
{

  public $timestamps = false;

  protected $table = 'logs';

    protected $fillable = [
        'fecha_hora',
        'id_creador',
        'id_cliente',
        'id_motivo',
        'descripcion',
        'created_at'
    ];

    // UN LOG PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','id_creador');
    }

    // UN LOG PUEDE TENER UN CLIENTE
    public function cliente()
    {
        return $this->belongsTo('App\Cliente','id_cliente');
    }

    // UN LOG PUEDE TENER UN MOTIVO
    public function motivoLog()
    {
        return $this->belongsTo('App\MotivoLog','id_motivo');
    }

    // REGISTRAR LOG AUTOMATICO
    static function registrarLog($id_cliente, $id_motivo, $descripcion)
    {

        $user = JWTAuth::parseToken()->authenticate();

        $log= new Log;
        $log->fecha_hora= Carbon::now('America/Argentina/Buenos_Aires');
        $log->id_creador= $user->id;
        $log->id_cliente= $id_cliente;
        $log->id_motivo= $id_motivo;
        $log->descripcion= $descripcion;
        $log->created_at= Carbon::now('America/Argentina/Buenos_Aires');
        $log->save();

    }

}
