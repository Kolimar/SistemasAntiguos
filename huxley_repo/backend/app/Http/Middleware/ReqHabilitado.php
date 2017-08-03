<?php

namespace App\Http\Middleware;

use Closure;

class ReqHabilitado
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
        $estado = $request->user()->verified;
        if ($estado=="1"){
            return $next($request);
        }else{
            return response()->json('Su usuario ha sido deshabilitado si cree que es un error contacte al administrador',433);
        }

    }
}
