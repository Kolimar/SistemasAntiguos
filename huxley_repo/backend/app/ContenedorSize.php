<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\ContenedorTipo;

class ContenedorSize extends Model
{
    protected $fillable = [
        'size',
       
    ];

    public function ContenedorTipo(){
        return $this->hasMany(ContenedorTipo::class);
    }
}
