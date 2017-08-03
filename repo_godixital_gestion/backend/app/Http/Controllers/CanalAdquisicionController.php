<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\CanalAdquisicion;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class CanalAdquisicionController extends Controller
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

          $query1= "canales_adquisicion.nombre LIKE '%$request->nombre%'";

      }else{

          $query1= "canales_adquisicion.nombre LIKE '%$request->nombre%'";

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

      $canalesAdquisicion= CanalAdquisicion::
        whereRaw(\DB::raw($query1))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($canalesAdquisicion);
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

            $CanalAdquisicion= new CanalAdquisicion($request->all());
            $CanalAdquisicion->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $CanalAdquisicion->created_by= $user->id;
            $CanalAdquisicion->save();

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

            $CanalAdquisicion= CanalAdquisicion::FindOrFail($id);
            $CanalAdquisicion->nombre= $request->nombre;
            $CanalAdquisicion->save();

            $canalesAdquisicion= CanalAdquisicion::orderBy('nombre','ASC')->where('id','=',$id)->get();

            \DB::commit();
            return response()->json($canalesAdquisicion);

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

          $verificarCanalBrief= CanalAdquisicion::find($id)->briefs()->get();
          $verificarCanalCliente= CanalAdquisicion::find($id)->clientes()->get();

          if (!$verificarCanalBrief->isEmpty() || !$verificarCanalCliente->isEmpty()) {

            return response()->json("No es posible eliminar este canal de adquisición, existen clientes y briefs de ventas que lo usan", 409);

          }else{

            $eliminar= CanalAdquisicion::find($id)->delete();
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
