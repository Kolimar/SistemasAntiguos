<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Doctor;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(request $request)
    {

      // QUERY PARA MATRICULA
      if ($request->matricula && $request->matricula != " ") {

          $query1= "doctores.matricula LIKE '%$request->matricula%'";

      }else{

          $query1= "doctores.matricula LIKE '%$request->matricula%'";

      }

      // QUERY PARA NOMBRES
      if ($request->nombres && $request->nombres != " ") {

          $query2= "AND doctores.nombres LIKE '%$request->nombres%'";

      }else{

          $query2= " ";

      }

      // QUERY PARA APELLIDOS
      if ($request->apellidos && $request->apellidos != " ") {

          $query3= "AND doctores.apellidos LIKE '%$request->apellidos%'";

      }else{

          $query3= " ";

      }

      // QUERY PARA ESPECIALIDAD
      if ($request->especialidad && $request->especialidad != " ") {

          $query4= "AND doctores.especialidad LIKE '%$request->especialidad%'";

      }else{

          $query4= " ";

      }

      // QUERY PARA DOMICILIO
      if ($request->domicilio && $request->domicilio != " ") {

          $query5= "AND doctores.domicilio LIKE '%$request->domicilio%'";

      }else{

          $query5= " ";

      }

      // QUERY PARA DEPARTAMENTO
      if ($request->departamento && $request->departamento != " ") {

          $query6= "AND doctores.n_departamento LIKE '%$request->departamento%'";

      }else{

          $query6= " ";

      }

      // QUERY PARA TELEFONO
      if ($request->telefono && $request->telefono != " ") {

          $query7= "AND doctores.telefono LIKE '%$request->telefono%'";

      }else{

          $query7= " ";

      }

      // QUERY PARA CELULAR
      if ($request->celular && $request->celular != " ") {

          $query8= "AND doctores.celular LIKE '%$request->celular%'";

      }else{

          $query8= " ";

      }

      // QUERY PARA EMAIL
      if ($request->email && $request->email != " ") {

          $query9= "AND doctores.email LIKE '%$request->email%'";

      }else{

          $query9= " ";

      }

      // QUERY PARA ONSERVACIONES
      if ($request->observaciones && $request->observaciones != " ") {

          $query10= "AND doctores.observaciones LIKE '%$request->observaciones%'";

      }else{

          $query10= " ";

      }

      // ORDENAMIENTOS
      if ($request->nombres_ord) {
          $columna= 'nombres';
          $ord= $request->nombres_ord;
      }else{
          $columna= 'nombres';
          $ord= 'ASC';
      }

      // LIMITE
      $offset= ((int)$request->pagina) * 10;

      $doctores= Doctor::
        whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . " " . $query5 . " " . $query6 . " " . $query7 . " " . $query8 . " " . $query9 . " " . $query10))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($doctores, 200);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function cmbListado()
    {
        $doctores = Doctor::orderBy('nombres','ASC')->get();
        return response()->json($doctores, 200);
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

          $verificarEmail= Doctor::where('email','=',$request->email)->count();

          if ($verificarEmail >= 1) {
            return response()->json("El email ya se encuantra registrado", 409);
          }else{

            $doctor= new Doctor($request->all());
            $doctor->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $doctor->created_by= $user->id;
            $doctor->save();

            \DB::commit();
            return response()->json('Registro ok', 201);

          }


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

          $verificarEmail= Doctor::where('email','=',$request->email)->where('id','!=',$id)->count();

          if ($verificarEmail >= 1) {
            return response()->json("El email ya se encuantra registrado", 409);
          }else{

            $doctor= Doctor::FindOrFail($id);
            $doctor->matricula= $request->matricula;
            $doctor->nombres= $request->nombres;
            $doctor->apellidos= $request->apellidos;
            $doctor->domicilio= $request->domicilio;
            $doctor->n_departamento= $request->departamento;
            $doctor->telefono= $request->telefono;
            $doctor->celular= $request->celular;
            $doctor->email= $request->email;
            $doctor->observaciones= $request->observaciones;
            $doctor->save();

            $doctores= Doctor::orderBy('nombres','ASC')->where('id','=',$id)->get();

            \DB::commit();
            return response()->json($doctores);

          }

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
        //
    }
}
