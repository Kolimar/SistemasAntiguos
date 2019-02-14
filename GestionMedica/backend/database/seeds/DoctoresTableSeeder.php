<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class DoctoresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      $faker = Faker::create();
      for ($i=1; $i <= 50; $i++) {

        DB::table('doctores')->insert([
            'matricula' => rand(1, 999999),
            'nombres' => $faker->firstName($gender = null|'male'|'female'),
            'apellidos' => $faker->lastName,
            'especialidad' => $faker->company,
            'domicilio' => $faker->secondaryAddress,
            'n_departamento' => rand(1, 100),
            'telefono' => $faker->e164PhoneNumber,
            'celular' => $faker->e164PhoneNumber,
            'email' => $faker->safeEmail,
            'observaciones' => $faker->realText($maxNbChars = 190, $indexSize = 2),
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => 1,
        ]);

      }

    }
}
