<?php

use App\variable;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('variables', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('status')->default(variable::NO_ACTIVA);
            $table->string('code');
            $table->string('unidad')->nullable();
            $table->string('nombre')->nullable();
            $table->integer('dispositivo_id')->unsigned();
            $table->double('maximo');
            $table->double('minimo');
            $table->double('rango_minimo');
            $table->double('rango_maximo');
            $table->dateTime('fecha_ultima_medicion')->nullable();
            $table->double('ultima_medicion')->nullable();
            $table->integer('cantidad_mediciones')->nullable();
            $table->double('suma_mediciones')->nullable();
            $table->text('json')->nullable();
            $table->timestamps();

            $table->foreign('dispositivo_id')->references('id')->on('dispositivos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('variables');
    }
}
