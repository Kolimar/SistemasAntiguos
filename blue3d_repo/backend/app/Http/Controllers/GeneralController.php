<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Rol;

class GeneralController extends Controller
{

    public function listadoRoles()
    {

        $roles= Rol::orderBy('nombre','ASC')->get();
        return response()->json($roles, 200);

    }

}
