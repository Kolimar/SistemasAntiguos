<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientesContactosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes_contactos', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_cliente')->unsigned();
          $table->integer('id_contacto_cliente')->unsigned();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
          $table->foreign('id_contacto_cliente')->references('id')->on('contactos_clientes')->onDelete('cascade');
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
        Schema::dropIfExists('clientes_contactos');
    }
}
