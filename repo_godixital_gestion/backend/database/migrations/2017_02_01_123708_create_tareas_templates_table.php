<?php

use Illuminate\Support\Facades\Schema;

use Illuminate\Database\Schema\Blueprint;

use Illuminate\Database\Migrations\Migration;

class CreateTareasTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tareas_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titulo', 50);
            $table->text('descripcion');
            $table->boolean('es_critica');
            $table->boolean('ultimo_milestone');
            $table->integer('dias_sugeridos');
            $table->boolean('asigna_pm_automatico');
            $table->integer('id_tipo_tarea')->unsigned();
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_tipo_tarea')->references('id')->on('tipos_tareas');
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
        Schema::dropIfExists('tareas_templates');
    }
}
