<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\RolContacto;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class RolContactoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        // QUERY PARA NOMBRE
        if ($request->nombre && $request->nombre != " ") {

            $query1= "roles_contactos.nombre LIKE '%$request->nombre%'";

        }else{

            $query1= "roles_contactos.nombre LIKE '%$request->nombre%'";

        }

        // ORDENAMIENTOS
        if ($request->nombre_ord) {
            $columna= 'nombre';
            $ord= $request->nombre_ord;
        }else{
            $columna= 'nombre';
            $ord= 'ASC';
        }

        // LIMITE
        $offset= ((int)$request->pagina) * 10;

        $rolesContactos= RolContacto::
          whereRaw(\DB::raw($query1))
          ->orderBy($columna,$ord)
          ->offset($offset)
          ->limit(10)
          ->get();

          return response()->json($rolesContactos);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {

            \DB::beginTransaction();

            JWTAuth::parseToken();
            $user = JWTAuth::parseToken()->authenticate();

            $rolContacto= new RolContacto($request->all());
            $rolContacto->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $rolContacto->created_by= $user->id;
            $rolContacto->save();

            \DB::commit();
            return response()->json('Registro ok', 201);

        }catch (Exception $e) {
            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        try {

            \DB::beginTransaction();

            $rolContacto= RolContacto::FindOrFail($id);
            $rolContacto->nombre= $request->nombre;
            $rolContacto->save();

            $rolesContactos= RolContacto::orderBy('nombre','ASC')->where('id','=',$id)->get();

            \DB::commit();
            return response()->json($rolesContactos);

        }catch (Exception $e) {
            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        try {
          \DB::beginTransaction();

          $verificarContactosBrief= RolContacto::find($id)->contactos()->get();
          $verificarContactosCliente= RolContacto::find($id)->contactosClientes()->get();

          if (!$verificarContactosBrief->isEmpty() || !$verificarContactosCliente->isEmpty()) {

            return response()->json("No es posible eliminar este rol de contacto, existen contactos de clientes y briefs de ventas que lo usan", 409);

          }else{

            $eliminar= RolContacto::find($id)->delete();
            \DB::commit();
            return response()->json("ok", 200);

          }

        } catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }
}
