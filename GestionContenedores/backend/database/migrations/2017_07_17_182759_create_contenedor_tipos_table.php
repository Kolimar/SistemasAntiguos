<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContenedorTiposTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contenedor_tipos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo');
            $table->integer('size_id')->unsigned();
            $table->timestamps();

            $table->foreign('size_id')->references('id')->on('contenedor_sizes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contenedor_tipos');
    }
}
