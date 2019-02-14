<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\perfilCliente;

class Movimiento extends Model
{
    const ES_INGRESO = 'INGRESO';
    const ES_EGRESO = 'EGRESO';
    const ES_REMISION = 'REMISION';

    protected $fillable = [
		'fecha_movimiento',
		'tipo_movimiento',
		
		'contenedor_codigo',
		'contenedor_size',
		'contenedor_tipo',
		'contenedor_estado',
		
		'buque_salida',
		'terminal_destino',
		
		'cliente_direccion',
		'cliente_razon_social',
		'deposito',
		'booking_codigo',

		'transportista_nombre',
		'transportista_patente',
		'transportista_documento',
		'transportista_patente_semi',
		'transportista_empresa',

		'observaciones',

		'perfil_cliente_id',
    ];

//Funciones para evaluar el tipo de movimiento, si son retornan true;
    public function esIngreso()
    {
        return $this->tipo_movimiento == Movimiento::ES_INGRESO;
    }

    public function esEgreso()
    {
        return $this->tipo_movimiento == Movimiento::ES_EGRESO;
    }

    public function esRemision()
    {
        return $this->tipo_movimiento == Movimiento::ES_REMISION;
    }

    public function perfilCliente()
    {
    	return $this->belongsTo(perfilCliente::class);
  
    }

}
