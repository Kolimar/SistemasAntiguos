<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\MotivoLog;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class MotivoLogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        // QUERY PARA NOMBRE
        if ($request->nombre && $request->nombre != " ") {

            $query1= "motivos_logs.nombre LIKE '%$request->nombre%'";

        }else{

            $query1= "motivos_logs.nombre LIKE '%$request->nombre%'";

        }

        // QUERY PARA MILESTONE
        $query2= " ";
        if ($request->milestone == "1") {

            $query2= "AND motivos_logs.es_milestone = true";

        }elseif($request->milestone == "0"){

            $query2= "AND motivos_logs.es_milestone = false";

        }else{

            $query2= " ";

        }

        // QUERY PARA MILESTONE
        $query3= " ";
        if ($request->interes == "1") {

            $query3= "AND motivos_logs.interes_gerencial = true";

        }elseif($request->interes == "0"){

            $query3= "AND motivos_logs.interes_gerencial = false";

        }else{

            $query3= " ";

        }

        // ORDENAMIENTOS
        if ($request->nombre_ord) {
            $columna= 'nombre';
            $ord= $request->nombre_ord;
        }else{
            $columna= 'nombre';
            $ord= 'ASC';
        }

        // LIMITE
        $offset= ((int)$request->pagina) * 10;

        $motivosLogs= MotivoLog::
          whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " AND motivos_logs.tipo = 'M' "))
          ->orderBy($columna,$ord)
          ->offset($offset)
          ->limit(10)
          ->get();

          return response()->json($motivosLogs);

    }

    // LISTADO DE MOTIVOS DE LOG MANUALES
    public function getListadoMotivosLogsManuales()
    {
        $motivosLogs= MotivoLog::orderBy('nombre','ASC')->where('tipo','=','M')->get();
        return response()->json($motivosLogs);
    }

    // LISTADO DE MOTIVOS DE LOGS
    public function getListadoMotivosLogs()
    {
        $motivosLogs= MotivoLog::orderBy('nombre','ASC')->get();
        return response()->json($motivosLogs);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {

            \DB::beginTransaction();

            JWTAuth::parseToken();
            $user = JWTAuth::parseToken()->authenticate();

            $motivoLog= new MotivoLog($request->all());
            $motivoLog->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $motivoLog->created_by= $user->id;
            $motivoLog->tipo= "M";
            $motivoLog->save();

            \DB::commit();
            return response()->json('Registro ok', 201);

        }catch (Exception $e) {
            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        try {

            \DB::beginTransaction();

            $motivoLog= MotivoLog::FindOrFail($id);
            $motivoLog->nombre= $request->nombre;
            $motivoLog->es_milestone= $request->es_milestone;
            $motivoLog->interes_gerencial= $request->interes_gerencial;
            $motivoLog->save();

            $motivosLogs= MotivoLog::orderBy('nombre','ASC')->where('id','=',$id)->get();

            \DB::commit();
            return response()->json($motivosLogs);

        }catch (Exception $e) {
            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        try {

          $verificarLog= MotivoLog::find($id)->logs()->get();

          if (!$verificarLog->isEmpty()) {

            return response()->json("No es posible eliminar este motivo de log, existen logs que lo usan", 409);

          }else{

            $eliminar= MotivoLog::find($id)->delete();
            \DB::commit();
            return response()->json("ok", 200);

          }

        } catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }
}
