<?php

namespace App;

//use App\Perfil;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use App\Transformers\UserTransformer;

class User extends Authenticatable
{

    use Notifiable, HasApiTokens, SoftDeletes;
    const ES_ADMIN = 'true';
    const NO_ES_ADMIN = 'false';

    const USUARIO_VERIFICADO = '1';
    const USUARIO_NO_VERIFICADO = '0';

    public $transformer = UserTransformer::class;

    protected $table = 'users';
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'verified',
        'verification_token',
        'admin',
        'empresa',
        'avatar',
        'password',
    ];

    public function setNameAttribute($valor){

        $this->attributes['name'] = strtolower($valor);
    }
    public function getNameAttribute($valor){

        return ucwords($valor);
    }

    public function setLastNameAttribute($valor){

        $this->attributes['last_name'] = strtolower($valor);
    }
    public function getLastNameAttribute($valor){

        return ucwords($valor);
    }

    public function setEmailAttribute($valor){

        $this->attributes['email'] = strtolower($valor);
    }

    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    public function esAdmin()
    {

        return $this->admin == User::ES_ADMIN;
    }

    public function esVerificado()
    {
        return $this->verified == User::USUARIO_VERIFICADO;

    }

    public static function generarVerificationToken()
    {

        return str_random(40);
    }
/*
    public function perfil(){
        return $this->belongsTo(Perfil::class);
    }
*/
}
