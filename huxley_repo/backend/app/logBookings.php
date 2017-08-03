<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\perfilCliente;
use App\Contenedor;
use App\Bookings;

class logBookings extends Model
{
    protected $fillable = [
		'accion',
		'contenedor',
		'descripcion',
		'fecha',
		'usuario',
		'booking',
	];
	protected $table = "logBooking";
	
	 public function perfilCliente()
    {
    	return $this->belongsTo(perfilCliente::class);
  
    }
    
     public function Contenedor()
    {
    	return $this->belongsTo(Contenedor::class);
  
    }
     public function Bookings()
    {
    	return $this->belongsTo(Bookings::class);
  
    }
}
