<?php

use App\User;
use App\dispositivo;
use App\medicion;
use App\variable;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => 'Alejandro',
        'last_name' => 'Alfonzo',
        'empresa' => 'TecSolutions',
        'avatar' => '1.jpg',
        'email' => 'test@test.com',
        'password' => $password ?: $password = bcrypt('123456'),
        'remember_token' => str_random(10),
        'verified'=> User::USUARIO_VERIFICADO,
        'verification_token' => null,
        'admin' => User::ES_ADMIN,

    ];
});
$factory->define(dispositivo::class, function (Faker\Generator $faker) {
    return [
        'encendido' => $faker->randomElement([dispositivo::ENCENDIDO, dispositivo::NO_ENCENDIDO]),
        'perfil_cliente_id' => User::inRandomOrder()->first()->id,
        'nombre' => $faker->word,
        'nro_serie' => $faker->ean13,
        'ubicacion' => $faker->address,
    ];
});
$factory->define(variable::class, function (Faker\Generator $faker) {
   
      
    $dispositivoID = dispositivo::inRandomOrder()->first()->id;
 


    return [
        'status' => $status = $faker->randomElement([variable::ACTIVA, variable::NO_ACTIVA]),
        'code' => 'var1',
        'dispositivo_id' => $dispositivoID,
        'unidad' => $faker->randomElement(['celcius', 'kg', 'farenheit']),
        'maximo' => $faker->numberBetween(200,300),
        'minimo' => $faker->numberBetween(1,50),
        'nombre' => $faker->word,
        'rango_maximo' => $faker->numberBetween(80,200),
        'rango_minimo' => $faker->numberBetween(50,80),
        'fecha_ultima_medicion'=> null,
        'ultima_medicion'=> null,
        'cantidad_mediciones'=> null,
        'suma_mediciones'=> null,
        'json',
    ];
});

$factory->define(medicion::class, function (Faker\Generator $faker) {
    return [
        'variable_id' => variable::inRandomOrder()->first()->id,
        'valor' => $faker->numberBetween(1,300),
    ];


});
