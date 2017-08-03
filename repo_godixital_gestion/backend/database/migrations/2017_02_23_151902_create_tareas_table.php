<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTareasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_tarea_template')->unsigned()->nullable();
            $table->integer('id_servicio_tarea_template')->unsigned()->nullable();
            $table->integer('id_tipo_tarea')->unsigned()->nullable();
            $table->integer('id_depende_de')->unsigned()->nullable();
            $table->string('workflow_name')->nullable();
            $table->string('titulo', 50)->nullable();
            $table->text('descripcion')->nullable();
            $table->date('fecha_limite')->nullable();
            $table->date('fecha_ejecucion')->nullable();
            $table->boolean('urgente')->nullable();
            $table->boolean('falta_info')->nullable();
            $table->string('prioridad')->nullable();
            $table->integer('id_cliente')->unsigned()->nullable();
            $table->integer('id_servicio')->unsigned()->nullable();
            $table->integer('id_asignado')->unsigned()->nullable();
            $table->integer('created_by')->unsigned()->nullable();
            $table->string('estado')->nullable();
            $table->integer('cantidad_subtareas')->nullable();
            $table->integer('cantidad_subtareas_completadas')->nullable();
            $table->boolean('es_critica')->nullable();
            $table->boolean('ultimo_milestone')->nullable();
            $table->boolean('visible')->nullable();
            $table->datetime('created_at');

            $table->foreign('id_tarea_template')->references('id')->on('tareas_templates')->onDelete('cascade');
            $table->foreign('id_servicio_tarea_template')->references('id')->on('servicios_tareas_templates')->onDelete('cascade');
            $table->foreign('id_tipo_tarea')->references('id')->on('tipos_tareas')->onDelete('cascade');
            $table->foreign('id_depende_de')->references('id')->on('tareas')->onDelete('cascade');
            $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('id_servicio')->references('id')->on('servicios')->onDelete('cascade');
            $table->foreign('id_asignado')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('tareas');
    }
}
