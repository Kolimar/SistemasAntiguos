<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class LogBookings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logBooking', function (Blueprint $table) {
           $table->increments('id');
            $table->string('accion');
            $table->string('descripcion');
            $table->dateTime('fecha');
            $table->integer('usuario')->unsigned();
            $table->integer('contenedor')->unsigned();
             $table->integer('booking')->unsigned();



            $table->foreign('booking')->references('id')->on('bookings');
            $table->foreign('usuario')->references('id')->on('users');
            $table->foreign('contenedor')->references('id')->on('contenedors');
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
        Schema::dropIfExists('logBooking');
    }
}
