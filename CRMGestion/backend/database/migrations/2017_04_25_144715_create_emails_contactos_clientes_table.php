<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmailsContactosClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('emails_contactos_clientes', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('id_contacto_cliente')->unsigned();
        $table->string('email');
        $table->datetime('created_at');
        $table->integer('created_by')->unsigned();

        $table->foreign('id_contacto_cliente')->references('id')->on('contactos_clientes')->onDelete('cascade');
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
        Schema::dropIfExists('emails_contactos_clientes');
    }
}
