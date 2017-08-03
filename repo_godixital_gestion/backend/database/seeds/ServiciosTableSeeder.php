<?php

use Illuminate\Database\Seeder;

use Faker\Factory as Faker;

use Carbon\Carbon;

class ServiciosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $faker = Faker::create();

        $id_serv= DB::table('servicios')->insertGetId([
            'nombre' => 'Landing Page',
            'descripcion' => 'Landing Page',
            'es_recurrente' => 1,
            'monto_sugerido' => 3500,
            'habilitado' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => 1,
        ]);

        for ($i=0; $i <= 50; $i++) {

	       	DB::table('servicios')->insert([
	            'nombre' => $faker->company,
	            'descripcion' => $faker->realText($maxNbChars = 190, $indexSize = 2),
	            'es_recurrente' => $faker->boolean,
	            'monto_sugerido' => rand(1,10000),
                'habilitado' => $faker->boolean,
	            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            	'created_by' => 1,
	        ]);

        }

        // $id= DB::table('clientes')->insertGetId([
        //     'nombre' => 'Victor Vitullo',
        //     'contrato_firmado' => 1,
        //     'pm_asignado' => 1,
        //     'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        //     'created_by' => 1,
        // ]);
        //
        // DB::table('clientes')->insert([
        //     'nombre' => 'Carlos de Bernardi',
        //     'contrato_firmado' => 0,
        //     'pm_asignado' => 2,
        //     'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        //     'created_by' => 1,
        // ]);
        //
        // for ($i=0; $i <= 50; $i++) {
        //
        //     DB::table('clientes')->insert([
        //         'nombre' => $faker->name,
        //         'contrato_firmado' => $faker->boolean,
        //         'pm_asignado' => rand(1,40),
        //         'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        //         'created_by' => 1,
        //     ]);
        //
        // }

    }
}
