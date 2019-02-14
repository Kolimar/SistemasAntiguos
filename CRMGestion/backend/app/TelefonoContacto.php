<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TelefonoContacto extends Model
{
    public $timestamps = false;
    protected $table = 'telefonos_contactos';
    protected $fillable = [
        'id_contacto',
        'telefono',
        'id_tipo_telefono',
        'created_at',
        'created_by'
    ];

    // UN TELEFONO PERTENECE A UN CONTACTO
    public function contacto()
    {
        return $this->belongsTo('App\Contacto','id_contacto');
    }

    public function tipo_telefono()
    {
        return $this->belongsTo('App\TipoTelefono');
    }

    // UN TELEFONO DE CONTACTO DE BRIEF PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
