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

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

// RUTAS PARA LOGIN Y REGISTRO DE USUARIOS
Route::resource('tests', 'TestController');
Route::post('login', 'Auth\LoginController@authenticate');
Route::post('register', 'Auth\RegisterController@register');
Route::get('listado-puestos', 'UserController@getListadoPuesto');
Route::post('subir-contrato/{id}', 'ClienteController@subirContrato');

// ENVIO DE EMAIL PARA CAMBIO DE CONTRASEÑA
Route::post('envio-email-cambio-contrasena', 'UserController@envioEmailRecuperacion');

Route::group(['middleware' => ['jwt.auth', 'cors', 'user-habilitado']], function () {

	// LOGOUT DESTRUIR TOKEN
	Route::get('logout', 'Auth\LoginController@logout');

	// CAMBIO DE CONTRASEÑA
	Route::post('cambio-contrasena', 'UserController@cambioContrasena');

	// RUTAS PARA USUARIOS
	Route::resource('users', 'UserController', ['except' => [ 'create', 'edit']]);
	Route::get('listado-users', 'UserController@getListado');

	//RUTAS PARA EL MODULO TAREAS TEMPLATE
	Route::resource('tareas-templates', 'TareaTemplateController', ['except' => [ 'create', 'edit']]);
	Route::get('listado-tareas-templates', 'TareaTemplateController@getListado');
	Route::get('tareas-templates-detalle/{id}', 'TareaTemplateController@getTareaTemplateDetalle');

	//RUTAS PARA EL MODULO SERVICIOS
	Route::resource('servicios', 'ServicioController', ['except' => [ 'create', 'edit']]);

	//RUTAS PARA EL MODULO TAREAS TEMPLATES RELACIONADAS A SERVICIOS
	Route::resource('servicios-tareas-templates', 'ServicioTareaTemplateController', ['except' => [ 'create', 'edit']]);

	//RUTAS PARA EL MODULO CLIENTES
	Route::resource('clientes', 'ClienteController', ['except' => [ 'create', 'edit']]);
	Route::get('listado-clientes', 'ClienteController@getListado');
	Route::get('listado-clientes-activos', 'ClienteController@getListadoActivos');
	Route::get('listado-clientes-servicios/{id}', 'ClienteController@getListadoClientesServicios');
	Route::get('pm-cliente/{id}', 'ClienteController@getPmCliente');

	//RUTAS PARA EL MODULO TAREAS
	Route::resource('tareas', 'TareaController', ['except' => [ 'create', 'edit']]);
	Route::get('verificar-subtareas/{id}', 'TareaController@getCantidadSubtareas');
	Route::get('listado-tipos-tareas', 'TareaController@getListadoTiposTareas');

	//RUTAS PARA EL MODULO SUBTAREAS
	Route::resource('subtareas', 'SubtareaController', ['except' => [ 'create', 'edit']]);
	Route::post('subtareas-edit', 'SubtareaController@update');
	Route::get('listado-subtareas/{id}', 'SubtareaController@getListado');
	Route::post('subtareas-destroy', 'SubtareaController@destroy');

	//RUTAS PARA MODULO BRIEF
	Route::resource('brief', 'BriefController', ['except' => [ 'create', 'edit']]);
	Route::get('listado-roles-contactos', 'BriefController@getListadoRolesContacto');
	Route::get('listado-servicios', 'BriefController@getListadoServicios');
	Route::get('listado-tipos-empresas', 'BriefController@getListadoTiposEmpresas');
	Route::get('listado-metodos-facturacion', 'BriefController@getListadoMetodosFacturacion');
	Route::get('listado-tipos-ventas', 'BriefController@getListadoTiposVentas');
	Route::get('listado-canales-adquisicion', 'BriefController@getListadoCanalesAdquisicion');
	Route::get('listado-tipos-telefonos', 'BriefController@getListadoTiposTelefonos');
	Route::get('listado-contactos/{id}', 'BriefController@getListadoContactos');
	Route::get('detail-brief/{id}', 'BriefController@show');
	Route::post('add-contacto-brief', 'BriefController@addContacto');
	Route::put('edit-contacto-brief/{id}', 'BriefController@editContacto');
	Route::get('delete-contacto-brief/{id}', [
	 	'uses' => 'BriefController@deleteContacto',
	]);
	Route::post('add-servicio-brief', 'BriefController@addServicio');
	Route::put('edit-servicio-brief/{id}', 'BriefController@editServicio');
	Route::get('delete-servicio-brief/{id}', [
	 	'uses' => 'BriefController@deleteServicio',
	]);

	//RUTAS PARA MODULO CLIENTE
	Route::resource('cliente', 'ClienteController', ['except' => [ 'create', 'edit']]);
	Route::get('detail-cliente/{id}', 'ClienteController@show');
	Route::get('formas-pago', 'ClienteController@getListadoFormasPago');
	Route::post('add-contacto-cliente', 'ClienteController@addContacto');
	Route::put('edit-contacto-cliente/{id}', 'ClienteController@editContacto');
	Route::put('delete-cliente/{id}', 'ClienteController@destroy');
	Route::get('delete-contacto-cliente/{id}', [
	 	'uses' => 'ClienteController@deleteContacto',
	]);
	Route::post('add-servicio-cliente', 'ClienteController@addServicio');
	Route::put('edit-servicio-cliente/{id}', 'ClienteController@editServicio');
	Route::get('delete-servicio-cliente/{id}', [
		'uses' => 'ClienteController@deleteServicio',
	]);
	Route::get('panel-cliente', 'ClienteController@getPanelClientes');

	// RUTAS PARA LOGS
	Route::resource('logs', 'LogController', ['except' => [ 'create', 'edit']]);

	//RUTAS PARA MODULO ABMS
	// RUTAS PARA ROLES DE CONTACTO
	Route::resource('roles-contactos', 'RolContactoController', ['except' => [ 'create', 'edit']]);

	// RUTAS PARA FORMAS DE PAGO
	Route::resource('formas-pago', 'FormaPagoController', ['except' => [ 'create', 'edit']]);

	// RUTAS PARA CANALES DE ADQUISICION
	Route::resource('canales-adquisicion', 'CanalAdquisicionController', ['except' => [ 'create', 'edit']]);

	// RUTAS PARA MOTIVOS DE LOGS
	Route::resource('motivos-logs', 'MotivoLogController', ['except' => [ 'create', 'edit']]);
	Route::get('listado-motivos-logs', 'MotivoLogController@getListadoMotivosLogs');
	Route::get('listado-motivos-logs-manuales', 'MotivoLogController@getListadoMotivosLogsManuales');

	// RUTAS PARA TIPOS DE TAREA
	Route::resource('tipos-tareas', 'TipoTareaController', ['except' => [ 'create', 'edit']]);

	//RUTAS PARA BRIEFS PRIMERA REUNION
	Route::resource('briefs-primera-reunion', 'BriefPrimeraReunionController', ['except' => [ 'create', 'edit']]);
	Route::get('export-excel-briefs-primera-reunion', 'BriefPrimeraReunionController@exportExcel');

});

//Route::group(['middleware' => 'auth:api'], function () {
//
//});'middleware' => 'cors'
