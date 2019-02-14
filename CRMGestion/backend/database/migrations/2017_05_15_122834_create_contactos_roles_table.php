<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContactosRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contactos_roles', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_contacto')->unsigned()->nullable();
          $table->integer('id_rol_contacto')->unsigned()->nullable();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_contacto')->references('id')->on('contactos')->onDelete('cascade');
          $table->foreign('id_rol_contacto')->references('id')->on('roles_contactos')->onDelete('cascade');
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
        Schema::dropIfExists('contactos_roles');
    }
}
