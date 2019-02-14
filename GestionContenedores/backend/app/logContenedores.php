<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\perfilCliente;
use App\Contenedor;

class logContenedores extends Model
{
  	protected $fillable = [
		'accion',
		'contenedor',
		'descripcion',
		'fecha',
		'usuario',
	];

	protected $table = "logContenedor";
	
     public function perfilCliente()
    {
    	return $this->belongsTo(perfilCliente::class);
  
    }
     public function Contenedor()
    {
    	return $this->belongsTo(Contenedor::class);
  
    }

}
