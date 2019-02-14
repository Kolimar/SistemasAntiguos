<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagosExtrasOsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagos_extras_os', function (Blueprint $table) {
          $table->increments('id');
          $table->string('pago');
          $table->dateTime('fecha');
          $table->integer('id_pago_os')->unsigned();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_pago_os')->references('id')->on('pagos_obras_sociales')->onDelete('cascade');
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
        Schema::dropIfExists('pagos_extras_os');
    }
}
