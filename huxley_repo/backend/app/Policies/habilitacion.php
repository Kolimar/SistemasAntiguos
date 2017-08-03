<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class habilitacion
{
    use HandlesAuthorization;

   public function habilitado(User $user){
        return $user->verified;
   }
   public function adminUser(User $user){
        return $user->admin=="true";
   }
}
