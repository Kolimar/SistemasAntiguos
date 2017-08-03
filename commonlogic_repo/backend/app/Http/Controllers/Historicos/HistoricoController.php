<?php

namespace App\Http\Controllers\Historicos;

use App\Historico;
use App\variable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class HistoricoController extends Controller
{
   public function cron(){

   
   try{

   	\DB::beginTransaction();

   $variables = variable::all();
   $array=[];

   foreach ($variables as $key => $value) {

  	$historico = new Historico;
   	$historico->variable_id = $value ->id;
	$historico->fecha_ultima_medicion = $value->fecha_ultima_medicion;
	$historico->ultima_medicion = $value->ultima_medicion;
	$historico->cantidad_mediciones = $value->cantidad_mediciones;
	$historico->suma_mediciones = $value->suma_mediciones;
	$historico->json = $value->json;
	$historico->created_at = Carbon::now('America/Argentina/Buenos_Aires');
    $historico->save();
	


   	$variable = variable::find($value->id);
   	$variable->cantidad_mediciones = null;
	$variable->suma_mediciones = null;
	$variable->json = null;
  	$variable->save();

   }


   \DB::commit();

   return response()->json('Operaciones históricas almacenadas con éxito', 200);


}catch(Exception $e){


	\DB::rollBack();
	
	Log::critical('Error en el Loop '. $e);

	return response()->json('Algo salio mal, intente mas tarde ', 500);
}
  /* 	id	variable_id	fecha_ultima_medicion	ultima_medicion	cantidad_mediciones	suma_mediciones	json*/
   }

public function index(Request $request){

//inicializo en 0 (false) cada instancia de la consulta que sirve para realizar los querys

$reglas = [
            'iotID'=> 'required',
            'inicio'=> 'required',
            'fin' => 'required'            
        ];
        
$this->validate($request, $reglas);
$dato1 = $request->iotID;
$dato2 = $request->inicio;
$dato3 = $request->fin;


$dataHistorico = variable::where('dispositivo_id', $dato1 )
                          ->with(['historico' => function ($query) use ($dato2, $dato3) {
                            $query->where('created_at','>', $dato2)
                                  ->where('created_at','<',$dato3)
                                  ->where('cantidad_mediciones', '>', '1')
                                  ->orderBy('created_at', 'asc');
                          }])
                          ->get();

  return response()->json(compact('dataHistorico'));
}



}
