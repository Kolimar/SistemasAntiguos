<?php

use Illuminate\Database\Seeder;

use Faker\Factory as Faker;

use Carbon\Carbon;

class PuestosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //PUESTOS
        DB::table('puestos')->insert([
            'nombre' => 'Project Manager',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Administracion',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Cobranzas',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Optimización',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Diseñador',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'RRHH',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Ventas',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'CEO',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Coordinador',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Marketing',
        ]);

        DB::table('puestos')->insert([
            'nombre' => 'Otros',
        ]);


        // USUARIOS
        DB::table('users')->insert([
            'nombres' => 'Darryn Josue',
	        'apellidos' => 'Briceño Crespo',
	        'id_puesto' => 1,
	        'telefono_laboral' => '1150180152',
	        'celular_laboral' => '1150180152',
	        'email_laboral' => 'darryn.briceno@tecsolutions.com.ar',
	        'telefono_personal' => '1165771068',
	        'celular_personal' => '1165771068',
	        'email_personal' => 'darrynjzb@gmail.com',
	        'password' => \Hash::make('123456'),
          'habilitado' => 1,
	        'created_by' => 1,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        DB::table('users')->insert([
            'nombres' => 'Florencia',
            'apellidos' => 'Gemini',
            'id_puesto' => 1,
            'telefono_laboral' => '52176124',
            'celular_laboral' => '1552369875',
            'email_laboral' => 'florencia.gemini@tecsolutions.com.ar',
            'telefono_personal' => '48563470',
            'celular_personal' => '1151791960',
            'email_personal' => 'flor_gemini@hotmail.com',
            'password' => \Hash::make('123456'),
            'habilitado' => 1,
            'created_by' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        DB::table('users')->insert([
            'nombres' => 'Test',
            'apellidos' => 'Tecsolutions',
            'id_puesto' => 1,
            'telefono_laboral' => '123456',
            'celular_laboral' => '123456',
            'email_laboral' => 'test@mail.com',
            'telefono_personal' => '123456',
            'celular_personal' => '123456',
            'email_personal' => 'test_personal@mail.com',
            'password' => \Hash::make('123456'),
            'habilitado' => 1,
            'created_by' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        DB::table('users')->insert([
            'nombres' => 'Victor',
            'apellidos' => 'Vitullo',
            'id_puesto' => 1,
            'telefono_laboral' => '123456',
            'celular_laboral' => '123456',
            'email_laboral' => 'victor@tecsolutions.com.ar',
            'telefono_personal' => '123456',
            'celular_personal' => '123456',
            'email_personal' => 'victor@mail.com',
            'password' => \Hash::make('123456'),
            'habilitado' => 1,
            'created_by' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        DB::table('users')->insert([
            'nombres' => 'Daniel',
            'apellidos' => 'Presman',
            'id_puesto' => 1,
            'telefono_laboral' => '123456',
            'celular_laboral' => '123456',
            'email_laboral' => 'daniel@godixital.com',
            'telefono_personal' => '123456',
            'celular_personal' => '123456',
            'email_personal' => 'daniel@mail.com',
            'password' => \Hash::make('123456'),
            'habilitado' => 1,
            'created_by' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        DB::table('users')->insert([
            'nombres' => 'Felipe',
            'apellidos' => 'Roitman',
            'id_puesto' => 1,
            'telefono_laboral' => '123456',
            'celular_laboral' => '123456',
            'email_laboral' => 'felipe@godixital.com',
            'telefono_personal' => '123456',
            'celular_personal' => '123456',
            'email_personal' => 'felipe@mail.com',
            'password' => \Hash::make('123456'),
            'habilitado' => 1,
            'created_by' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

    }
}
