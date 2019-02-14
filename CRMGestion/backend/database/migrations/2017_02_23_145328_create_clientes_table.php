<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
          $table->increments('id');

          // PRINCIPAL
          $table->string('nombre', 50)->nullable();
          $table->integer('pm_asignado')->unsigned()->nullable();
          $table->date('fecha_comienzo')->nullable();
          $table->integer('monto_abono')->nullable();
          $table->integer('scoring')->nullable();

          // ADMINISTRACION
          $table->integer('id_metodo_facturacion')->unsigned()->nullable();
          $table->boolean('contrato_firmado')->nullable();
          $table->string('quien_factura', 20)->nullable();
          $table->integer('id_forma_pago')->unsigned()->nullable();
          $table->string('condicion_iva', 20)->nullable();
          $table->bigInteger('cuit')->nullable();
          $table->string('asunto_factura', 50)->nullable();
          $table->string('nombre_fiscal', 50)->nullable();
          $table->string('direccion_retiro_pago', 80)->nullable();

          // VENTAS
          $table->text('propuesta_original')->nullable();
          $table->text('comentario_adquisicion')->nullable();
          $table->integer('puntaje_cliente')->nullable();

          // CAMPAÑAS
          $table->integer('presupuesto_invertir_publicidad')->nullable();
          $table->text('distribucion_presupuesto_publicidad')->nullable();
          $table->integer('objetivo_mensual')->nullable();

          // DISEÑO
          $table->string('sitio_web', 80)->nullable();
          $table->string('fan_page', 80)->nullable();

          // DETALLE DE LA EMPRESA
          $table->string('rubro', 80)->nullable();
          $table->text('modelo_negocio')->nullable();
          $table->string('calidad_modelo_negocio', 20)->nullable();
          $table->text('acciones_realiza_internet')->nullable();
          $table->string('upselibilidad', 20)->nullable();
          $table->text('comentario_upselibilidad')->nullable();
          $table->string('educabilidad', 20)->nullable();
          $table->text('comentario_educabilidad')->nullable();
          $table->string('conocimiento_internet', 20)->nullable();
          $table->string('capacidad_financiera_cliente', 20)->nullable();
          $table->string('nivel_esperado_hinchapelotes', 20)->nullable();
          $table->text('competidores_cliente')->nullable();
          $table->text('personalidad')->nullable();

          // PMS
          $table->string('etapa', 20)->nullable();
          $table->text('resumen_cliente')->nullable();

          // OTROS
          $table->text('porque_llego')->nullable();
          $table->text('servicio_buscado')->nullable();
          $table->boolean('estado')->nullable();
          $table->integer('created_by')->unsigned();
          $table->datetime('created_at')->nullable();
          $table->date('fecha_primera_reunion')->nullable();
          $table->string('id_adwords')->nullable();
          $table->date('fecha_baja')->nullable();
          $table->string('motivo_baja', 80)->nullable();
          $table->string('url_contrato', 80)->nullable();
          $table->text('comentario_pm')->nullable();

          $table->foreign('pm_asignado')->references('id')->on('users')->onDelete('cascade');
          $table->foreign('id_metodo_facturacion')->references('id')->on('metodos_facturacion')->onDelete('cascade');
          $table->foreign('id_forma_pago')->references('id')->on('formas_pagos')->onDelete('cascade');
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
        Schema::dropIfExists('clientes');
    }
}
