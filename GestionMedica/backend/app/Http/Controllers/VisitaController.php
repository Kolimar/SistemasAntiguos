<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Visita;

class VisitaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      // QUERY PARA FECHA
      if ($request->fecha && $request->fecha != " ") {

          $query1= "visitas.fecha LIKE '%$request->fecha%'";

      }else{

          $query1= "visitas.fecha LIKE '%$request->fecha%'";

      }

      // QUERY PARA DESCRIPCION
      if ($request->descripcion && $request->descripcion != " ") {

          $query2= "AND visitas.descripcion LIKE '%$request->descripcion%'";

      }else{

          $query2= " ";

      }

      // ORDENAMIENTOS
      if ($request->fecha_ord) {
          $columna= 'fecha';
          $ord= $request->fecha_ord;
      }else{
          $columna= 'fecha';
          $ord= 'ASC';
      }

      // LIMITE
      $offset= ((int)$request->pagina) * 10;

      $visitas= Visita::
        whereRaw(\DB::raw($query1 . " " . $query2))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->where('id_doctor','=',$request->id_doctor)
        ->get();

        return response()->json($visitas, 200);

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

          $dateFecha= date_create($request->fecha);
          $fecha= date_format($dateFecha, 'Y-m-d');

          $visita= new Visita($request->all());
          $visita->fecha= $fecha;
          $visita->created_at= Carbon::now('America/Argentina/Buenos_Aires');
          $visita->created_by= $user->id;
          $visita->save();

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

          $dateFecha= date_create($request->fecha);
          $fecha= date_format($dateFecha, 'Y-m-d');

          $visita= Visita::FindOrFail($id);
          $visita->fecha= $fecha;
          $visita->descripcion= $request->descripcion;
          $visita->save();

          $visitas= Visita::orderBy('fecha','ASC')->where('id','=',$id)->get();

          \DB::commit();
          return response()->json($visitas);

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

          $visita= Visita::FindOrFail($id);
          $visita->delete();

          \DB::commit();
          return response()->json("ok", 200);

      }catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
      }

    }
}
