<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMovimientosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movimientos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('perfil_cliente_id')->unsigned();
            
            $table->dateTime('fecha_movimiento');
            $table->string('tipo_movimiento');
        
            $table->string('contenedor_codigo');
            $table->integer('contenedor_size');
            $table->string('contenedor_tipo');
            $table->string('contenedor_estado');
        
            $table->string('buque_salida')->nullable();
            $table->string('terminal_destino')->nullable();
        
            $table->string('cliente_direccion')->nullable();
            $table->string('cliente_razon_social')->nullable();
            $table->string('deposito')->nullable();
            $table->string('booking_codigo')->nullable();

            $table->string('transportista_nombre');
            $table->string('transportista_patente');
            $table->string('transportista_documento');
            $table->string('transportista_patente_semi');
            $table->string('transportista_empresa');

            $table->string('observaciones');

            $table->foreign('perfil_cliente_id')->references('id')->on('users');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('movimientos');
    }
}
