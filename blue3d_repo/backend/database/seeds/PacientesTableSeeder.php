<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class PacientesTableSeeder extends Seeder
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

        DB::table('pacientes')->insert([
            'dni' => rand(10000000, 50000000),
            'fecha_nacimiento' => $faker->dateTimeBetween($startDate = '-80 years', $endDate = 'now', $timezone = date_default_timezone_get())->format('Y-m-d'),
            'nombres' => $faker->firstName($gender = null|'male'|'female'),
            'apellidos' => $faker->lastName,
            'n_afiliado' => rand(1,100),
            'domicilio' => $faker->secondaryAddress,
            'n_departamento' => rand(1, 100),
            'barrio' => $faker->city,
            'telefono' => $faker->e164PhoneNumber,
            'celular' => $faker->e164PhoneNumber,
            'email' => $faker->safeEmail,
            'observaciones' => $faker->realText($maxNbChars = 190, $indexSize = 2),
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'id_obra_social' => rand(1, 20),
            'id_particular' => rand(1, 2),
            'created_by' => 1,
        ]);

      }

    }
}
