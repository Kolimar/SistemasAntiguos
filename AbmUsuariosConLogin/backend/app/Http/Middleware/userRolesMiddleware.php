<?php

namespace App\Http\Middleware;

use Closure;


class userRolesMiddleware
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
        
        $response = $next($request);
     /*   $array =  (array) $response;
        foreach ($array as $key => $value) {
            $array2[] = $value;
        }
        $prueba = $array2[1];
       // print $prueba->{'token_type'};
        print($prueba[0]);
        exit;
        //var_dump(array_keys($array));*/
        //var_dump($array[0]);
        return $response;
    }
}
