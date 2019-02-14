<?php

use App\User;

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
