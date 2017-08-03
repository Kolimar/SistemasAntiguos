<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
          $table->increments('id');
          $table->datetime('fecha_hora');
          $table->integer('id_creador')->unsigned();
          $table->integer('id_cliente')->unsigned();
          $table->integer('id_motivo')->unsigned();
          $table->text('descripcion');
          $table->datetime('created_at');

          $table->foreign('id_creador')->references('id')->on('users')->onDelete('cascade');
          $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
          $table->foreign('id_motivo')->references('id')->on('motivos_logs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('logs');
    }
}
