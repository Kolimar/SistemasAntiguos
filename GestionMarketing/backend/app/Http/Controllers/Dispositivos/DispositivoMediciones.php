<?php

namespace App\Http\Controllers\Dispositivos;


use App\dispositivo;
use App\variable;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\DB;

class DispositivoMediciones extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function apagarDispositivo(dispositivo $dispositivo, Request $request){

      $consulta = $dispositivo::find($request->id);
      $consulta->encendido_real = !$consulta->encendido_real;
      $consulta->save();
      $postActual = $dispositivo::find($request->id);
      
      return response()->json(compact('postActual'));

    }

    public function index(dispositivo $dispositivo,Request $request)
    {
        // $mediciones = $dispositivo->variables()
        //               ->with('ultimaMedicion')
        //               ->get();
        //
        // $mediciones que esta descomentado retorna los dispositivos, variables y
        // la ultima medicion, todo anidado

      if ($request->user()->admin == 'true') {

        $currentUser = $request->query('uid');

      }else{
        $currentUser = $request->user()->id;
      }

      $data = $dispositivo::where('perfil_cliente_id','=',$currentUser)
                                ->with('variables')
                                ->get();

      $contador = $dispositivo::where('perfil_cliente_id','=',$currentUser)
                                ->where('encendido','=','true')
                                ->count();

      $idDisp = $dispositivo::where('perfil_cliente_id','=',$currentUser)
                            ->whereRaw('encendido = 1')
                            ->pluck('id');
     
   if ($idDisp->isEmpty()) {
      $variablesCorrectas = 0;

      $variablesTotales = 0;
      
    }else{
      $variablesCorrectas = dispositivo::join('variables','variables.dispositivo_id','=','dispositivos.id')
                                        ->whereRaw(\DB::raw("
                                            dispositivos.perfil_cliente_id =  " .$currentUser. " and dispositivos.encendido = 1 and variables.status = 1 and variables.ultima_medicion IS NOT NULL and variables.rango_maximo >= variables.ultima_medicion and variables.rango_minimo <= variables.ultima_medicion
                                        "))
                                        ->count();

      $variablesTotales = dispositivo::join('variables','variables.dispositivo_id','=','dispositivos.id')
                                        ->whereRaw(\DB::raw("
                                            dispositivos.perfil_cliente_id =  " .$currentUser. " and variables.status = 1 and variables.ultima_medicion IS NOT NULL and dispositivos.encendido = 1 
                                        "))
                                        ->count();
    }

      return response()->json(compact('data','contador','variablesCorrectas','variablesTotales','idDisp'));
       # code...
    }

    public function update(dispositivo $dispositivo, Request $request){

      $consulta = $dispositivo::find($request->id);
      $consulta->encendido = !$consulta->encendido;
      $consulta->save();
      $postActual = $dispositivo::find($request->id);
      
      return response()->json(compact('postActual'));


    }

}
