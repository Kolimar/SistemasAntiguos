<?php
namespace App;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Tarea;
use App\Brief;
use App\Subtarea;
use App\Cliente;
use App\Servicio;
use App\TareaTemplate;
use App\WorkflowGeneral;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class WorkflowServicio
{
    static function crearTareasServicios($idCliente)
    {

      // NOMBRE DEL WORKFLOW
      $class= new WorkflowServicio();
      $getClassName= get_class($class);
      $workflowName= str_replace("App\\", "", $getClassName);

      $user= JWTAuth::parseToken()->authenticate();

      $buscarTareas= \DB::table('servicios_tareas_templates')
        ->join('servicios','servicios.id','servicios_tareas_templates.id_servicio')
        ->join('clientes_servicios_contratados','clientes_servicios_contratados.id_servicio','servicios.id')
        ->join('clientes','clientes.id','clientes_servicios_contratados.id_cliente')
        ->selectRaw(\DB::raw('
          servicios_tareas_templates.id as id_servicio_tarea_template,
          servicios_tareas_templates.titulo as titulo,
          servicios_tareas_templates.descripcion as descripcion,
          servicios_tareas_templates.id_servicio as id_servicio,
          servicios_tareas_templates.id_tipo_tarea as id_tipo_tarea,
          servicios_tareas_templates.asigna_pm_automatico as asigna_pm_automatico,
          servicios_tareas_templates.es_critica as es_critica,
          servicios_tareas_templates.ultimo_milestone as ultimo_milestone,
          clientes_servicios_contratados.id_cliente as id_cliente,
          clientes_servicios_contratados.fecha_comienzo as fecha_comienzo_gestion,
          DATE_FORMAT(DATE_ADD(clientes_servicios_contratados.fecha_comienzo, INTERVAL servicios_tareas_templates.dias_sugeridos DAY), "%Y-%m-%d") as fecha_limite,
          clientes.pm_asignado')
        )
        ->where('clientes.id','=',$idCliente)
        ->get();

      foreach ($buscarTareas as $tarea) {

        if ($tarea->asigna_pm_automatico == 1) {
          $pm_automatico= $tarea->pm_asignado;
        }else{
          $pm_automatico= NULL;
        }
        $inserTareas= \DB::table('tareas')
        ->insert([
          'id_servicio_tarea_template' => $tarea->id_servicio_tarea_template,
          'titulo' => $tarea->titulo,
          'workflow_name' => $workflowName,
          'descripcion' => $tarea->descripcion,
          'fecha_limite' => $tarea->fecha_limite,
          'id_cliente' => $tarea->id_cliente,
          'id_tipo_tarea' => $tarea->id_tipo_tarea,
          'id_servicio' => $tarea->id_servicio,
          'id_asignado' => $pm_automatico,
          'estado' => 'Pendiente',
          'es_critica' => $tarea->es_critica,
          'ultimo_milestone' => $tarea->ultimo_milestone,
          'urgente' => 0,
          'falta_info' => 0,
          'prioridad' => 'Alta',
          'visible' => 1,
          'created_by' => $user->id,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

      }

    }

    static function actualizarTareaServicio(Request $request, $id)
    {

      // TITULO
      if(empty($request->titulo)){

          $titulo= NULL;

      }else{

          $titulo= $request->titulo;

      }

      // DESCRIPCION
      if(empty($request->descripcion)){

          $descripcion= NULL;

      }else{

          $descripcion= $request->descripcion;

      }

      // FECHA LIMITE
      if(empty($request->fecha_limite)){

          $fechaLimite= NULL;

      }else{

          $date1= date_create($request->fecha_limite);
          $fechaLimite= date_format($date1, 'Y-m-d');

      }

      // FECHA EJECUCION
      if(empty($request->fecha_ejecucion)){

          $fechaEjecucion= NULL;

      }else{

          $date2= date_create($request->fecha_ejecucion);
          $fechaEjecucion= date_format($date2, 'Y-m-d');

          if ($fechaEjecucion > $fechaLimite) {

              return array("La fecha de ejecución debe ser menor que la fecha límite", 409);

          }

      }

      // URGENTE
      if((int)$request->urgente == 0){

          $urgente= 0;

      }elseif((int)$request->urgente == 1){

          $urgente= 1;

      }elseif(is_null($request->urgente)) {

          $urgente= 0;

      }

      // FALTA INFO
      if((int)$request->falta_info == 0){

          $faltaInfo= 0;

      }elseif((int)$request->falta_info == 1){

          $faltaInfo= 1;

      }elseif(is_null($request->falta_info)) {

          $faltaInfo= 0;

      }

      // PRIORIDAD
      if(empty($request->prioridad)){

          $prioridad= NULL;

      }else{

          $prioridad= $request->prioridad;

      }

      // TIPO TAREA
      if(empty($request->id_tipo_tarea)){

          $tipoTarea= NULL;

      }else{

          $tipoTarea= $request->id_tipo_tarea;

      }

      // ID CLIENTE
       if(empty($request->id_cliente)){

          $idCliente= NULL;

      }else{

          $idCliente= $request->id_cliente;

      }

      // ID CLIENTE SERVICIO
      if(empty($request->id_servicio)){

          $idServicio= NULL;

      }else{

          $idServicio= $request->id_servicio;

      }

      // ID ASIGNADO
      if(empty($request->id_asignado)){

          $idAsignado= NULL;

      }else{

          $idAsignado= $request->id_asignado;

      }

      if ($request->borrador) {

          $tareas= Tarea::FindOrFail($id);
          $tareas->titulo= $titulo;
          $tareas->descripcion= $descripcion;
          $tareas->fecha_limite= $fechaLimite;
          $tareas->fecha_ejecucion= $fechaEjecucion;
          $tareas->urgente= $urgente;
          $tareas->falta_info= $faltaInfo;
          $tareas->prioridad= $prioridad;
          $tareas->id_cliente= $idCliente;
          $tareas->id_tipo_tarea= $tipoTarea;
          $tareas->id_servicio= $idServicio;
          $tareas->id_asignado= $idAsignado;
          $tareas->estado= "Borrador";
          $tareas->save();

      }elseif ($request->create) {

          $tareas= Tarea::FindOrFail($id);
          $tareas->titulo= $titulo;
          $tareas->descripcion= $descripcion;
          $tareas->fecha_limite= $fechaLimite;
          $tareas->fecha_ejecucion= $fechaEjecucion;
          $tareas->urgente= $urgente;
          $tareas->falta_info= $faltaInfo;
          $tareas->prioridad= $prioridad;
          $tareas->id_cliente= $idCliente;
          $tareas->id_tipo_tarea= $tipoTarea;
          $tareas->id_servicio= $idServicio;
          $tareas->id_asignado= $idAsignado;
          $tareas->estado= "Pendiente";
          $tareas->save();

      }elseif($request->edit){

          $tareas= Tarea::FindOrFail($id);
          $tareas->titulo= $titulo;
          $tareas->descripcion= $descripcion;
          $tareas->fecha_limite= $fechaLimite;
          $tareas->fecha_ejecucion= $fechaEjecucion;
          $tareas->urgente= $urgente;
          $tareas->falta_info= $faltaInfo;
          $tareas->prioridad= $prioridad;
          $tareas->id_cliente= $idCliente;
          $tareas->id_servicio= $idServicio;
          $tareas->id_tipo_tarea= $tipoTarea;
          $tareas->id_asignado= $idAsignado;
          $tareas->estado= $request->estado;
          $tareas->save();

      }

      $workflow= WorkflowGeneral::retornarData($id);
      return $workflow;

    }

    static function nuevaTareaServicio($id_servicio, $id_cliente, $id_servicio_cliente_contratado)
    {

      // NOMBRE DEL WORKFLOW
      $class= new WorkflowServicio();
      $getClassName= get_class($class);
      $workflowName= str_replace("App\\", "", $getClassName);

      $user= JWTAuth::parseToken()->authenticate();

      $buscarTareas= \DB::table('servicios_tareas_templates')
        ->join('servicios','servicios.id','servicios_tareas_templates.id_servicio')
        ->join('clientes_servicios_contratados','clientes_servicios_contratados.id_servicio','servicios.id')
        ->join('clientes','clientes.id','clientes_servicios_contratados.id_cliente')
        ->selectRaw(\DB::raw('
          servicios_tareas_templates.id as id_servicio_tarea_template,
          servicios_tareas_templates.titulo as titulo,
          servicios_tareas_templates.descripcion as descripcion,
          servicios_tareas_templates.id_servicio as id_servicio,
          servicios_tareas_templates.id_tipo_tarea as id_tipo_tarea,
          servicios_tareas_templates.asigna_pm_automatico as asigna_pm_automatico,
          servicios_tareas_templates.es_critica as es_critica,
          servicios_tareas_templates.ultimo_milestone as ultimo_milestone,
          clientes_servicios_contratados.id_cliente as id_cliente,
          clientes_servicios_contratados.fecha_comienzo as fecha_comienzo_gestion,
          DATE_FORMAT(DATE_ADD(clientes_servicios_contratados.fecha_comienzo, INTERVAL servicios_tareas_templates.dias_sugeridos DAY), "%Y-%m-%d") as fecha_limite,
          clientes.pm_asignado')
        )
        ->where('servicios.id','=',$id_servicio)
        ->where('clientes.id','=',$id_cliente)
        ->where('clientes_servicios_contratados.eliminado','=',0)
        ->where('clientes_servicios_contratados.id','=',$id_servicio_cliente_contratado)
        ->get();

        foreach ($buscarTareas as $tarea) {

          if ($tarea->asigna_pm_automatico == 1) {
            $pm_automatico= $tarea->pm_asignado;
          }else{
            $pm_automatico= NULL;
          }

          $inserTareas= \DB::table('tareas')
          ->insert([
            'id_servicio_tarea_template' => $tarea->id_servicio_tarea_template,
            'titulo' => $tarea->titulo,
            'workflow_name' => $workflowName,
            'descripcion' => $tarea->descripcion,
            'fecha_limite' => $tarea->fecha_limite,
            'id_cliente' => $tarea->id_cliente,
            'id_tipo_tarea' => $tarea->id_tipo_tarea,
            'id_servicio' => $tarea->id_servicio,
            'id_asignado' => $pm_automatico,
            'estado' => 'Pendiente',
            'es_critica' => $tarea->es_critica,
            'ultimo_milestone' => $tarea->ultimo_milestone,
            'urgente' => 0,
            'falta_info' => 0,
            'prioridad' => 'Alta',
            'visible' => 1,
            'created_by' => $user->id,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          ]);

        }

    }

}
