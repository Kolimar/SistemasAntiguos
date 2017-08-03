<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServiciosTareasTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_tareas_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titulo', 50);
            $table->text('descripcion');
            $table->boolean('es_critica');
            $table->boolean('ultimo_milestone');
            $table->integer('dias_sugeridos');
            $table->boolean('asigna_pm_automatico');
            $table->integer('id_tipo_tarea')->unsigned();
            $table->integer('id_servicio')->unsigned();
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_tipo_tarea')->references('id')->on('tipos_tareas');
            $table->foreign('id_servicio')->references('id')->on('servicios');
            $table->foreign('created_by')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('servicios_tareas_templates');
    }
}
