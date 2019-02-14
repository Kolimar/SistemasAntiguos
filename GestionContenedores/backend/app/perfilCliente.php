<?php

namespace App;

use App\User;
use App\Movimiento;
use App\logBookings;

class perfilCliente extends User
{
	
    public function Movimientos()
    {
    	return $this->HasMany(Movimiento::class);
  
    }
    public function logBookings()
    {
    	return $this->HasMany(logBookings::class);
  
    }
    
     public function logContenedores()
    {
    	return $this->HasMany(logContenedores::class);
  
    }

}
