<?php

namespace App;

use App\variable;
use Illuminate\Database\Eloquent\Model;

class medicion extends Model
{
       protected $fillable = [
    	'variable_id',
    	'valor',
    	'created_at',

    	];

    	public function variable()
    	{
    		return $this->belongsTo(variable::class);
    	}
}
