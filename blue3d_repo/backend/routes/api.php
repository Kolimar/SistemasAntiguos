<?php

use Illuminate\Http\Request;

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
Route::post('login', 'Auth\LoginController@authenticate');
Route::post('register', 'Auth\RegisterController@register');
Route::get('export-excel-ingresos', 'IngresoGastoController@exportExcel');
Route::get('export-excel-estudios', 'EstudioController@exportExcel');
//Route::resource('test', 'TestController', ['except' => [ 'create', 'edit']]);

//LISTADO DE ROLES
Route::get('listado-roles', 'GeneralController@listadoRoles');

Route::group(['middleware' => ['jwt.auth', 'cors']], function () {

    // LOGOUT DESTRUIR TOKEN
    Route::get('logout', 'Auth\LoginController@logout');

    // RUTA PARA PRESTACIONES
    Route::resource('prestaciones', 'PrestacionController', ['except' => [ 'create', 'edit']]);
    Route::get('cmb-prestaciones', 'PrestacionController@cmbListado');

    // RUTA PARA OBRAS SOCIALES
    Route::resource('obras-sociales', 'ObraSocialController', ['except' => [ 'create', 'edit']]);

    // RUTA PARA DOCTORES
    Route::resource('doctores', 'DoctorController', ['except' => [ 'create', 'edit']]);
    Route::resource('visitas', 'VisitaController', ['except' => [ 'create', 'edit']]);
    Route::get('cmb-doctores', 'DoctorController@cmbListado');

    // RUTA PARA PARTICULARES
    Route::resource('particulares', 'ParticularController', ['except' => [ 'create', 'edit']]);

    // RUTA PARA PACIENTES
    Route::resource('pacientes', 'PacienteController', ['except' => [ 'create', 'edit']]);
    Route::get('listado-obras-sociales', 'ObraSocialController@listado');
    Route::get('listado-particulares', 'ParticularController@listado');
    Route::get('cmb-pacientes', 'PacienteController@cmbListado');

    // RUTA PARA PRECIOS POR OBRA SOCIAL
    Route::resource('precios-obras-sociales', 'PrecioXObraSocialController', ['except' => [ 'create', 'edit']]);

    // RUTA PARA PRECIOS POR PARTICULARES
    Route::resource('precios-particulares', 'PrecioXParticularController', ['except' => [ 'create', 'edit']]);

    // RUTA PARA PRECIOS POR PARTICULARES
    Route::resource('ingresos-gastos', 'IngresoGastoController', ['except' => [ 'create', 'edit']]);

    // RUTA PARA ESTUDIOS
    Route::resource('estudios', 'EstudioController', ['except' => [ 'create', 'edit']]);
    Route::get('pagos-estudios/{id}', 'EstudioController@getPagos');
    Route::post('add-pago', 'EstudioController@addPago');
    Route::put('edit-pago/{id}', 'EstudioController@editPago');
    Route::put('delete-pago/{id}', 'EstudioController@deletePago');

});
