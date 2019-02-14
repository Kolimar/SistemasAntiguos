<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {
          $table->increments('id');
          $table->string('dni');
          $table->date('fecha_nacimiento');
          $table->string('nombres');
          $table->string('apellidos');
          $table->string('n_afiliado')->nullable();
          $table->string('domicilio');
          $table->string('n_departamento')->nullable();
          $table->string('barrio');
          $table->string('telefono');
          $table->string('celular');
          $table->string('plan_os')->nullable();
          $table->string('email')->unique();
          $table->text('observaciones');
          $table->datetime('created_at');
          $table->integer('id_obra_social')->nullable()->unsigned();
          $table->integer('id_particular')->nullable()->unsigned();
          $table->integer('created_by')->unsigned();

          $table->foreign('id_obra_social')->references('id')->on('obras_sociales')->onDelete('cascade');
          $table->foreign('id_particular')->references('id')->on('particulares')->onDelete('cascade');
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
        Schema::dropIfExists('pacientes');
    }
}
