<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEstudiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estudios', function (Blueprint $table) {
            $table->increments('id');
            $table->date('fecha');
            $table->time('hora');
            $table->integer('id_paciente')->unsigned();
            $table->integer('id_doctor')->unsigned();
            $table->integer('id_prestacion')->unsigned();
            $table->text('observaciones');
            $table->string('n_factura');
            $table->string('precio');
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_paciente')->references('id')->on('pacientes')->onDelete('cascade');
            $table->foreign('id_doctor')->references('id')->on('doctores')->onDelete('cascade');
            $table->foreign('id_prestacion')->references('id')->on('prestaciones')->onDelete('cascade');
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
        Schema::dropIfExists('estudios');
    }
}
