<?php

namespace App\Http\Middleware;

use Closure;

class loginVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = \App\User::where('email',$request->username)->firstOrFail();
        
          if ($user->verified=="1"){
                return $next($request);
            }else{
               return response()->json("no autenticado",433);
            }
    }
}
