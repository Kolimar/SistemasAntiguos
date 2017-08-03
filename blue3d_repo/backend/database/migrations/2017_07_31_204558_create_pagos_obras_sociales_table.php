<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagosObrasSocialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagos_obras_sociales', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_obra_social')->unsigned();
          $table->string('pago');
          $table->dateTime('fecha');
          $table->integer('id_estudio')->unsigned();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_estudio')->references('id')->on('estudios')->onDelete('cascade');
          $table->foreign('id_obra_social')->references('id')->on('obras_sociales')->onDelete('cascade');
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
        Schema::dropIfExists('pagos_obras_sociales');
    }
}
