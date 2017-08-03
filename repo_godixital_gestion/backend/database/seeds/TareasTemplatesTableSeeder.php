<?php

use Illuminate\Database\Seeder;

use Faker\Factory as Faker;

use Carbon\Carbon;

class TareasTemplatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $faker = Faker::create();

        for ($i=0; $i <= 50; $i++) {

	       	DB::table('tareas_templates')->insert([
	            'titulo' => $faker->company,
              'descripcion' => $faker->realText($maxNbChars = 190, $indexSize = 2),
	            'es_critica' => $faker->boolean,
	            'ultimo_milestone' => $faker->boolean,
	            'dias_sugeridos' => rand(1, 10),
              'asigna_pm_automatico' => $faker->boolean,
              'id_tipo_tarea' => rand(1, 3),
	            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            	'created_by' => 1,
	        ]);

        }

    }
}
