<?php

namespace App\Http\Controllers\User;

use App\User;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class UserController extends ApiController
{



    public function reqPass(Request $request)
    {
        $usuario = User::where('email','=',$request->requestEmail)->firstOrFail();
        $tokenReset = \App\User::generarVerificationToken();
        DB::table('password_resets')->insert(
    ['email' => $usuario->email, 'token' => bcrypt($tokenReset), 'created_at'=> Carbon::now('America/Argentina/Buenos_Aires')]
        );

        Mail::to($usuario->email)->send(new \App\Mail\resetPassword($usuario,$tokenReset));
        


        return response()->json('Se ha enviado el correo',200);


    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {   
        $currentUser = $request->user();

        $this->authorize('adminUser', $currentUser);
        
        //inicializo en 0 (false) cada instancia de la consulta que sirve para realizar los querys
        $consulta = [];
        $consulta['nombre']=0;
        $consulta['apellido']=0;
        $consulta['correo']=0;
        $consulta['nombre_empresa']=0;
        $consulta['habilitado']='9';
        
        //los asigno
        foreach ($request->query() as $query => $value) {
            $consulta[$query] = $value;
        }
        //evaluo "cuando la posicion del array no es false", hago la consulta
        // IMPORTANTE: los Querys retornan colecciones laravel, las consultas raw devuelven array.
        // segun la documentacion de Laravel NO es conveniente usar raw por las inyecciones SQL y en este caso particular un array 
        // rompe el responser que esta esperando una coleccion.
        $usuarios = User::where('admin','=','false')
                        ->when($consulta['nombre'], function ($query) use ($consulta) {
                                return $query->where("name", "LIKE", '%'.$consulta['nombre'].'%');
                            })
                        ->when($consulta['apellido'], function ($query) use ($consulta) {
                                return $query->where("last_name", "LIKE", '%'.$consulta['apellido'].'%');
                            })
                        ->when($consulta['correo'], function ($query) use ($consulta) {
                                return $query->where("email", "LIKE", '%'.$consulta['correo'].'%');
                            })
                        ->when($consulta['nombre_empresa'], function ($query) use ($consulta) {
                                return $query->where("empresa", "LIKE", '%'.$consulta['nombre_empresa'].'%');
                            })
                        ->when($consulta['habilitado']!='9', function ($query) use ($consulta) {
                                return $query->where("verified",$consulta['habilitado']);
                            })
                        ->get();
        //si no se cumple ninguna condicion when entonces se retorna el modelo User::all();

        return $this->showAll($usuarios);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $currentUser =  request()->user();
        if (request()->user()->admin == 'true') {
            return $this->showOne($user);

        }elseif ($currentUser->id === $user->id) {
           return $this->showOne($user);

        }
        else{$auth = false;}
        
        return $this->showOne($currentUser);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, User $user)
    {
        $currentUser = $request->user();
        $this->authorize('adminUser', $currentUser);

        $reglas = [
            'name'=> 'required',
            'last_name'=> 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed'
        ];
        
        $this->validate($request, $reglas);

        $campos = $request ->all();
        $campos['password'] = bcrypt($request->password);
        $campos['avatar'] = 'sin_avatar.png';
        /*$campos['verified'] = User::USUARIO_NO_VERIFICADO;*/
        $campos['verification_token'] = User::generarVerificationToken();
        //$campos['admin'] = $request->admin;
        $campos['admin'] = 'false'; //no deja crear administradores


        $usuario = User::create($campos);

        return $this->showOne($usuario);


    }

    public function update(Request $request, User $user)
    {
        $currentUser = $request->user();
        $this->authorize('adminUser', $currentUser);
        $reglas = [
            'email' => 'email|unique:users,email,' . $user->id,
            'admin' => 'in:' . User::ES_ADMIN . ',' . User::NO_ES_ADMIN,

        ];
        $this -> validate($request, $reglas);

        if($request->has('name')){
            $user->name = $request ->name;
        }
        if($request->has('last_name')){
            $user->last_name = $request ->last_name;
        }
        if($request->has('empresa')){
            $user->empresa = $request ->empresa;
        }
        if($request->has('email') && $user->email!= $request->email) {
                $user->verified = User::USUARIO_NO_VERIFICADO;
                $user->verification_token = User::generarVerificationToken();
                $user->email = $request->email;
        }
        if($request->has('password')){
            $user->password = bcrypt($request ->password);
        }
        if($request->has('verified')){
            $user->verified = $request->verified;
        }
        if($request->has('admin')){
           

            $user->admin = $request->admin;
        }

        if (!$user->isDirty()){
            return $this->errorResponse('Se debe ingresar datos diferentes al original al actualizar', 201);
        }

        $user->save();

        return $this->showOne($user);
   

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $currentUser = request()->user();
        $this->authorize('habilitado', $currentUser);
        $this->authorize('adminUser', $currentUser);
        $user->delete();

        return $this->showOne($user);
    }

    public function verify($token)
    {
        
        $user = User::where('verification_token', $token)->firstOrFail();

        $user->verified = User::USUARIO_VERIFICADO;
        $user->verification_token = User::generarVerificationToken();

        $user->save();

        return $this->showMessage('La cuenta ha sido verificada, ya puede ser utilizada');
    }
}
