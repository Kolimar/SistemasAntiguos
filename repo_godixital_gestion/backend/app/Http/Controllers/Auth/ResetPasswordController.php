<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\ResetsPasswords;
use App\Http\Requests\ChangePasswordRequest;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Hash;
use App\User;

class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;
    public $token;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    // VISTA PARA CAMBIO DE CONTRASEÑA
    public function getChangePassword(Request $request)
    {

        try {

            JWTAuth::parseToken()->authenticate();
            return view('password.reset')->with('token',$request->token);

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

    }

    // POST PARA CAMBIAR CONTRASEÑA
    public function postChangePassword(ChangePasswordRequest $request)
    {

        if ($request->new_password != $request->password_confirmation) {

          flash('<strong>Las contraseñas no coinciden, verifique</strong>')->error();
          return redirect('password/reset/'.'?token='.$request->token);

        }else{

          $user= JWTAuth::parseToken()->authenticate();
          User::where('email_laboral','=',$user->email_laboral)
              ->update(['password' => bcrypt($request->new_password)]);

          return redirect('logout'.'?token='.$request->token);

        }

    }
}
