<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class esAdmin
{
    use HandlesAuthorization;
     public function adminUser(User $user){
        return User::esAdmin($user);
   }
}
