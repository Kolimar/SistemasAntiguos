<?php

namespace App\Http\Controllers\Auth;

use App\User;

use Validator;

use App\Http\Controllers\Controller;

use Illuminate\Foundation\Auth\RegistersUsers;

use Illuminate\Http\Request;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }


    public function register(Request $request){

        try {
            \DB::beginTransaction();

            $user = JWTAuth::parseToken()->authenticate();
            $email_laboral= User::where('email_laboral','=',$request->email_laboral)->count();
            $email_personal= User::where('email_personal','=',$request->email_personal)->count();

            if ($email_laboral >= 1) {

                return response()->json('El correo electrónico laboral ya se encuentra registrado', 409);

            }elseif($email_personal >= 1){

                return response()->json('El correo electrónico personal ya se encuentra registrado', 409);

            }else{

                $result= new User($request->all());
                $result->password= bcrypt($request->password);
                $result->created_by= $user->id;
                $result->habilitado= 1;
                $result->created_at= Carbon::now();
                $result->save();
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
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }
}
