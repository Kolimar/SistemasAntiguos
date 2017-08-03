<?php

use App\User;
use App\dispositivo;
use App\medicion;
use App\variable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
        // $this->call(UsersTableSeeder::class);
        medicion::truncate();
        variable::truncate();
        dispositivo::truncate();
        User::truncate();
        medicion::flushEventListeners();
        variable::flushEventListeners();
        dispositivo::flushEventListeners();
        

        $cantidadUsuarios = 1;
        $cantidadDispositivos = 1;
        $cantidadVariables = 1;
        $cantidadMediciones = 50;

        factory(User::class, $cantidadUsuarios)->create();
        factory(dispositivo::class, $cantidadDispositivos)->create();
        factory(variable::class, $cantidadVariables)->create();
        factory(medicion::class, $cantidadMediciones)->create();
       /* factory(variable::class, $cantidadVariables)->create()->each(
            function($variable){
                $medicions = medicion::inRandomOrder()->first(mt_rand(20,100))->id;

                $variable->medicions()->attach($medicions);
            }
        );
        factory(dispositivo::class, $cantidadDispositivos)->create()->each(
            function($dispositivo){

                $variables = variable::inRandomOrder()->first(5)->id;

                $dispositivo->variables()->attach($variables);
            }
        );*/




    }
}
