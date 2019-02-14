<?php

use App\User;
use App\Bookings;
use App\Clientes;
use App\Contenedor;
use App\ContenedorSize;
use App\ContenedorTipo;
use App\Depositos;
use App\Movimiento;
use App\Operadores;
use App\Terminales;
use App\Transportista;
use App\buqueSalida;
use App\logBookings;
use App\logContenedores;
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

$factory->define(Depositos::class, function (Faker\Generator $faker) {

    return [
        'nombre' =>  $faker->company,
    ];
});

$factory->define(buqueSalida::class, function (Faker\Generator $faker) {

    return [
        'nombre' =>  $faker->company,      
    ];
});

$factory->define(ContenedorSize::class, function (Faker\Generator $faker) {
    return [
        'size' =>  $faker->randomElement([20, 40, 60]),
    ];
});

$factory->define(ContenedorTipo::class, function (Faker\Generator $faker) {
    
    $size = ContenedorSize::inRandomOrder()->first();
    if ($size->size==20) {
     return [
        'size_id' => $size,
        'tipo' =>  $faker->randomElement(['DRY A', 'DRY A+','DRY B','DRY B+','DRY BB','DRY BB+','O.T','H.T','F.R']),
    ];    
    }elseif ($size->size==40) {
        return [
        'size_id' => $size,
        'tipo' =>  $faker->randomElement(['FLEXI','REEFER STD','HC A', 'HC A+','HC B','HC B+','HC BB','HC BB+']),
    ];  
    }else{
        return [
        'size_id' => $size,
        'tipo' =>  $faker->randomElement(['DRY A', 'DRY A+','DRY B','DRY B+','DRY BB','DRY BB+','O.T','H.T','F.R','FLEXI','REEFER STD','HC A', 'HC A+','HC B','HC B+','HC BB','HC BB+']),
        ];
    };

});


$factory->define(Terminales::class, function (Faker\Generator $faker) {
    return [
    'nombre' =>  $faker->randomElement(['BACTSSA','T.R.P.','EXOLGAN','TERMINAL 4','ZARATE','USUHAIA','LA PLATA','MAERSK']),
    ];
});

$factory->define(Operadores::class, function (Faker\Generator $faker) {
    return [
    'nombre' =>  'MAERSK',
    ];
});

$factory->define(Contenedor::class, function (Faker\Generator $faker) {

     $deposito_id = Depositos::inRandomOrder()->first()->id;
     $tipo = ContenedorTipo::inRandomOrder()->first()->tipo;
     $size = $faker->randomElement([20, 40, 60]);
        if ($size==20) {
         return [
            'codigo' =>  $faker->swiftBicNumber,
            'size' => $size,
            'estado' => $faker->randomElement(['OK', 'AVERIADO']),
            'bloqueado' => $faker->randomElement(['Disponible', 'Bloqueado']),
            'fecha_ultimo_movimiento' => $faker->dateTimeThisYear($max = 'now', $timezone = date_default_timezone_get()),
            'deposito_id' => $deposito_id,  
            'tipo' =>  $faker->randomElement(['DRY A', 'DRY A+','DRY B','DRY B+','DRY BB','DRY BB+','O.T','H.T','F.R']),
        ];    
        }elseif ($size==40) {
            return [
           'codigo' =>  $faker->swiftBicNumber,
            'size' => $size,
            'estado' => $faker->randomElement(['OK', 'AVERIADO']),
            'bloqueado' => $faker->randomElement(['Disponible', 'Bloqueado']),
            'fecha_ultimo_movimiento' => $faker->dateTimeThisYear($max = 'now', $timezone = date_default_timezone_get()),
            'deposito_id' => $deposito_id,  
            'tipo' =>  $faker->randomElement(['FLEXI','REEFER STD','HC A', 'HC A+','HC B','HC B+','HC BB','HC BB+']),
        ];  
        }else{
            return [
            'codigo' =>  $faker->swiftBicNumber,
            'size' => $size,
            'estado' => $faker->randomElement(['OK', 'AVERIADO']),
            'bloqueado' => $faker->randomElement(['Disponible', 'Bloqueado']),
            'fecha_ultimo_movimiento' => $faker->dateTimeThisYear($max = 'now', $timezone = date_default_timezone_get()),
            'deposito_id' => $deposito_id,  
            'tipo' =>  $faker->randomElement(['DRY A', 'DRY A+','DRY B','DRY B+','DRY BB','DRY BB+','O.T','H.T','F.R','FLEXI','REEFER STD','HC A', 'HC A+','HC B','HC B+','HC BB','HC BB+']),
        ];
    };
   

});

$factory->define(Transportista::class, function (Faker\Generator $faker) {
    return [
    'nombre' =>  $faker->name,
    'patente' => $faker->swiftBicNumber,
    'documento' => $faker->ean8,
    'patente_semi' => $faker->isbn13,
    'empresa' => $faker->company,
    ];
});
$factory->define(Bookings::class, function (Faker\Generator $faker) {
    return [
    'codigo' => $faker->swiftBicNumber,
    'cantidad_egresos' => $faker->numberBetween(15,30),
    'limite_contenedores' => $faker->numberBetween(30,45),
    ];
});
$factory->define(Clientes::class, function (Faker\Generator $faker) {
    return [
    'nombre' => $faker->name,
    'direccion' => $faker->address,
    ];
});



$factory->define(logContenedores::class, function (Faker\Generator $faker) {
   
   $cliente = User::inRandomOrder()->first()->id;
   $contenedor = Contenedor::inRandomOrder()->first()->id;

   
    return [

        'accion'=> $faker->randomElement(['INGRESO', 'EGRESO','REMISION','MODIFICACION']),

        'contenedor'=> $contenedor,

       
        
        'descripcion'=> $faker->text,

        'fecha'=> $faker->dateTimeThisYear($max = 'now', $timezone = date_default_timezone_get()),

        'usuario'=> $cliente,
    ];
});


$factory->define(logBookings::class, function (Faker\Generator $faker) {
 
   $cliente = User::inRandomOrder()->first()->id;
   $contenedor = Contenedor::inRandomOrder()->first()->id;
      $booking = Bookings::inRandomOrder()->first()->id;
    return [

        'accion'=> $faker->randomElement(['INGRESO', 'EGRESO','REMISION','MODIFICACION']),

        'contenedor'=> $contenedor,
         'booking'=> $booking,
        
        'descripcion'=> $faker->text,

        'fecha'=> $faker->dateTimeThisYear($max = 'now', $timezone = date_default_timezone_get()),

        'usuario'=> $cliente,
    ];
});


$factory->define(Movimiento::class, function (Faker\Generator $faker) {
   $tipo = ContenedorTipo::inRandomOrder()->first()->tipo;
   $cliente = User::inRandomOrder()->first()->id;
   $contenedor = Contenedor::inRandomOrder()->first();

    return [
        'fecha_movimiento'=> $faker->dateTimeThisYear($max = 'now', $timezone = date_default_timezone_get()),
        'tipo_movimiento'=> $faker->randomElement(['INGRESO', 'EGRESO','REMISION']),
        
        'contenedor_codigo'=> $contenedor->codigo,
        'contenedor_size'=> $contenedor->size,
        'contenedor_tipo'=> $contenedor->tipo,
        'contenedor_estado'=> $contenedor->estado,
        
        'buque_salida'=> $faker->isbn13,
        'terminal_destino'=> $faker->randomElement(['BACTSSA','T.R.P.','EXOLGAN','TERMINAL 4','ZARATE','USUHAIA','LA PLATA','MAERSK']),
        
        'cliente_direccion'=> $faker->address,
        'cliente_razon_social'=> $faker->name,
        'deposito'=> $faker->company,
        'booking_codigo'=> $faker->swiftBicNumber,

        'transportista_nombre'=> $faker->name,
        'transportista_patente'=> $faker->swiftBicNumber,
        'transportista_documento'=> $faker->ean8,
        'transportista_patente_semi'=> $faker->isbn13,
        'transportista_empresa'=> $faker->company,

        'observaciones'=> $faker->text($maxNbChars = 200),

        'perfil_cliente_id'=> $cliente,
    ];
});