<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class pertenece
{
    use HandlesAuthorization;

    public function owner($auth){
    	return $auth;
    }
}
