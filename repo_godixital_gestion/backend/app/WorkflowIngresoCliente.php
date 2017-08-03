<?php
namespace App;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Tarea;
use App\Brief;
use App\Subtarea;
use App\Cliente;
use App\TareaTemplate;
use App\WorkflowGeneral;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Traits\GlobalTrait;

class WorkflowIngresoCliente
{

  // CREACION DE TAREAS AUTOMATICAS
  static function crearTareasAutomaticas($pmAsignado, $idCliente)
  {

    // NOMBRE DEL WORKFLOW
    $class= new WorkflowIngresoCliente();
    $getClassName= get_class($class);
    $workflowName= str_replace("App\\", "", $getClassName);

    $user= JWTAuth::parseToken()->authenticate();

    // COORDINAR REUNION INICIAL
    $dateCoordinarInicial= date_create(Carbon::now('America/Argentina/Buenos_Aires'));
    $fechaCoordinarInicial= GlobalTrait::verificarFinesDeSemanaSuma(date_format($dateCoordinarInicial, 'Y-m-d'));

    $tareaUno= \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Coordinar la reunión inicial',
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 3,
        'fecha_limite' => $fechaCoordinarInicial,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 1,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // DEPENDIENTES
    // ENVIAR EMAIL INFO PARA REUNION
    \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Enviar un e-mail al cliente info para reunión',
        'id_depende_de' => $tareaUno,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 3,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // RECORDAR REUNION INICIAL
    \DB::table('tareas')
      ->insert([
        'titulo' => 'Recordar reunión inicial',
        'id_depende_de' => $tareaUno,
        'workflow_name' => 'WorkflowIngresoCliente',
        'id_tipo_tarea' => 3,
        'id_cliente' => $idCliente,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // REUNION EFECTIVAMENTE REALIZADA
    $tareaCuatro= \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Reunión efectivamente realizada',
        'id_depende_de' => $tareaUno,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 3,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // INVESTIGAR AL CLIENTE
    \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Investigar al cliente',
        'id_depende_de' => $tareaUno,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 1,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // FIRMAR CONTRATO
    \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Firmar contrato',
        'id_depende_de' => $tareaUno,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 1,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // CREAR BRIEF DE PRIMERA REUNION
    \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Crear brief de primera reunión',
        'id_depende_de' => $tareaCuatro,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 1,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // ENVIAR PLAN DE ACCION
    \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Enviar plan de acción',
        'id_depende_de' => $tareaCuatro,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 1,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

    // CARGAR AL CLIENTE EN LA REUNION DE KICK OFF
    \DB::table('tareas')
      ->insertGetId([
        'titulo' => 'Carga al cliente en la reunión de Kick Off',
        'id_depende_de' => $tareaUno,
        'workflow_name' => $workflowName,
        'id_cliente' => $idCliente,
        'id_tipo_tarea' => 1,
        'id_asignado' => $pmAsignado,
        'urgente' => 0,
        'falta_info' => 0,
        'prioridad' => 'Alta',
        'estado' => 'Pendiente',
        'visible' => 0,
        'created_by' => $user->id,
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      ]);

  }

  static function actualizarTareaAutomatica(Request $request, $id)
  {

    // NOMBRE DEL WORKFLOW
    $class= new WorkflowIngresoCliente();
    $getClassName= get_class($class);
    $workflowName= str_replace("App\\", "", $getClassName);

    $user= JWTAuth::parseToken()->authenticate();

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

    // VERIFICAR SI DEPENDE DE OTRA TAREA
    $depende= Tarea::
      leftjoin('tareas as tarea_depende','tarea_depende.id','=','tareas.id_depende_de')
      ->select('tarea_depende.estado','tarea_depende.titulo')
      ->where('tareas.id','=',$id)
      ->get();

    if ($depende[0]->estado == "Pendiente" && $request->estado == "Completada") {

      return array('Para cambiar el estado, la tarea "' . $depende[0]->titulo . '" debe estar completada', 400);

    }else{

      if ($request->fecha_primera_reunion && $request->titulo == "Coordinar la reunión inicial" && $request->estado == "Completada") {
        $createDate= date_create($request->fecha_primera_reunion);
        $fechaPrimeraReunion= date_format($createDate, 'Y-m-d');

        // SUMA 1 DIA
        $sumToday= GlobalTrait::verificarFinesDeSemanaSuma(date('Y-m-d', strtotime(Carbon::now('America/Argentina/Buenos_Aires'). ' + 1 days')));
        $sumFechaPrimeraReunion= GlobalTrait::verificarFinesDeSemanaSuma(date('Y-m-d', strtotime($request->fecha_primera_reunion. ' + 1 days')));

        // RESTA 1 DIA
        $restaFechaPrimeraReunion= GlobalTrait::verificarFinesDeSemanaResta(date('Y-m-d', strtotime($request->fecha_primera_reunion. ' - 1 days')));

        $cliente= Cliente::FindOrFail($idCliente);
        $cliente->fecha_primera_reunion= $fechaPrimeraReunion;
        $cliente->save();

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Enviar un e-mail al cliente info para reunión')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $sumToday,
            'visible' => 1
          ]);

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Reunión efectivamente realizada')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $fechaPrimeraReunion,
            'visible' => 1
          ]);

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Investigar al cliente')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $restaFechaPrimeraReunion,
            'visible' => 1
          ]);

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Firmar contrato')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $fechaPrimeraReunion,
            'visible' => 1
          ]);

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Carga al cliente en la reunión de Kick Off')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $sumFechaPrimeraReunion,
            'visible' => 1
          ]);

      }

      if ($request->titulo == "Reunión efectivamente realizada" && $request->estado == "Completada") {

        // SUMA 1 DIA
        $sumToday= GlobalTrait::verificarFinesDeSemanaSuma(date('Y-m-d', strtotime(Carbon::now('America/Argentina/Buenos_Aires'). ' + 1 days')));
        $sumFechaPrimeraReunion= GlobalTrait::verificarFinesDeSemanaSuma(date('Y-m-d', strtotime($request->fecha_primera_reunion. ' + 1 days')));

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Crear brief de primera reunión')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $sumToday,
            'visible' => 1,
          ]);

        \DB::table('tareas')
          ->where('id_depende_de','=',$id)
          ->where('titulo','=','Enviar plan de acción')
          ->where('id_cliente','=',$idCliente)
          ->where('id_asignado','=',$idAsignado)
          ->where('workflow_name','=',$workflowName)
          ->update([
            'fecha_limite' => $sumFechaPrimeraReunion,
            'visible' => 1,
          ]);

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
          $tareas->id_tipo_tarea= $tipoTarea;
          $tareas->id_servicio= $idServicio;
          $tareas->id_asignado= $idAsignado;
          $tareas->estado= $request->estado;
          $tareas->save();

      }

      $workflow= WorkflowGeneral::retornarData($id);
      return $workflow;

    }

  }

}
