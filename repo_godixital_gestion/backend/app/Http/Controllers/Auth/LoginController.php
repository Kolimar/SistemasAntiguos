<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
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
        $this->middleware('guest', ['except' => 'logout']);
    }

    public function authenticate(Request $request)
    {

        $credentials = $request->only('email_laboral', 'password');

        try {

            if (! $token = JWTAuth::attempt($credentials)) {

                return response()->json('Correo electrónico o contraseña incorrecta', 400);

            }else{

                $user= JWTAuth::toUser($token);

                if ($user->habilitado == true) {
                    return response()->json(compact('user', 'token'), 200);
                }else{
                    return response()->json('El usuario está deshabilitado', 404);
                }

            }

        } catch (JWTException $e) {

            return response()->json('Algo salió mal, intente más tarde', 500);

        }

    }

    // INVALIDAR TOKEN EN LOGOUT
    public function logout(Request $request)
    {
        JWTAuth::invalidate($request->token);
        return response()->json('ok', 200);
    }

    // INVALIDAR TOKEN EN LOGOUT WEB DESPUES DE CAMBIAR CONTRASEÑA
    public function logoutWeb(Request $request)
    {
      JWTAuth::invalidate($request->token);
      return view('password.index');
    }

}
