<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visitas', function (Blueprint $table) {
            $table->increments('id');
            $table->date('fecha');
            $table->text('descripcion');
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();
            $table->integer('id_doctor')->unsigned();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_doctor')->references('id')->on('doctores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visitas');
    }
}
