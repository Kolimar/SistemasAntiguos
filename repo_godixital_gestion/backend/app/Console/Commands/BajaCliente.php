<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Cliente;

class BajaCliente extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clientes:bajaCliente';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dar de baja al cliente cuando llegue la fecha de baja';

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

        $buscarCliente= Cliente::
          where('estado','=',1)
          ->whereRaw(\DB::raw('fecha_baja = curdate()'))
          ->get();

        foreach ($buscarCliente as $row) {
          $cliente= Cliente::find($row->id);
          $cliente->estado= 0;
          $cliente->save();
        }

    }
}
