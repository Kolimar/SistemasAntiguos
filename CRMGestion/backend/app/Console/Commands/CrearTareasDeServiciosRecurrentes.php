<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Cliente;

use Carbon\Carbon;

use App\WorkflowServicio;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class CrearTareasDeServiciosRecurrentes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'servicios-tareas-templates:crearTareas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creacion de tareas de servicios recurrentes a inicio de mes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

      // NOMBRE DEL WORKFLOW
      $class= new WorkflowServicio();
      $getClassName= get_class($class);
      $workflowName= str_replace("App\\", "", $getClassName);

      $buscarTareas= \DB::table('servicios_tareas_templates')
        ->join('servicios','servicios.id','servicios_tareas_templates.id_servicio')
        ->join('clientes_servicios_contratados','clientes_servicios_contratados.id_servicio','servicios.id')
        ->join('clientes','clientes.id','clientes_servicios_contratados.id_cliente')
        ->selectRaw(\DB::raw('
          servicios_tareas_templates.id as id_servicio_tarea_template,
          servicios_tareas_templates.titulo as titulo,
          servicios_tareas_templates.descripcion as descripcion,
          servicios_tareas_templates.id_servicio as id_servicio,
          servicios_tareas_templates.asigna_pm_automatico as asigna_pm_automatico,
          servicios_tareas_templates.es_critica as es_critica,
          servicios_tareas_templates.ultimo_milestone as ultimo_milestone,
          clientes_servicios_contratados.id_cliente as id_cliente,
          clientes_servicios_contratados.fecha_comienzo as fecha_comienzo_gestion,
          DATE_FORMAT(DATE_ADD(clientes_servicios_contratados.fecha_comienzo, INTERVAL servicios_tareas_templates.dias_sugeridos DAY), "%Y-%m-%d") as fecha_limite,
          clientes.pm_asignado')
        )
        ->where('servicios.es_recurrente','=',1)
        ->where('clientes.estado','=',1)
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
          'id_tipo_tarea' => 1,
          'id_servicio' => $tarea->id_servicio,
          'id_asignado' => $pm_automatico,
          'estado' => 'Pendiente',
          'es_critica' => $tarea->es_critica,
          'ultimo_milestone' => $tarea->ultimo_milestone,
          'urgente' => 0,
          'falta_info' => 0,
          'visible' => 1,
          'created_by' => $pm_automatico,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

      }

    }

}
