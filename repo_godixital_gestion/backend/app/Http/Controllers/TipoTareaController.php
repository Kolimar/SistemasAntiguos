<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\TipoTarea;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class TipoTareaController extends Controller
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

            $query1= "tipos_tareas.nombre LIKE '%$request->nombre%'";

        }else{

            $query1= "tipos_tareas.nombre LIKE '%$request->nombre%'";

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

        $tiposTareas= TipoTarea::
          whereRaw(\DB::raw($query1))
          ->orderBy($columna,$ord)
          ->offset($offset)
          ->limit(10)
          ->get();

          return response()->json($tiposTareas);

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

            $tipoTarea= new TipoTarea($request->all());
            $tipoTarea->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $tipoTarea->created_by= $user->id;
            $tipoTarea->save();

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

            $tipoTarea= TipoTarea::FindOrFail($id);
            $tipoTarea->nombre= $request->nombre;
            $tipoTarea->save();

            $tiposTareas= TipoTarea::orderBy('nombre','ASC')->where('id','=',$id)->get();

            \DB::commit();
            return response()->json($tiposTareas);

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

          $verificarTareas= TipoTarea::find($id)->tareas()->where('visible','=',1)->get();
          $verificarTareasTemplates= TipoTarea::find($id)->tareasTemplates()->get();
          $verificarTareasTemplatesServicios= TipoTarea::find($id)->tareasTemplatesDeServicios()->get();

          if (!$verificarTareas->isEmpty() || !$verificarTareasTemplates->isEmpty() || !$verificarTareasTemplatesServicios->isEmpty()) {

            return response()->json("No es posible eliminar este tipo de tarea, existen tareas, tareas templates o tareas templates de servicios que lo usan", 409);

          }else{

            $eliminar= TipoTarea::find($id)->delete();
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
