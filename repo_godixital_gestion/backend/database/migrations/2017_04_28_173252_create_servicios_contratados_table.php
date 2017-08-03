<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServiciosContratadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_contratados', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('cantidad_mensual')->nullable();
          $table->date('fecha_comienzo')->nullable();
          $table->integer('id_servicio')->nullable()->unsigned();
          $table->integer('id_brief')->nullable()->unsigned();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_servicio')->references('id')->on('servicios')->onDelete('cascade');
          $table->foreign('id_brief')->references('id')->on('briefs')->onDelete('cascade');
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
        Schema::dropIfExists('servicios_contratados');
    }
}
