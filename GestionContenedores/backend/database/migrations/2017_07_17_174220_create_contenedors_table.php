<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContenedorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contenedors', function (Blueprint $table) {
            $table->increments('id');
            $table->string('codigo');
            $table->double('size');
            $table->string('tipo');
            $table->string('estado');
            $table->string('bloqueado');
            $table->dateTime('fecha_ultimo_movimiento')->nullable();
            $table->integer('deposito_id')->nullable();
            
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
        Schema::dropIfExists('contenedors');
    }
}
