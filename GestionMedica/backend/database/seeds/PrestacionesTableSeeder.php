<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class PrestacionesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      DB::table('prestaciones')->insert([
          'nombre' => "ATM (de cuatro tomas)",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "ATM (de dos tomas)",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Bite wing",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Oclusal",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Panorámica",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Periapical",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Senos frontales",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Senos maxilares",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Seriada (completa)",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Seriada (media)",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Tomografía ambos maxilares",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Tomografía hemi maxilar",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Tomografía maxilar superior o inferior",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Tomografía sector anterior",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Tomografía tercer molar bilateral",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

      DB::table('prestaciones')->insert([
          'nombre' => "Tomografía tercer molar unilateral",
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => 1,
      ]);

    }
}
