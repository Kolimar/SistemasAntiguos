<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmailsContactosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('emails_contactos', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_contacto')->unsigned();
          $table->string('email');
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_contacto')->references('id')->on('contactos')->onDelete('cascade');
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
        Schema::dropIfExists('emails_contactos');
    }
}
