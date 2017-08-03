<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
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
        $this->middleware('guest')->except('logout');
    }

    public function authenticate(Request $request)
    {

        $credentials = $request->only('email', 'password');
        try {

            if (! $token = JWTAuth::attempt($credentials)) {

              return response()->json('Correo electrónico o contraseña incorrecta', 401);

            }else{

              $user= JWTAuth::toUser($token);
              return response()->json(compact('user', 'token'), 200);

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

}
