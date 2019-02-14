<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContactosClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('contactos_clientes', function (Blueprint $table) {
          $table->increments('id');
          $table->string('nombre');
          $table->string('apellido');
          $table->boolean('es_principal');
          $table->boolean('religion_judia');
          $table->text('medio_contacto');
          $table->text('comentarios');
          $table->boolean('eliminado');
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
        Schema::dropIfExists('contactos_clientes');
    }
}
