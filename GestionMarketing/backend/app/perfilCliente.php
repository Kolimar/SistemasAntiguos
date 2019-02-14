<?php

namespace App;

use App\User;
use App\dispositivo;

class perfilCliente extends User
{
	
 public function dispositivos()
 {
 	return $this->hasMany(dispositivo::class);
 }

}
