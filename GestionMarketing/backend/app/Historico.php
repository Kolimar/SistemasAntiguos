<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Historico extends Model
{
	protected $fillable = [
	'variable_id',
	'fecha_ultima_medicion',
	'ultima_medicion',
	'cantidad_mediciones',
	'suma_mediciones',
	'json',
	'created_at'
	];
	protected $table='historicos';
	protected $hidden = [
        'json',        
    ];
	public function variable()
	{
		return $this->belongsTo(variable::class);
	}
}
