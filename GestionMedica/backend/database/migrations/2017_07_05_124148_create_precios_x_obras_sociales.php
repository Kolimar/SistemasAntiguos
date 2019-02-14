<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePreciosXObrasSociales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('precios_x_obras_sociales', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_obra_social')->unsigned();
            $table->integer('id_prestacion')->unsigned();
            $table->integer('precio');
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_obra_social')->references('id')->on('obras_sociales')->onDelete('cascade');
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
        Schema::dropIfExists('precios_x_obras_sociales');
    }
}
