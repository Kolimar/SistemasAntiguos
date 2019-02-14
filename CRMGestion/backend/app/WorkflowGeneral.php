<?php

namespace App;

use Illuminate\Http\Request;

use Carbon\Carbon;

use App\Tarea;

use App\Subtarea;

use App\Cliente;

use App\TareaTemplate;

use App\WorkflowGeneral;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class WorkflowGeneral
{

    // CREACION DE TAREAS GENERALES
    static function crearTareaGeneral(Request $request)
    {

      $user= JWTAuth::parseToken()->authenticate();

      // ID TAREAS TEMPLATES
      if (empty($request->id_tarea_template)) {

          $idTareaTemplate= NULL;
          $valCritica= NULL;
          $valUltimo= NULL;

      }else{

          $idTareaTemplate= $request->id_tarea_template;

          $selectTareaTemplate= TareaTemplate::
              select('es_critica','ultimo_milestone')
              ->where('id','=',$idTareaTemplate)
              ->get();

          $valCritica= $selectTareaTemplate[0]->es_critica;
          $valUltimo= $selectTareaTemplate[0]->ultimo_milestone;

      }

      // ID SERVICIOS TAREAS TEMPLATES
      $idServicioTareaTemplate= NULL;

      // DEPENDE DE
      $idDependeDe= NULL;

      // NOMBRE DEL WORKFLOW
      $class= new WorkflowGeneral();
      $getClassName= get_class($class);
      $workflowName= str_replace("App\\", "", $getClassName);

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

      // ID CLIENTE
       if(empty($request->id_cliente)){

          $idCliente= NULL;

      }else{

          $idCliente= $request->id_cliente;
          $count= Cliente::
              where('id','=',$idCliente)
              ->where('contrato_firmado','=',0)
              ->count('id');

          if ($count > 0) {

              return array("El cliente seleccionado no posee contrato firmado", 400);

          }else{

              $idCliente= $request->id_cliente;

          }

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

      // TIPO TAREA
      if(empty($request->id_tipo_tarea)){

          $tipo_tarea= NULL;

      }else{

          $tipo_tarea= $request->id_tipo_tarea;

      }

      if ($request->borrador) {

          $tareas= \DB::table('tareas')
              ->insertGetId(
                  ['id_tarea_template' => $idTareaTemplate,
                  'id_servicio_tarea_template' => $idServicioTareaTemplate,
                  'id_tipo_tarea' => $tipo_tarea,
                  'id_depende_de' => $idDependeDe,
                  'workflow_name' => $workflowName,
                  'titulo' => $titulo,
                  'descripcion' => $descripcion,
                  'fecha_limite' => $fechaLimite,
                  'fecha_ejecucion' => $fechaEjecucion,
                  'urgente' => $urgente,
                  'falta_info' => $faltaInfo,
                  'prioridad' => $prioridad,
                  'id_cliente' => $idCliente,
                  'id_servicio' => $idServicio,
                  'id_asignado' => $idAsignado,
                  'estado' => "Borrador",
                  'cantidad_subtareas' => NULL,
                  'cantidad_subtareas_completadas' => NULL,
                  'es_critica' => $valCritica,
                  'ultimo_milestone' => $valUltimo,
                  'visible' => 1,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
          ]);

          return array("Registro ok", 201);

      }elseif ($request->create) {

          $tareas= \DB::table('tareas')
              ->insertGetId(
                  ['id_tarea_template' => $idTareaTemplate,
                  'id_servicio_tarea_template' => $idServicioTareaTemplate,
                  'id_tipo_tarea' => $tipo_tarea,
                  'id_depende_de' => $idDependeDe,
                  'workflow_name' => $workflowName,
                  'titulo' => $titulo,
                  'descripcion' => $descripcion,
                  'fecha_limite' => $fechaLimite,
                  'fecha_ejecucion' => $fechaEjecucion,
                  'urgente' => $urgente,
                  'falta_info' => $faltaInfo,
                  'prioridad' => $prioridad,
                  'id_cliente' => $idCliente,
                  'id_servicio' => $idServicio,
                  'id_asignado' => $idAsignado,
                  'estado' => "Pendiente",
                  'cantidad_subtareas' => NULL,
                  'cantidad_subtareas_completadas' => NULL,
                  'es_critica' => $valCritica,
                  'ultimo_milestone' => $valUltimo,
                  'visible' => 1,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
          ]);

          return array("Registro ok", 201);

      }

    }

    // ACTUALIZACION DE TAREAS GENERALES
    static function actualizarTareaGeneral(Request $request, $id)
    {

      $tareas= Tarea::FindOrFail($id);

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

      // ID CLIENTE
       if(empty($request->id_cliente)){

          $idCliente= NULL;

      }else{

          $idCliente= $request->id_cliente;
          $count= Cliente::
              where('id','=',$idCliente)
              ->where('contrato_firmado','=',0)
              ->count('id');

          if ($count > 0) {

              return array("El cliente seleccionado no posee contrato firmado", 400);

          }else{

              $idCliente= $request->id_cliente;

          }

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

      // TIPO TAREA
      if(empty($request->id_tipo_tarea)){

          $tipo_tarea= NULL;

      }else{

          $tipo_tarea= $request->id_tipo_tarea;

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
          $tareas->id_tipo_tarea= $tipo_tarea;
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
          $tareas->id_tipo_tarea= $tipo_tarea;
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
          $tareas->id_tipo_tarea= $tipo_tarea;
          $tareas->id_servicio= $idServicio;
          $tareas->id_asignado= $idAsignado;
          $tareas->estado= $request->estado;
          $tareas->save();

      }

        $workflow= WorkflowGeneral::retornarData($id);
        return $workflow;

    }

    // RETORNAR DATA CARGADA
    static function retornarData($id)
    {

      $tareasData= Tarea::
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
          ->where('tareas.id','=',$id)
          ->where('tareas.visible','=',1)
          ->get();

      return $tareasData;

    }


}
