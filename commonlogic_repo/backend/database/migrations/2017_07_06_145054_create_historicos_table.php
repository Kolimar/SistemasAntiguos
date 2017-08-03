<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHistoricosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('historicos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('variable_id')->unsigned();
            $table->dateTime('fecha_ultima_medicion')->nullable();
            $table->double('ultima_medicion')->nullable();
            $table->integer('cantidad_mediciones')->nullable();
            $table->double('suma_mediciones')->nullable();
            $table->text('json')->nullable();
            $table->timestamps();
            
            $table->foreign('variable_id')->references('id')->on('variables');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('historicos');
    }
}
