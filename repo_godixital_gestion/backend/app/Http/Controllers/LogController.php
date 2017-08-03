<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Log;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      $user = JWTAuth::parseToken()->authenticate();

      // QUERY PARA FECHA
      if ($request->fecha && $request->fecha != " ") {

          $query1= "logs.fecha_hora LIKE '%$request->fecha%'";

      }else{

          $query1= "logs.fecha_hora LIKE '%$request->fecha%'";

      }

      // QUERY PARA CREADOR
      if((int)$request->creador == -1){

          $query2= " ";

      }else if ($request->creador && $request->creador != " ") {

          $query2= "AND logs.id_creador = $request->creador";

      }else{

          $query2= "AND logs.id_creador = $user->id";

      }

      // QUERY PARA CLIENTE
      if ($request->cliente && $request->cliente != " ") {

          $query3= "AND logs.id_cliente = $request->cliente";

      }else{

          $query3= " ";

      }

      // QUERY PARA MOTIVO LOG
      if ($request->motivo && $request->motivo != " ") {

          $query4= "AND logs.id_motivo = $request->motivo";

      }else{

          $query4= " ";

      }

      // QUERY PARA DESCRIPCION
      if ($request->descripcion && $request->descripcion != " ") {

          $query5= "AND logs.descripcion LIKE '%$request->descripcion%'";

      }else{

          $query5= " ";

      }

      // ORDENAMIENTOS
      if ($request->fecha_ord) {
          $columna= 'fecha_hora';
          $ord= $request->fecha_ord;
      }else{
          $columna= 'fecha_hora';
          $ord= 'ASC';
      }

      // LIMITE
      $offset= ((int)$request->pagina) * 10;

      $logs= Log::
        leftjoin('users','users.id','=','logs.id_creador')
        ->leftjoin('puestos','puestos.id','=','users..id_puesto')
        ->leftjoin('clientes','clientes.id','=','logs.id_cliente')
        ->leftjoin('motivos_logs','motivos_logs.id','=','logs.id_motivo')
        ->select('logs.*','clientes.id as id_cliente','clientes.nombre as nombre_cliente','users.id as id_user','users.nombres as nombres_creador','users.apellidos as apellidos_creador','motivos_logs.id as id_motivo','motivos_logs.nombre as nombre_motivo','motivos_logs.es_milestone as es_milestone','motivos_logs.tipo as tipo_motivo_log','puestos.nombre as nombre_puesto')
        ->whereRaw(\DB::raw($query1 . "  " . $query2 . " " . $query3 . " " . $query4 . " " . $query5))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($logs);

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

          $log= new Log($request->all());
          $log->created_at= Carbon::now('America/Argentina/Buenos_Aires');
          $log->fecha_hora= Carbon::now('America/Argentina/Buenos_Aires');
          $log->id_creador= $user->id;
          $log->save();

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

          $log= Log::FindOrFail($id);
          $log->id_cliente= $request->id_cliente;
          $log->id_motivo= $request->id_motivo;
          $log->descripcion= $request->descripcion;
          $log->save();

          $logs= Log::
            leftjoin('users','users.id','=','logs.id_creador')
            ->leftjoin('puestos','puestos.id','=','users..id_puesto')
            ->leftjoin('clientes','clientes.id','=','logs.id_cliente')
            ->leftjoin('motivos_logs','motivos_logs.id','=','logs.id_motivo')
            ->select('logs.*','clientes.id as id_cliente','clientes.nombre as nombre_cliente','users.id as id_user','users.nombres as nombres_creador','users.apellidos as apellidos_creador','motivos_logs.id as id_motivo','motivos_logs.nombre as nombre_motivo','motivos_logs.es_milestone as es_milestone','motivos_logs.tipo as tipo_motivo_log','puestos.nombre as nombre_puesto')
            ->where('logs.id','=',$id)
            ->get();

          \DB::commit();
          return response()->json($logs);

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

          \DB::beginTransaction();

          $log= Log::find($id);
          $log->delete();

          \DB::commit();
          return response()->json("ok", 200);

        } catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }
}
