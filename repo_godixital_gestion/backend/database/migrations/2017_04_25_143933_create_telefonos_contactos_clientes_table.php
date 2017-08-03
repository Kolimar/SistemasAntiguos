<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTelefonosContactosClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('telefonos_contactos_clientes', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_contacto_cliente')->unsigned();
          $table->string('telefono');
          $table->integer('id_tipo_telefono')->unsigned();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_contacto_cliente')->references('id')->on('contactos_clientes')->onDelete('cascade');
          $table->foreign('id_tipo_telefono')->references('id')->on('tipos_telefonos')->onDelete('cascade');
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
        Schema::dropIfExists('telefonos_contactos_clientes');
    }
}
