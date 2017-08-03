<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('password/reset', [
	'uses' 	=> 'Auth\ResetPasswordController@getChangePassword',
	'as' 	=> 'password.reset'
]);

Route::post('password/reset', [
	'uses' 	=> 'Auth\ResetPasswordController@postChangePassword',
	'as' 	=> 'password.reset'
]);

Route::get('logout', 'Auth\LoginController@logoutWeb');
