<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Cliente;

class CrearTareaRecordarReunionInicial extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tareas:recordarReunionInicial';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Se creara tarea Recordar reunión inicial dos dias habiles antes de la fecha actual de la reunion inicial';

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

        $buscarFecha = Cliente::
          join('tareas','tareas.id_cliente','=','clientes.id')
          ->selectRaw(\DB::raw('
            tareas.id as id_tarea,
            tareas.id_asignado,
            clientes.id as id_cliente,
            clientes.fecha_primera_reunion,
            DATE_SUB(clientes.fecha_primera_reunion, INTERVAL 2 DAY) as fecha_aviso
          '))
          ->where('clientes.estado','=',1)
          ->where('tareas.workflow_name','=','WorkflowIngresoCliente')
          ->where('tareas.titulo','=','Coordinar la reunión inicial')
          ->where('tareas.estado','=','Completada')
          ->get();

        foreach ($buscarFecha as $row) {
          $date= Carbon::parse($row->fecha_aviso);

          if ($date->isWeekend()) {

            while ($date->isWeekend()) {
              $date->day--;
              $fechaAviso= $date->format('Y-m-d');
            }

          }else{

              $fechaAviso= $row->fecha_aviso;

          }

          $currentDate= Carbon::now()->format('Y-m-d');

          if ($fechaAviso == $currentDate) {

            \DB::table('tareas')
              ->where('tareas.id_depende_de','=',$row->id_tarea)
              ->where('tareas.workflow_name','=','WorkflowIngresoCliente')
              ->where('tareas.titulo','=','Recordar reunión inicial')
              ->update([
                'visible' => 1,
              ]);

          }

        }

    }
}
