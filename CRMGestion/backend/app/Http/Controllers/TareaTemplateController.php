<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TareaTemplate;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class TareaTemplateController extends Controller
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

            $query1= "tareas_templates.titulo LIKE '%$request->titulo%'";

        }else{

            $query1= "tareas_templates.titulo LIKE '%$request->titulo%'";

        }

        // QUERY PARA DESCRIPCION

        if ($request->descripcion && $request->descripcion != " ") {

            $query2= "AND tareas_templates.descripcion LIKE '%$request->descripcion%'";

        }else{

            $query2= " ";

        }

        // QUERY PARA ES CRITICA

        if ($request->es_critica == "0") {

            $es_critica= 0;
            $query3= "AND tareas_templates.es_critica = $es_critica";

        }elseif ($request->es_critica == "1") {

            $es_critica= 1;
            $query3= "AND tareas_templates.es_critica = $es_critica";

        }else{

            $query3= " ";
        }

        // QUERY PARA ULTIMO MILESTONE

        if ($request->ultimo_milestone == "0") {

            $ultimo_milestone= 0;
            $query4= "AND tareas_templates.ultimo_milestone = $ultimo_milestone";

        }elseif ($request->ultimo_milestone == "1") {

            $ultimo_milestone= 1;
            $query4= "AND tareas_templates.ultimo_milestone = $ultimo_milestone";

        }else{

            $query4= " ";
        }

        // QUERY PARA DIAS SUGERIDOS

        if ($request->dias_sugeridos && $request->dias_sugeridos != " ") {

            $query5= "AND tareas_templates.dias_sugeridos LIKE '%$request->dias_sugeridos%'";

        }else{

            $query5= " ";
        }

        // QUERY PARA PM AUTOMATICO

        if ($request->asigna_pm_automatico == "0") {

            $asigna_pm_automatico= 0;
            $query6= "AND tareas_templates.asigna_pm_automatico = $asigna_pm_automatico";

        }elseif ($request->asigna_pm_automatico == "1") {

            $asigna_pm_automatico= 1;
            $query6= "AND tareas_templates.asigna_pm_automatico = $asigna_pm_automatico";

        }else{

            $query6= " ";
        }

        // QUERY PARA TIPO TAREA

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

        $tareasTemplates= TareaTemplate::
            join('tipos_tareas','tipos_tareas.id','=','tareas_templates.id_tipo_tarea')
            ->select('tareas_templates.*','tipos_tareas.id as id_tipo_tarea','tipos_tareas.nombre as tipo_tarea_nombre')
            ->whereRaw(\DB::raw($query1. " " .$query2. " " .$query3. " " .$query4. " " .$query5. " " .$query6. " ". $query7))
            ->orderBy($columna,$ord)
            ->offset($offset)
            ->limit(10)
            ->get();

        return response()->json($tareasTemplates);

    }

    public function getListado()
    {

        $listadoTareasTemplates= TareaTemplate::all();
        return response()->json($listadoTareasTemplates);

    }

    public function getTareaTemplateDetalle($id){

        $detalleTT= TareaTemplate::
            join('tipos_tareas','tipos_tareas.id','=','tareas_templates.id_tipo_tarea')
            ->selectRaw(\DB::raw('
                tareas_templates.id,
                tareas_templates.titulo as titulo,
                tareas_templates.titulo as titulo_tt,
                tareas_templates.descripcion as descripcion_tt,
                tareas_templates.dias_sugeridos,
                tareas_templates.asigna_pm_automatico,
                DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL tareas_templates.dias_sugeridos DAY), "%d-%m-%Y") as fecha_limite_tt,
                DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL tareas_templates.dias_sugeridos DAY), "%Y-%m-%d") as fecha_limite_tt_f,
                tipos_tareas.id  as id_tipo_tarea,
                tipos_tareas.nombre as nombre_tipo_tarea'))
            ->orderBy('tareas_templates.titulo','ASC')
            ->where('tareas_templates.id','=',$id)
            ->get();

        return response()->json($detalleTT);

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
            $user = JWTAuth::parseToken()->authenticate();

            $tareasTemplates= new TareaTemplate($request->all());
            $tareasTemplates->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $tareasTemplates->created_by= $user->id;
            $tareasTemplates->save();

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

        $tareasTemplates= TareaTemplate::find($id);
        return response()->json($tareasTemplates);

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

            $tareasTemplates= TareaTemplate::FindOrFail($id);
            $tareasTemplates->titulo= $request->titulo;
            $tareasTemplates->descripcion= $request->descripcion;
            $tareasTemplates->id_tipo_tarea= $request->id_tipo_tarea;
            $tareasTemplates->es_critica= $request->es_critica;
            $tareasTemplates->ultimo_milestone= $request->ultimo_milestone;
            $tareasTemplates->dias_sugeridos= $request->dias_sugeridos;
            $tareasTemplates->asigna_pm_automatico= $request->asigna_pm_automatico;
            $tareasTemplates->save();

            $tareasTemplatesData= TareaTemplate::
                join('tipos_tareas','tipos_tareas.id','=','tareas_templates.id_tipo_tarea')
                ->select('tareas_templates.*','tipos_tareas.id as id_tipo_tarea','tipos_tareas.nombre as tipo_tarea_nombre')
                ->where('tareas_templates.id','=',$id)
                ->get();

            \DB::commit();
            return response()->json($tareasTemplatesData);

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

          $verificarTipoTarea= TareaTemplate::find($id)->tareas()->where('visible','=',1)->get();

          if (!$verificarTipoTarea->isEmpty()) {

              return response()->json("No es posible eliminar esta tarea template, existen tareas que lo usan", 409);

          }else{

              $tareaTamplate= TareaTemplate::find($id);
              $tareaTamplate->delete();
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
