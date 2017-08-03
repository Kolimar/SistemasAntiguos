<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transportista extends Model
{
	
	 protected $fillable = [
		'nombre',
		'patente',
		'documento',
		'patente_semi',
		'empresa',
    ];
		
    
}
