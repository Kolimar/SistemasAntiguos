<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class VerificarUsuarioHabilitado
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

        $user = JWTAuth::parseToken()->authenticate();
        if ($user->habilitado == false) {
          return response()->json("El usuario está deshabilitado", 401);
        }else{
          return $next($request);
        }

    }
}
