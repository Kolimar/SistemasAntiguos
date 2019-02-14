<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Carbon\Carbon;

use App\Tarea;

use App\Subtarea;

use App\TipoTarea;

use App\Cliente;

use App\TareaTemplate;

use App\WorkflowGeneral;

use App\WorkflowIngresoCliente;

use App\WorkflowServicio;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class TareaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $user= JWTAuth::parseToken()->authenticate();

        // QUERY PARA TITULO

        if ($request->titulo && $request->titulo != " ") {

            $query1= "tareas.titulo LIKE '%$request->titulo%'";

        }else{

            $query1= "tareas.titulo LIKE '%%'";

        }

        // QUERY PARA ES CRITICA

        $query2= " ";
        if ($request->es_critica == "0") {

            $es_critica= 0;
            $query2= "AND tareas.es_critica = $es_critica";

        }elseif ($request->es_critica == "1") {

            $es_critica= 1;
            $query2= "AND tareas.es_critica = $es_critica";

        }

        // QUERY PARA ULTIMO MILESTONE

        $query3= " ";

        if ($request->ultimo_milestone == "0") {

            $ultimo_milestone= 0;
            $query3= "AND tareas.ultimo_milestone = $ultimo_milestone";

        }elseif ($request->ultimo_milestone == "1") {

            $ultimo_milestone= 1;
            $query3= "AND tareas.ultimo_milestone = $ultimo_milestone";

        }

        // QUERY PARA DESCRIPCION

        if ($request->descripcion && $request->descripcion != " ") {

            $query4= "AND tareas.descripcion LIKE '%$request->descripcion%'";

        }else{

            $query4= " ";

        }

        // QUERY PARA FECHA LIMITE

        if ($request->fecha_limite && $request->fecha_limite != " ") {

            $query5= "AND tareas.fecha_limite LIKE '%$request->fecha_limite%'";

        }else{

            $query5= " ";

        }

        // QUERY PARA FECHA EJECUCION

        if ($request->fecha_ejecucion && $request->fecha_ejecucion != " ") {

            $query6= "AND tareas.fecha_ejecucion LIKE '%$request->fecha_ejecucion%'";

        }else{

            $query6= " ";

        }

        // QUERY PARA URGENTE

        $query7= " ";
        if ($request->urgente == "0") {

            $urgente= 0;
            $query7= "AND tareas.urgente = $urgente";

        }elseif ($request->urgente == "1") {

            $urgente= 1;
            $query7= "AND tareas.urgente = $urgente";

        }

        // QUERY PARA FALTA INFO

        $query8= " ";
        if ($request->falta_info == "0") {

            $falta_info= 0;
            $query8= "AND tareas.falta_info = $falta_info";

        }elseif ($request->falta_info == "1") {

            $falta_info= 1;
            $query8= "AND tareas.falta_info = $falta_info";

        }

        // QUERY PARA CLIENTE

        if ($request->cliente && $request->cliente != " ") {

            $query9= "AND clientes.id = $request->cliente";

        }else{

            $query9= " ";

        }

        // QUERY PARA USUARIO

        if((int)$request->asignado == -1){

            $query10= " ";

        }else if ($request->asignado && $request->asignado != " ") {

            $query10= "AND users.id = $request->asignado";

        }else{

            $query10= "AND users.id = $user->id";

        }

        // QUERY PARA ESTADO

        if((int)$request->estado == -1){

            $query11= " ";

        }else if ($request->estado && $request->estado != " ") {

            $query11= "AND tareas.estado LIKE '%$request->estado%'";

        }else{

            $query11= "AND tareas.estado = 'Pendiente'";

        }

        // QUERY PARA SERVICIO

        if ($request->nombre_servicio && $request->nombre_servicio != " ") {

            $query12= "AND servicios.nombre LIKE '%$request->nombre_servicio%'";

        }else{

            $query12= " ";

        }

        // QUERY PARA PRIORIDAD

        if ($request->prioridad && $request->prioridad != " ") {

            $query13= "AND tareas.prioridad LIKE '%$request->prioridad%'";

        }else{

            $query13= " ";

        }

        // QUERY PARA TIPO TAREA

        if ($request->tipo_tarea && $request->tipo_tarea != " ") {

            $query14= "AND tipos_tareas.id = $request->tipo_tarea";

        }else{

            $query14= " ";

        }

        // ORDENAMIENTOS

        if ($request->titulo_ord && $request->titulo_ord != " ") {

            $columna= 'tareas.titulo';
            $ord= $request->titulo_ord;

        }elseif($request->fecha_ejecucion_ord && $request->fecha_ejecucion_ord != " "){

            $columna= 'tareas.fecha_ejecucion';
            $ord= $request->fecha_ejecucion_ord;

        }elseif($request->fecha_limite_ord && $request->fecha_limite_ord != " "){

            $columna= 'tareas.fecha_limite';
            $ord= $request->fecha_limite_ord;

        }elseif($request->prioridad_ord && $request->prioridad_ord != " "){

            $columna= 'tareas.prioridad';
            $ord= $request->prioridad_ord;

        }else{

            $columna= 'tareas.fecha_limite';
            $ord= 'DESC';

        }

        // LIMITE

        $offset= ((int)$request->pagina) * 10;

        $tareas= Tarea::
            leftjoin('tipos_tareas','tipos_tareas.id','=','tareas.id_tipo_tarea')
            ->leftjoin('tareas as tarea_depende','tarea_depende.id','=','tareas.id_depende_de')
            ->leftjoin('tareas_templates','tareas_templates.id','=','tareas.id_tarea_template')
            ->leftjoin('clientes','clientes.id','=','tareas.id_cliente')
            ->leftjoin('servicios','servicios.id','=','tareas.id_servicio')
            ->leftjoin('users','users.id','=','tareas.id_asignado')
            ->select(\DB::raw('tareas.id,
                tareas.titulo,
                tarea_depende.titulo as titulo_depende,
                tareas.descripcion,
                DATE_FORMAT(tareas.fecha_limite, "%d-%m-%Y") as fecha_limite,
                DATE_FORMAT(tareas.fecha_ejecucion, "%d-%m-%Y") as fecha_ejecucion,
                tareas.fecha_limite as fecha_limite_edit,
                tareas.fecha_ejecucion as fecha_ejecucion_edit,
                tareas.urgente,
                tareas.falta_info,
                tareas.prioridad,
                tareas.estado,
                tareas.workflow_name,
                tareas.id_depende_de,
                tareas_templates.id as id_tarea_template,
                tareas_templates.titulo as titulo_tarea_template,
                tareas_templates.es_critica as es_critica,
                tareas_templates.ultimo_milestone as ultimo_milestone,
                tipos_tareas.id as id_tipo_tarea,
                tipos_tareas.nombre as nombre_tipo_tarea,
                clientes.id as id_cliente,
                clientes.nombre as nombre_cliente,
                clientes.fecha_primera_reunion,
                servicios.id as id_servicio,
                servicios.nombre as nombre_servicio,
                users.id as id_asignado,
                users.nombres as nombres_asignado,
                users.apellidos as apellidos_asignado'))
            ->whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . " " . $query5 . " " . $query6 . " " . $query7 . " " . $query8 . " " . $query9 . " " . $query10 . " " . $query11 . " " . $query12 . " " . $query13 . " " . $query14 . " AND tareas.visible = 1"))
            ->orderBy($columna, $ord)
            ->offset($offset)
            ->limit(10)
            ->get();

            if ($tareas) {

                return response()->json($tareas);

            }else{

                return responses()->json('Algo salió mal, intente más tarde', 500);

            }

    }

    public function getCantidadSubtareas($id){

        $cant= Tarea::
            select('cantidad_subtareas','cantidad_subtareas_completadas')
            ->where('id','=',$id)
            ->get();

        return response()->json($cant);

    }

    public function getListadoTiposTareas(){

      $tiposTareas= TipoTarea::
        select('*')
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

            $workFlow= WorkflowGeneral::crearTareaGeneral($request);

            \DB::commit();
            return response()->json($workFlow[0], $workFlow[1]);

        } catch (Exception $e) {

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

          if ($request->workflow_name == "WorkflowGeneral") {

            $workflow= WorkflowGeneral::actualizarTareaGeneral($request, $id);
            if (is_array($workflow)) {

                \DB::commit();
                return response()->json($workflow[0], $workflow[1]);

            }else{

                \DB::commit();
                return response()->json($workflow);

            }

          } else if ($request->workflow_name == "WorkflowIngresoCliente"){

            $workflow= WorkflowIngresoCliente::actualizarTareaAutomatica($request, $id);
            if (is_array($workflow)) {

                \DB::commit();
                return response()->json($workflow[0], $workflow[1]);

            }else{

                \DB::commit();
                return response()->json($workflow);

            }

          } else if ($request->workflow_name == "WorkflowServicio"){

            $workflow= WorkflowServicio::actualizarTareaServicio($request, $id);
            if (is_array($workflow)) {

                \DB::commit();
                return response()->json($workflow[0], $workflow[1]);

            }else{

                \DB::commit();
                return response()->json($workflow);

            }

          }

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

            $tareas = Tarea::find($id);
            $tareas->delete();

            \DB::commit();
            return response()->json('Eliminacion ok', 200);

        } catch (Exception $e) {

            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);

        }

    }
}
