<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubtareasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subtareas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titulo',50);
            $table->text('descripcion')->nullable();
            $table->boolean('completa');
            $table->integer('id_tarea')->unsigned();
            $table->integer('created_by')->unsigned()->nullable();
            $table->datetime('created_at')->nullable();

            $table->foreign('id_tarea')->references('id')->on('tareas')->onDelete('cascade');
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
        Schema::dropIfExists('subtareas');
    }
}
