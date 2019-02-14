<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIngresosGastosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ingresos_gastos', function (Blueprint $table) {
          $table->increments('id');
          $table->date('fecha');
          $table->text('motivo');
          $table->text('monto');
          $table->text('descripcion');
          $table->text('tipo_caja');
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

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
        Schema::dropIfExists('ingresos_gastos');
    }
}
