<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class VerificarTokenController extends Controller
{

	// somewhere in your controller
	public function getAuthenticatedUser()
	{

      $newToken= JWTAuth::parseToken()->authenticate();
			return response()->json($newToken);

	}

}
