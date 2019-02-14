<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBriefsPrimeraReunionClienteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('briefs_primera_reunion_cliente', function (Blueprint $table) {
          $table->increments('id');

          // INICIAL
          $table->boolean('contrato_firmado')->nullable();
          $table->boolean('presentarse')->nullable();
          $table->boolean('explicacion_agenda')->nullable();
          $table->boolean('explicacion_interlocutor')->nullable();

          // MODELO DE NEGOCIO
          $table->text('modelo_negocio')->nullable();
          $table->text('expectativas_performance')->nullable();
          $table->text('relevo_ventas')->nullable();

          // ADWORDS
          $table->text('estrategia_general')->nullable();
          $table->text('segmentacion_geografica')->nullable();
          $table->text('presupuesto_adwords')->nullable();
          $table->text('acceso_campana')->nullable();
          $table->boolean('explicacion_formas_pago')->nullable();
          $table->text('datos_facturacion')->nullable();
          $table->text('como_buscaria_cliente')->nullable();
          $table->boolean('aclaratoria')->nullable();
          $table->boolean('explicacion_mejora')->nullable();

          // LANDING PAGES
          $table->boolean('recordar_objetivo')->nullable();
          $table->boolean('diferencia_landing')->nullable();
          $table->boolean('mostrar_ejemplos_landings')->nullable();
          $table->text('pedir_datos_landing')->nullable();
          $table->text('estrategia_landing')->nullable();
          $table->text('secciones_landing')->nullable();
          $table->boolean('pq_hosteamos')->nullable();
          $table->string('donde_hostear')->nullable();

          // REMARKETING
          $table->boolean('explicacion_remarketing')->nullable();
          $table->text('comentarios_remarketing')->nullable();

          // FACEBOOK ADS
          $table->text('estrategia_facebook_ads')->nullable();
          $table->text('datos_fan_page_ads')->nullable();
          $table->text('datos_tdc')->nullable();
          $table->text('presupuesto_facebook_ads')->nullable();

          // FACEBOOK POSTEOS
          $table->text('estrategia_facebook_posteos')->nullable();
          $table->text('datos_fan_page_posteos')->nullable();

          // MAILING
          $table->text('estrategia_mailing')->nullable();
          $table->text('info_primeros_mailings')->nullable();
          $table->boolean('pedir_bd')->nullable();
          $table->boolean('explicacion_mailing_no_ventas')->nullable();

          // DATOS DE ACCESO
          $table->text('datos_sitio')->nullable();

          // ADMINISTRATIVO
          $table->boolean('depende_administracion')->nullable();
          $table->boolean('recordar_pago')->nullable();

          // CHAT
          $table->boolean('explicacion_chat')->nullable();

          // FINAL
          $table->boolean('explicacion_gestion_ventas')->nullable();
          $table->boolean('reuniones')->nullable();
          $table->boolean('forma_trabajo')->nullable();
          $table->boolean('plan_accion')->nullable();
          $table->boolean('expectativas_plan_accion')->nullable();
          $table->boolean('reportes')->nullable();
          $table->boolean('recordar_pago_adelantado')->nullable();
          $table->boolean('formas_aprobacion')->nullable();
          $table->boolean('explicacion_cantidad_landings_campanas')->nullable();
          $table->boolean('explicacion_responder_consultas')->nullable();
          $table->text('puntos_conflictos')->nullable();

          // OTROS
          $table->string('estado')->nullable();
          $table->integer('created_by')->nullable()->unsigned();
          $table->integer('id_cliente')->nullable()->unsigned();

          $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
          $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('briefs_primera_reunion_cliente');
    }
}
