<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\FormaPago;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class FormaPagoController extends Controller
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

          $query1= "formas_pagos.nombre LIKE '%$request->nombre%'";

      }else{

          $query1= "formas_pagos.nombre LIKE '%$request->nombre%'";

      }

      // QUERY PARA NOMBRE
      if ($request->descripcion && $request->descripcion != " ") {

          $query2= "AND formas_pagos.descripcion LIKE '%$request->descripcion%'";

      }else{

          $query2= "";

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

      $formasPago= FormaPago::
        whereRaw(\DB::raw($query1 . " " . $query2))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($formasPago);
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

            $formaPago= new FormaPago($request->all());
            $formaPago->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $formaPago->created_by= $user->id;
            $formaPago->save();

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

            $formaPago= FormaPago::FindOrFail($id);
            $formaPago->nombre= $request->nombre;
            $formaPago->descripcion= $request->descripcion;
            $formaPago->save();

            $formasPagos= FormaPago::orderBy('nombre','ASC')->where('id','=',$id)->get();

            \DB::commit();
            return response()->json($formasPagos);

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

          $verificarFormaPago= FormaPago::find($id)->clientes()->get();

          if (!$verificarFormaPago->isEmpty()) {

            return response()->json("No es posible eliminar esta forma de pago, existen clientes que lo usan", 409);

          }else{

            $eliminar= FormaPago::find($id)->delete();
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
