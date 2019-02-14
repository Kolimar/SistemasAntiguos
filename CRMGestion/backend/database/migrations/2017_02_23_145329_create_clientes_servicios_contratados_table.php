<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientesServiciosContratadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes_servicios_contratados', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('cantidad_mensual')->nullable();
          $table->date('fecha_comienzo');
          $table->integer('id_servicio')->nullable()->unsigned();
          $table->integer('id_cliente')->nullable()->unsigned();
          $table->boolean('eliminado')->nullable()->unsigned();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_servicio')->references('id')->on('servicios')->onDelete('cascade');
          $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
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
        Schema::dropIfExists('clientes_servicios_contratados');
    }
}
