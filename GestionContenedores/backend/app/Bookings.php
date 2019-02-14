<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\logBookings;
class Bookings extends Model
{

	protected $fillable = [
		'codigo',
		'cantidad_egresos',
		'limite_contenedores',
    ];

     public function logBookings()
    {
        return $this->HasMany(logBookings::class);
  
    }
}
