<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{

    use Notifiable;
    public $timestamps = false;
    protected $table = 'users';
    protected $fillable = [
        'nombres',
        'apellidos',
        'email',
        'created_at',
        'id_rol'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS PRESTACIONES
    public function creadorPrestaciones()
    {
        return $this->hasMany('App\Prestacion','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS OBRAS SOCIALES
    public function creadorObrasSociales()
    {
        return $this->hasMany('App\ObraSocial','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS DOCTORES
    public function creadorDoctores()
    {
        return $this->hasMany('App\Doctor','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS PARTICULARES
    public function creadorParticulares()
    {
        return $this->hasMany('App\Particular','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS PRECIOS POR OBRAS SOCIALES
    public function creadorPreciosXObrasSociales()
    {
        return $this->hasMany('App\PrecioXObraSocial','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS PRECIOS POR PARTICULARES
    public function creadorPreciosXParticulares()
    {
        return $this->hasMany('App\PrecioXParticular','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS VISITAS
    public function creadorVisitas()
    {
        return $this->hasMany('App\Visita','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS VISITAS
    public function creadorIngresosGastos()
    {
        return $this->hasMany('App\IngresoGasto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS ESTUDIOS
    public function creadorEstudios()
    {
        return $this->hasMany('App\IngresoGasto','created_by');
    }

    // UN USUARIO PUEDE TENER UN ROL
    public function rol()
    {
        return $this->belongsTo('App\Rol','id_rol');
    }

    // UN USUARIO PUEDE SER CREADOR DE PAGOS DE OBRAS SOCIALES
    public function creadorPagosObrasSociales()
    {
        return $this->hasMany('App\PagoObraSocial','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE PAGOS DE PARTICULARES
    public function creadorPagoParticulares()
    {
        return $this->hasMany('App\PagoParticular','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE PAGOS EXTRAS DE OBRAS SOCIALES
    public function creadorPagosExtrasObrasSociales()
    {
        return $this->hasMany('App\PagoExtraObraSocial','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE PAGOS EXTRAS DE PARTICULARES
    public function creadorPagosExtrasParticulares()
    {
        return $this->hasMany('App\PagoExtraParticular','created_by');
    }

}
