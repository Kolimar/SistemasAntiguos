<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

use App\Cliente;

use App\Console\Commands\CrearTareaRecordarReunionInicial;

use App\Console\Commands\BajaCliente;

use App\Console\Commands\CrearTareasDeServiciosRecurrentes;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        CrearTareaRecordarReunionInicial::class,
        BajaCliente::class,
        CrearTareasDeServiciosRecurrentes::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {

      $schedule->command('tareas:recordarReunionInicial')->everyMinute();
      $schedule->command('clientes:bajaCliente')->everyMinute();
      $schedule->command('servicios-tareas-templates:crearTareas')->everyMinute();

    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
