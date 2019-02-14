<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Prestacion;

class PrestacionController extends Controller
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

          $query1= "prestaciones.nombre LIKE '%$request->nombre%'";

      }else{

          $query1= "prestaciones.nombre LIKE '%$request->nombre%'";

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

      $prestaciones= Prestacion::
        whereRaw(\DB::raw($query1))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($prestaciones, 200);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function cmbListado()
    {
      $prestaciones = Prestacion::
        with('particulares')
        ->with('obrasSociales')
        ->orderBy('nombre','ASC')->get();
      return response()->json($prestaciones, 200);
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

          $prestacion= new Prestacion($request->all());
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

          $prestacion= Prestacion::FindOrFail($id);
          $prestacion->nombre= $request->nombre;
          $prestacion->save();

          $prestaciones= Prestacion::orderBy('nombre','ASC')->where('id','=',$id)->get();

          \DB::commit();
          return response()->json($prestaciones, 200);

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

          $verificarOS= Prestacion::find($id)->obrasSociales()->get();
          $verificarPart= Prestacion::find($id)->particulares()->get();

          if (!$verificarOS->isEmpty() || !$verificarPart->isEmpty()) {
            return response()->json("No es posible eliminar esta prestación, existen precios de obras sociales o particulares que la usan", 409);
          }else{

            $particular= Prestacion::find($id);
            $particular->delete();
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
