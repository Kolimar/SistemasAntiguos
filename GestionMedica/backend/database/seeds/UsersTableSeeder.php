<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      $admin= DB::table('roles')->insertGetId([
          'nombre' => 'Administrador',
      ]);

      $secretaria= DB::table('roles')->insertGetId([
          'nombre' => 'Secretaria',
      ]);

      // DB::table('users')->insert([
      //     'nombres' => 'Darryn Josué',
      //     'apellidos' => 'Briceño Crespo',
      //     'email' => 'darrynjzb@gmail.com',
      //     'password' => bcrypt('123456'),
      //     'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      //     'id_rol' => $admin
      // ]);
      //
      // DB::table('users')->insert([
      //     'nombres' => 'Florencia',
      //     'apellidos' => 'Gemini',
      //     'email' => 'florencia.gemini@tecsolutions.com.ar',
      //     'password' => bcrypt('123456'),
      //     'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      //     'id_rol' => $admin
      // ]);

      // $faker = Faker::create();
      // for ($i=1; $i <= 50; $i++) {
      //
      //   DB::table('users')->insert([
      //       'nombres' => $faker->firstName($gender = null|'male'|'female'),
      //       'apellidos' => $faker->lastName,
      //       'email' => $faker->safeEmail,
      //       'password' => bcrypt('123456'),
      //       'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
      //       'id_rol' => $secretaria
      //   ]);
      //
      // }

      DB::table('users')->insert([
        'nombres' => 'Natalia',
        'apellidos' => '',
        'email' => 'natalia@gmail.com',
        'password' => bcrypt('123456'),
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        'id_rol' => $admin
      ]);

      DB::table('users')->insert([
        'nombres' => 'Debora',
        'apellidos' => '',
        'email' => 'debora@gmail.com',
        'password' => bcrypt('123456'),
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        'id_rol' => $admin
      ]);

      DB::table('users')->insert([
        'nombres' => 'Victoria',
        'apellidos' => '',
        'email' => 'victoria@gmail.com',
        'password' => bcrypt('123456'),
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        'id_rol' => $secretaria
      ]);

      DB::table('users')->insert([
        'nombres' => 'Julieta',
        'apellidos' => '',
        'email' => 'julieta@gmail.com',
        'password' => bcrypt('123456'),
        'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        'id_rol' => $secretaria
      ]);

    }
}
