<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBriefsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('briefs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 50)->nullable();
            $table->integer('pm_asignado')->unsigned()->nullable();
            $table->date('fecha_comienzo')->nullable();
            $table->text('propuesta_original')->nullable();
            $table->integer('monto_abono')->nullable();
            $table->integer('presupuesto_invertir_publicidad')->nullable();
            $table->text('distribucion_presupuesto_publicidad')->nullable();
            $table->integer('id_metodo_facturacion')->unsigned()->nullable();
            $table->string('sitio_web', 80)->nullable();
            $table->string('fan_page', 80)->nullable();
            $table->string('rubro', 80)->nullable();
            $table->text('modelo_negocio')->nullable();
            $table->string('calidad_modelo_negocio', 20)->nullable();
            $table->text('acciones_realiza_internet')->nullable();
            $table->string('upselibilidad', 20)->nullable();
            $table->text('comentario_upselibilidad')->nullable();
            $table->text('comentario_adquisicion')->nullable();
            $table->string('educabilidad', 20)->nullable();
            $table->text('comentario_educabilidad')->nullable();
            $table->string('conocimiento_internet', 20)->nullable();
            $table->string('capacidad_financiera_cliente', 20)->nullable();
            $table->string('nivel_esperado_hinchapelotes', 20)->nullable();
            $table->integer('puntaje_cliente')->nullable();
            $table->text('competidores_cliente')->nullable();
            $table->text('personalidad')->nullable();
            $table->text('porque_llego')->nullable();
            $table->text('servicio_buscado')->nullable();
            $table->string('estado');
            $table->string('eliminado')->nullable();
            $table->integer('id_cliente')->nullable()->unsigned();
            $table->integer('created_by')->unsigned();
            $table->datetime('created_at');

            $table->foreign('pm_asignado')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('id_metodo_facturacion')->references('id')->on('metodos_facturacion')->onDelete('cascade');
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
        Schema::dropIfExists('briefs');
    }
}
