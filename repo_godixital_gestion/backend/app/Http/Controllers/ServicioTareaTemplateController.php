<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Servicio;

use App\ServicioTareaTemplate;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class ServicioTareaTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      // QUERY PARA TITULO

      if ($request->titulo && $request->titulo != " ") {

          $query1= "servicios_tareas_templates.titulo LIKE '%$request->titulo%'";

      }else{

          $query1= "servicios_tareas_templates.titulo LIKE '%$request->titulo%'";

      }

      // QUERY PARA DESCRIPCION

      if ($request->descripcion && $request->descripcion != " ") {

          $query2= "AND servicios_tareas_templates.descripcion LIKE '%$request->descripcion%'";

      }else{

          $query2= " ";

      }

      // QUERY PARA ES CRITICA

      if ($request->es_critica == "0") {

          $es_critica= 0;
          $query3= "AND servicios_tareas_templates.es_critica = $es_critica";

      }elseif ($request->es_critica == "1") {

          $es_critica= 1;
          $query3= "AND servicios_tareas_templates.es_critica = $es_critica";

      }else{

          $query3= " ";
      }

      // QUERY PARA ULTIMO milestone

      if ($request->ultimo_milestone == "0") {

          $ultimo_milestone= 0;
          $query4= "AND servicios_tareas_templates.ultimo_milestone = $ultimo_milestone";

      }elseif ($request->ultimo_milestone == "1") {

          $ultimo_milestone= 1;
          $query4= "AND servicios_tareas_templates.ultimo_milestone = $ultimo_milestone";

      }else{

          $query4= " ";
      }

      // QUERY PARA DIAS SUGERIDOS

      if ($request->dias_sugeridos && $request->dias_sugeridos != " ") {

          $query5= "AND servicios_tareas_templates.dias_sugeridos LIKE '%$request->dias_sugeridos%'";

      }else{

          $query5= " ";
      }

      // QUERY PARA PM AUTOMATICO

      if ($request->asigna_pm_automatico == "0") {

          $asigna_pm_automatico= 0;
          $query6= "AND servicios_tareas_templates.asigna_pm_automatico = $asigna_pm_automatico";

      }elseif ($request->asigna_pm_automatico == "1") {

          $asigna_pm_automatico= 1;
          $query6= "AND servicios_tareas_templates.asigna_pm_automatico = $asigna_pm_automatico";

      }else{

          $query6= " ";
      }

      // QUERY PARA TIPO DE TAREA

      if ($request->tipo_tarea && $request->tipo_tarea != " ") {

          $query7= "AND tipos_tareas.id = $request->tipo_tarea";

      }else{

          $query7= " ";

      }

      // ORDENAMIENTOS

      if ($request->titulo_ord) {

          $columna= 'titulo';
          $ord= $request->titulo_ord;

      }else{

          $columna= 'titulo';
          $ord= 'ASC';

      }

      // LIMITE

      $offset= ((int)$request->pagina) * 10;

      $serviciosT= ServicioTareaTemplate::
          join('tipos_tareas','tipos_tareas.id','=','servicios_tareas_templates.id_tipo_tarea')
          ->select('servicios_tareas_templates.*','tipos_tareas.id as id_tipo_tarea','tipos_tareas.nombre as tipo_tarea_nombre')
          ->whereRaw(\DB::raw($query1. " " .$query2. " " .$query3. " " .$query4. " " .$query5. " " .$query6. " " .$query7. " AND servicios_tareas_templates.id_servicio = $request->id_servicio "))
          ->orderBy($columna,$ord)
          ->offset($offset)
          ->limit(10)
          ->get();

      return response()->json($serviciosT);

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

            $serviciosT= new ServicioTareaTemplate($request->all());
            $serviciosT->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $serviciosT->created_by= $user->id;
            $serviciosT->save();

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

        $serviciosT= ServicioTareaTemplate::
            join('servicios','servicios.id','=','servicios_tareas_templates.id_servicio')
            ->select('servicios_tareas_templates.*','servicios.nombre as nombre_servicio')
            ->where('servicios_tareas_templates.id_servicio','=',$id)
            ->orderBy('servicios_tareas_templates.titulo','ASC')
            ->get();

        return response()->json($serviciosT);

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

            $serviciosT= ServicioTareaTemplate::FindOrFail($id);

            $serviciosT->titulo= $request->titulo;
            $serviciosT->descripcion= $request->descripcion;
            $serviciosT->id_tipo_tarea= $request->id_tipo_tarea;
            $serviciosT->es_critica= $request->es_critica;
            $serviciosT->ultimo_milestone= $request->ultimo_milestone;
            $serviciosT->dias_sugeridos= $request->dias_sugeridos;
            $serviciosT->asigna_pm_automatico= $request->asigna_pm_automatico;
            $serviciosT->save();

            $serviciosTData= ServicioTareaTemplate::
                join('tipos_tareas','tipos_tareas.id','=','servicios_tareas_templates.id_tipo_tarea')
                ->select('servicios_tareas_templates.*','tipos_tareas.id as id_tipo_tarea','tipos_tareas.nombre as tipo_tarea_nombre')
                ->where('servicios_tareas_templates.id','=',$id)
                ->get();

            \DB::commit();
            return response()->json($serviciosTData);

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

            $verificarTareas= ServicioTareaTemplate::find($id)->tareas()->where('visible','=',1)->get();

            if (!$verificarTareas->isEmpty()) {

              return response()->json("No es posible eliminar esta tarea template, existen tareas que lo usan", 409);

            }else{

              $tareaTemplate= ServicioTareaTemplate::find($id);
              $tareaTemplate->delete();
              \DB::commit();
              return response()->json('Eliminacion ok', 200);

            }

        } catch (Exception $e) {

            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);

        }
    }
}
