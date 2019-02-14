<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\ObraSocial;

class ObraSocialController extends Controller
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

          $query1= "obras_sociales.nombre LIKE '%$request->nombre%'";

      }else{

          $query1= "obras_sociales.nombre LIKE '%$request->nombre%'";

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

      $obrasSociales= ObraSocial::
        whereRaw(\DB::raw($query1))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($obrasSociales, 200);

    }

    public function listado()
    {
      $obrasSociales= ObraSocial::orderBy('nombre','ASC')->get();
      return response()->json($obrasSociales);
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

          $prestacion= new ObraSocial($request->all());
          $prestacion->created_at= Carbon::now('America/Argentina/Buenos_Aires');
          $prestacion->created_by= $user->id;
          $prestacion->save();

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

          $obraSocial= ObraSocial::FindOrFail($id);
          $obraSocial->nombre= $request->nombre;
          $obraSocial->save();

          $obrasSociales= ObraSocial::orderBy('nombre','ASC')->where('id','=',$id)->get();

          \DB::commit();
          return response()->json($obrasSociales);

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

        $verificarObraSocial= ObraSocial::find($id)->pacientes()->get();

        if (!$verificarObraSocial->isEmpty()) {

            return response()->json("No es posible eliminar esta obra social, existen pacientes que la usan", 409);

        }else{

            $obraSocial= ObraSocial::find($id);
            $obraSocial->delete();
            \DB::commit();
            return response()->json('Ok', 200);

        }


      } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);

      }

    }
}
