<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Tarea;

use App\Subtarea;

use App\TareaTemplate;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

use Carbon\Carbon;

class SubtareaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        //

    }

    public function getListado($id)
    {

        $subtareas= Subtarea::
            select('*')
            ->where('id_tarea','=',$id)
            ->orderBy('titulo','ASC')
            ->get();

        return response()->json($subtareas);

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

    public function updateTareas($id_tarea){

        try {

            $count_total= Subtarea::where('id_tarea','=',$id_tarea)->count('id');
            $count_completas= Subtarea::where('id_tarea','=',$id_tarea)->where('completa','=',1)->count('id');

            $tareas= Tarea::FindOrFail($id_tarea);
            $tareas->cantidad_subtareas= $count_total;
            $tareas->cantidad_subtareas_completadas= $count_completas;
            $tareas->save();

        } catch (Exception $e) {

            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);

        }

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

            $subtareas= new Subtarea($request->all());
            $subtareas->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $subtareas->created_by= $user->id;
            $subtareas->completa= 0;
            $subtareas->save();

            if ($subtareas) {

                $this->updateTareas($request->id_tarea);

            }

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
    public function update(Request $request)
    {

        try {
            \DB::beginTransaction();

            $subtareas= \DB::table('subtareas')
                ->where('id', $request->id)
                ->update([$request->column => $request->editval]);

            if ($subtareas) {

                $this->updateTareas($request->id_tarea);
            }

            \DB::commit();
            return response()->json('Registro ok', 200);


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
    public function destroy(Request $request)
    {

        try {
            \DB::beginTransaction();

            $subtareas = Subtarea::find($request->id);

            if ($subtareas) {

                $subtareas->delete();

                $this->updateTareas($request->id_tarea);

                \DB::commit();
                return response()->json('Eliminacion ok', 200);

            }else{

                return response()->json('Registro no encontrado', 404);
            }

        } catch (Exception $e) {

            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);

        }

    }



}
