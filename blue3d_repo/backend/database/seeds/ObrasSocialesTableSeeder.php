<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class ObrasSocialesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      // OBRAS SOCIALES
      DB::table('obras_sociales')->insert([
          'nombre' => "Servesalud",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('obras_sociales')->insert([
          'nombre' => "Osde",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('obras_sociales')->insert([
          'nombre' => "Swissmedical",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('obras_sociales')->insert([
          'nombre' => "Medifer",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('obras_sociales')->insert([
          'nombre' => "Promoción/IOMA",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      // PARTICULARES
      DB::table('particulares')->insert([
          'nombre' => "Lista",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('particulares')->insert([
          'nombre' => "Promoción",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

    }
}
