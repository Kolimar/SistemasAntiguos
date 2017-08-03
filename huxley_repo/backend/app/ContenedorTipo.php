<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\ContenedorSize;

class ContenedorTipo extends Model
{
    protected $fillable = [
       'tipo',
       'size_id',
    ];

    public function ContenedorSize(){
        return $this->belongsTo(ContenedorSize::class);
    }
}
