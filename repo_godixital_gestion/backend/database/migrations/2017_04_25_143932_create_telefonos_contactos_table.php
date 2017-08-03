<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTelefonosContactosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('telefonos_contactos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_contacto')->unsigned();
            $table->string('telefono');
            $table->integer('id_tipo_telefono')->unsigned();
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_contacto')->references('id')->on('contactos')->onDelete('cascade');
            $table->foreign('id_tipo_telefono')->references('id')->on('tipos_telefonos')->onDelete('cascade');
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
        Schema::dropIfExists('telefonos_contactos');
    }
}
