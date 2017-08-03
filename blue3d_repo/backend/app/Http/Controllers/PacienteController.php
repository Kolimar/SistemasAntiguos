<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Paciente;
use App\ObraSocial;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      // QUERY PARA DNI
      if ($request->dni && $request->dni != " ") {

          $query1= "pacientes.dni LIKE '%$request->dni%'";

      }else{

          $query1= "pacientes.dni LIKE '%$request->dni%'";

      }

      // QUERY PARA FECHA NACIMIENTO
      if ($request->fecha_nacimiento && $request->fecha_nacimiento != " ") {

          $query2= "AND pacientes.fecha_nacimiento LIKE '%$request->fecha_nacimiento%'";

      }else{

          $query2= " ";

      }

      // QUERY PARA APELLIDOS
      if ($request->nombres && $request->nombres != " ") {

          $query3= "AND pacientes.nombres LIKE '%$request->nombres%'";

      }else{

          $query3= " ";

      }

      // QUERY PARA APELLIDOS
      if ($request->apellidos && $request->apellidos != " ") {

          $query4= "AND pacientes.apellidos LIKE '%$request->apellidos%'";

      }else{

          $query4= " ";

      }

      // QUERY PARA DOMICILIO
      if ($request->domicilio && $request->domicilio != " ") {

          $query5= "AND pacientes.domicilio LIKE '%$request->domicilio%'";

      }else{

          $query5= " ";

      }

      // QUERY PARA DEPARTAMENTO
      if ($request->departamento && $request->departamento != " ") {

          $query6= "AND pacientes.n_departamento LIKE '%$request->departamento%'";

      }else{

          $query6= " ";

      }

      // QUERY PARA BARRIO
      if ($request->barrio && $request->barrio != " ") {

          $query7= "AND pacientes.barrio LIKE '%$request->barrio%'";

      }else{

          $query7= " ";

      }

      // QUERY PARA TELEFONO
      if ($request->telefono && $request->telefono != " ") {

          $query8= "AND pacientes.telefono LIKE '%$request->telefono%'";

      }else{

          $query8= " ";

      }

      // QUERY PARA CELULAR
      if ($request->celular && $request->celular != " ") {

          $query9= "AND pacientes.celular LIKE '%$request->celular%'";

      }else{

          $query9= " ";

      }

      // QUERY PARA EMAIL
      if ($request->email && $request->email != " ") {

          $query10= "AND pacientes.email LIKE '%$request->email%'";

      }else{

          $query10= " ";

      }

      // QUERY PARA ONSERVACIONES
      if ($request->observaciones && $request->observaciones != " ") {

          $query11= "AND pacientes.observaciones LIKE '%$request->observaciones%'";

      }else{

          $query11= " ";

      }

      // QUERY PARA OBRA SOCIAL
      if ($request->obra_social && $request->obra_social != " ") {

          $query12= "AND pacientes.id_obra_social = $request->obra_social";

      }else{

          $query12= " ";

      }

      // QUERY PARA OBRA SOCIAL
      if ($request->afiliado && $request->afiliado != " ") {

          $query13= "AND pacientes.n_afiliado = $request->afiliado";

      }else{

          $query13= " ";

      }

      // QUERY PARA PLAN OBRA SOCIAL
      if ($request->plan_os && $request->plan_os != " ") {

          $query14= "AND pacientes.plan_os LIKE '%$request->plan_os%'";

      }else{

          $query14= " ";

      }

      // QUERY PARA OBRA SOCIAL
      if ($request->particular && $request->particular != " ") {

          $query15= "AND pacientes.id_particular = $request->particular";

      }else{

          $query15= " ";

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

      $pacientes= Paciente::
        leftjoin('obras_sociales','obras_sociales.id','=','pacientes.id_obra_social')
        ->leftjoin('particulares','particulares.id','=','pacientes.id_particular')
        ->select('pacientes.*','obras_sociales.id as id_obra_social','obras_sociales.nombre as nombre_obra_social','particulares.id as id_particular','particulares.nombre as nombre_particular')
        ->whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . " " . $query5 . " " . $query6 . " " . $query7 . " " . $query8 . " " . $query9 . " " . $query10 . " " . $query11 . " " . $query12 . " " . $query13 . " " . $query14 . " " . $query15))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($pacientes, 200);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function cmbListado()
    {
        $paciente= Paciente::
          with('obraSocial')
          ->with('particular')
          ->orderBy('nombres','DESC')
          ->get();
        return response()->json($paciente, 200);
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

          $verificarEmail= Paciente::where('email','=',$request->email)->count();

          if ($verificarEmail >= 1) {
            return response()->json("El email ya se encuantra registrado", 409);
          }else{

            $dateFechaNacimiento= date_create($request->fecha_nacimiento);
            $fechaNacimiento= date_format($dateFechaNacimiento, 'Y-m-d');

            $paciente= new Paciente($request->all());
            $paciente->fecha_nacimiento= $fechaNacimiento;
            $paciente->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $paciente->created_by= $user->id;
            $paciente->save();

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

          $verificarEmail= Paciente::where('email','=',$request->email)->where('id','!=',$id)->count();

          if ($verificarEmail >= 1) {
            return response()->json("El email ya se encuantra registrado", 409);
          }else{

            $dateFechaNacimiento= date_create($request->fecha_nacimiento);
            $fechaNacimiento= date_format($dateFechaNacimiento, 'Y-m-d');

            if ($request->id_obra_social) {
              $obraSocial= $request->id_obra_social;
            }else{
              $obraSocial= NULL;
            }

            if ($request->id_particular) {
              $particular= $request->id_particular;
            }else{
              $particular= NULL;
            }

            if ($request->plan_os) {
              $planOs= $request->plan_os;
            }else{
              $planOs= NULL;
            }

            $paciente= Paciente::FindOrFail($id);
            $paciente->dni= $request->dni;
            $paciente->fecha_nacimiento= $fechaNacimiento;
            $paciente->nombres= $request->nombres;
            $paciente->apellidos= $request->apellidos;
            $paciente->domicilio= $request->domicilio;
            $paciente->n_departamento= $request->n_departamento;
            $paciente->barrio= $request->barrio;
            $paciente->telefono= $request->telefono;
            $paciente->celular= $request->celular;
            $paciente->email= $request->email;
            $paciente->observaciones= $request->observaciones;
            $paciente->id_obra_social= $obraSocial;
            $paciente->plan_os= $planOs;
            $paciente->n_afiliado= $request->n_afiliado;
            $paciente->id_particular= $particular;
            $paciente->save();

            $pacientes= Paciente::
              leftjoin('obras_sociales','obras_sociales.id','=','pacientes.id_obra_social')
              ->leftjoin('particulares','particulares.id','=','pacientes.id_particular')
              ->select('pacientes.*','obras_sociales.id as id_obra_social','obras_sociales.nombre as nombre_obra_social','particulares.id as id_particular','particulares.nombre as nombre_particular')
              ->where('pacientes.id','=',$id)
              ->get();

            \DB::commit();
            return response()->json($pacientes, 200);

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
