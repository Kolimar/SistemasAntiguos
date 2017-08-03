<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Depositos;
use App\ContenedorSize;
use App\ContenedorTipo;
use App\Terminales;
use App\Operadores;
use App\Contenedor;
use App\Transportista;
use App\Bookings;
use App\Clientes;
use App\Movimiento;
use App\buqueSalida;
use App\logBookings;
use App\logContenedores;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        
        User::truncate();
        Depositos::truncate();
        ContenedorSize::truncate();
        ContenedorTipo::truncate();
        Terminales::truncate();
        Operadores::truncate();
        Contenedor::truncate();
        Transportista::truncate();
        Bookings::truncate();
        Clientes::truncate();
        Movimiento::truncate();
        buqueSalida::truncate();

        $cantidadUsuarios = 1;
        $Depositos = 10;
        $ContenedorSize = 50;
        $ContenedorTipo = 150;
        $Terminales = 10;
        $Operadores = 1;
        $Contenedor = 10;
        $Transportista = 100;
        $Bookings = 100;
        $Clientes = 100;
        $Movimiento = 3;
        $buqueSalida= 10;



        factory(User::class, $cantidadUsuarios)->create();
        factory(Depositos::class, $Depositos)->create();
        factory(ContenedorSize::class, $ContenedorSize)->create();
        factory(ContenedorTipo::class, $ContenedorTipo)->create();
        factory(Terminales::class, $Terminales)->create();
        factory(Operadores::class, $Operadores)->create();
        factory(Contenedor::class, $Contenedor)->create();
        factory(Transportista::class, $Transportista)->create();
        factory(Bookings::class, $Bookings)->create();
        factory(Clientes::class, $Clientes)->create();
        factory(buqueSalida::class, $buqueSalida)->create();
        factory(logBookings::class, $Bookings)->create();
        factory(logContenedores::class, $Clientes)->create();
        factory(Movimiento::class, $Movimiento)->create();

        
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}
