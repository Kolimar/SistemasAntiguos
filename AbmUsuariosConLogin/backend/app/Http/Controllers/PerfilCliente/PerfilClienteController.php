<?php

namespace App\Http\Controllers\PerfilCliente;

use App\Http\Controllers\ApiController;
use App\Traits\showAll;
use App\User;
use App\perfilCliente;
use Illuminate\Http\Request;

class PerfilClienteController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $currentUser = request()->user();
        $this->authorize('adminUser', $currentUser);
        
        //inicializo en 0 (false) cada instancia de la consulta que sirve para realizar los querys
        $consulta = [];
        $consulta['nombre']=0;
        $consulta['apellido']=0;
        $consulta['correo']=0;
        $consulta['nombre_empresa']=0;
        $consulta['habilitado']=0;
        //los asigno
        foreach ($request->query() as $query => $value) {
            $consulta[$query] = $value;
        }
        //evaluo "cuando la posicion del array no es false", hago la consulta
        // IMPORTANTE: los Querys retornan colecciones laravel, las consultas raw devuelven array.
        // segun la documentacion de Laravel NO es conveniente usar raw por las inyecciones SQL y en este caso particular un array 
        // rompe el responser que esta esperando una coleccion.

        $clientes = User::where('admin','=','false')
                        ->when($consulta['nombre'], function ($query) use ($consulta) {
                                return $query->where("name", "LIKE", '%'.$consulta['nombre'].'%');
                            })
                        ->when($consulta['apellido'], function ($query) use ($consulta) {
                                return $query->where("last_name", "LIKE", '%'.$consulta['apellido'].'%');
                            })
                        ->when($consulta['correo'], function ($query) use ($consulta) {
                                return $query->where("email", "LIKE", '%'.$consulta['correo'].'%');
                            })
                        ->when($consulta['nombre_empresa'], function ($query) use ($consulta) {
                                return $query->where("empresa", "LIKE", '%'.$consulta['nombre_empresa'].'%');
                            })
                        ->when($consulta['habilitado'], function ($query) use ($consulta) {
                                return $query->where("verified", "=", $consulta['habilitado']);
                            })
                        ->get();
        //si no se cumple ninguna condicion when entonces se retorna el modelo clientes que tengan dispositivos();
        return $this->showAll($clientes);
        //return response()->json(['data' => $clientes]);
    }

    public function show($id)
    {
       /*$cliente = perfilCliente::has('dispositivos')->findOrFail($id);*/
       $cliente = User::findOrFail($id);
       
       return $this->showOne($cliente);
    }

}
