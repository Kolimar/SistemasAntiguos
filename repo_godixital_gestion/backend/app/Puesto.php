<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Puesto extends Model
{
	public $timestamps = false;

	protected $table = 'puestos';

    protected $fillable = [
        'nombre',
    ];

		// UN PUESTO PUEDE TENER A MUCHOS USUARIOS
    public function users()
    {
        return $this->hasMany('App\User', 'id_puesto');
    }

}
