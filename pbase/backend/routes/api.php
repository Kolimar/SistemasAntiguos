<?php

use Illuminate\Http\Request;
use App\Http\Middleware\userRolesMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
**Acceso directo al recurso por Get
Route::resource('perfiles','Perfil\PerfilController',['only'=>['index','show']]);
*/

/*
**Grupo de rutas regulado por passport
*/
Route::group(['middleware' => ['auth:api','client.credentials','habilitacion']], function () {

	// Recurso User (Index, Show, Store, Update, Destroy)
	Route::resource('users','User\UserController',['except'=>['create','edit']]);

	Route::resource('clientes','PerfilCliente\PerfilClienteController',['only'=>['index','show']]);
	
	// Rutas de verificacion de usuario (currentUser devuelve el usuario de passport asociado al token enviado en el header)
	// La estructura de la consulta es:  Header{'Authorization':'Bearer {token}'}

	Route::group(['prefix' => 'currentUser'], function() {
	    Route::get('/', function() {
	    	$data = response()->json(request()->user());
	        return $data;
	    });

	});

});

/*
**Grupo de rutas abiertas de la api para autenticar o porque se desea dejar abierto por alguna causa
*/
//
//Este grupo esta regulado por un middleware que verifica antes de atender la peticion que el usuario este habilitado
// a traves del mail del request
//
Route::group(['middleware' => ['loginVerify']], function () {
	
	//Solicitar token 
	Route::post('oauth/token', '\Laravel\Passport\Http\Controllers\AccessTokenController@issueToken');

	//Solicitar Reset de Pass
	Route::post('password','User\UserController@reqPass');

});
//Con esto se resetea la password a la que es por defecto (123456), se pueden hacer varias cosas mas pero todo depende de la necesidad.

Route::get('password/reset/{token}', function($token){
		
		$userRequest = \App\User::where('verification_token','=', $token)->firstOrFail();
		$userRequest->verification_token = \App\User::generarVerificationToken();
		$userRequest->password = bcrypt('123456');
		$userRequest->save();

		return response()->json('La contrasenia ha sido reestablecida al valor: 123456');

})->name('password.reset');

//El middleware habilitacion en caso de que se deshabilite el user redirije aca y no deja entrar a ninguna ruta del grupo superior.

Route::get('disabledUser', function() {
	    	$data = response()->json('Su usuario ha sido deshabilitado si cree que es un error contacte al administrador',433);
	        return $data;
});



