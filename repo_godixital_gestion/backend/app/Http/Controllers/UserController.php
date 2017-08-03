<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Puesto;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Hash;
use Mail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        // QUERY PARA NOMBRES
        if ($request->nombres && $request->nombres != " ") {

            $query1= "users.nombres LIKE '%$request->nombres%'";

        }else{

            $query1= "users.nombres LIKE '%$request->nombres%'";

        }

        // QUERY PARA APELLIDOS
        if ($request->apellidos && $request->apellidos != " ") {

            $query2= "AND users.apellidos LIKE '%$request->apellidos%'";

        }else{

            $query2= " ";

        }

        // QUERY PARA PUESTOS
        if ($request->puesto && $request->puesto != " ") {

            $query3= "AND puestos.id LIKE '%$request->puesto%'";

        }else{

            $query3= " ";

        }

        // QUERY PARA TELEFONO LABORAL
        if ($request->telefono_laboral && $request->telefono_laboral != " ") {

            $query4= "AND users.telefono_laboral LIKE '%$request->telefono_laboral%'";

        }else{

            $query4= " ";

        }

        // QUERY PARA CELULAR LABORAL
        if ($request->celular_laboral && $request->celular_laboral != " ") {

            $query5= "AND users.celular_laboral LIKE '%$request->celular_laboral%'";

        }else{

            $query5= " ";

        }

        // QUERY PARA EMAIL LABORAL
        if ($request->email_laboral && $request->email_laboral != " ") {

            $query6= "AND users.email_laboral LIKE '%$request->email_laboral%'";

        }else{

            $query6= " ";

        }

        // QUERY PARA TELEFONO PERSONAL
        if ($request->telefono_personal && $request->telefono_personal != " ") {

            $query7= "AND users.telefono_personal LIKE '%$request->telefono_personal%'";

        }else{

            $query7= " ";

        }

        // QUERY PARA CELULAR PERSONAL
        if ($request->celular_personal && $request->celular_personal != " ") {

            $query8= "AND users.celular_personal LIKE '%$request->celular_personal%'";

        }else{

            $query8= " ";

        }

        // QUERY PARA EMAIL PERSONAL
        if ($request->email_personal && $request->email_personal != " ") {

            $query9= "AND users.email_personal LIKE '%$request->email_personal%'";

        }else{

            $query9= " ";

        }

        // QUERY PARA EMAIL PERSONAL
        if ($request->email_personal && $request->email_personal != " ") {

            $query10= "AND users.email_personal LIKE '%$request->email_personal%'";

        }else{

            $query10= " ";

        }

        // QUERY PARA HABILITADO
        if ($request->habilitado == "0") {

            $habilitado= 0;
            $query11= "AND users.habilitado = $habilitado";


        }elseif ($request->habilitado == "1") {

            $habilitado= 1;
            $query11= "AND users.habilitado = $habilitado";

        }else{

            $query11= " ";
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

        $users= User::
            join('puestos','puestos.id','=','users.id_puesto')
            ->select('users.*','puestos.id as id_puesto','puestos.nombre as nombre_puesto')
            ->whereRaw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . " " . $query5 . " " . $query6 . " " . $query7 . " " . $query8 . " " . $query9 . " " . $query10 . " " . $query11)
            ->orderBy($columna,$ord)
            ->offset($offset)
            ->limit(10)
            ->get();

        return response()->json($users);

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getListado()
    {
        $users= User::orderBy('nombres','ASC')->where('habilitado','=',1)->get();
        return response()->json($users);
    }

    // CAMBIO DE CONTRASEÑA
    public function cambioContrasena(Request $request)
    {

      try {
        \DB::beginTransaction();

        if ($request->confirmar_contrasena != $request->nueva_contrasena) {
          return response()->json('Las contraseñas no coinciden, por favor verifique', 409);
        }else{

          $user= JWTAuth::parseToken()->authenticate();

          if (Hash::check($request->contrasena_actual, $user->password)) {
            User::where('email_laboral','=',$user->email_laboral)
            ->update([
              'password' => bcrypt($request->nueva_contrasena)
            ]);

            \DB::commit();
            return response()->json('ok', 200);
          }else{
            return response()->json('La contraseña actual es incorrecta, verifique', 409);
          }

        }

      } catch (Exception $e) {
        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salio mal', 500);
      }

    }

    // CAMBIO DE CONTRASEÑA
    public function envioEmailRecuperacion(Request $request)
    {

      try {
        \DB::beginTransaction();

        $user= User::where('email_laboral','=',$request->email_laboral)->first();
        if ($user) {

          $token = JWTAuth::fromUser($user);

          $data= array(
              'email_laboral' => $user->email_laboral,
              'fullname' => $user->nombres . " " . $user->apellidos,
              'token' => $token
          );

          Mail::send('emails.change-password', $data, function($msj) use ($data)
          {
              $msj->subject('Cambio de contraseña');
              $msj->to($data['email_laboral']);
          });

          \DB::commit();
          return response()->json('ok', 200);

        }else{
          return response()->json('El email laboral no se encuentra registrado, verifique', 404);
        }

        \DB::commit();
        return response()->json('ok', 200);

      } catch (Exception $e) {
        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salio mal', 500);
      }

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getListadoPuesto()
    {
        $puestos= Puesto::orderBy('nombre','ASC')->get();
        return response()->json($puestos);
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

          $user= JWTAuth::parseToken()->authenticate();

          $email_laboral= User::where('email_laboral','=',$request->email_laboral)->where('id','!=',$id)->count();
          $email_personal= User::where('email_personal','=',$request->email_personal)->where('id','!=',$id)->count();

          if ($email_laboral >= 1) {

              return response()->json('El correo electrónico laboral ya se encuentra registrado', 409);

          }elseif($email_personal >= 1){

              return response()->json('El correo electrónico personal ya se encuentra registrado', 409);

          }else{

              $user= User::FindOrFail($id);
              $user->nombres= $request->nombres;
              $user->apellidos= $request->apellidos;
              $user->id_puesto= $request->id_puesto;
              $user->telefono_laboral= $request->telefono_laboral;
              $user->celular_laboral= $request->celular_laboral;
              $user->email_laboral= $request->email_laboral;
              $user->telefono_personal= $request->telefono_personal;
              $user->celular_personal= $request->celular_personal;
              $user->email_personal= $request->email_personal;
              $user->habilitado= $request->habilitado;
              $user->save();

              $users= User::join('puestos','puestos.id','=','users.id_puesto')->select('users.*','puestos.id as id_puesto','puestos.nombre as nombre_puesto')->where('users.id','=',$id)->get();

              \DB::commit();
              return response()->json($users);

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
