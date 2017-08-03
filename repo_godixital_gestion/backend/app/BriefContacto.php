<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BriefContacto extends Model
{

  public $timestamps = false;

  protected $table = 'briefs_contactos';

    protected $fillable = [
        'id_brief',
        'id_contacto',
        'created_at',
        'created_by'
    ];

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

}
