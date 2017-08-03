<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDoctoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctores', function (Blueprint $table) {
          $table->increments('id');
          $table->string('matricula');
          $table->string('nombres');
          $table->string('apellidos');
          $table->string('especialidad');
          $table->string('domicilio');
          $table->string('n_departamento')->nullable();
          $table->string('telefono');
          $table->string('celular');
          $table->string('email')->unique();
          $table->text('observaciones');
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('doctores');
    }
}
