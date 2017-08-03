<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombres');
            $table->string('apellidos');
            $table->integer('id_puesto')->unsigned();
            $table->string('telefono_laboral');
            $table->string('celular_laboral');
            $table->string('email_laboral')->unique();
            $table->string('telefono_personal')->nullable();
            $table->string('celular_personal')->nullable();
            $table->string('email_personal')->unique()->nullable();
            $table->string('password');
            $table->boolean('habilitado');
            $table->dateTime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_puesto')->references('id')->on('puestos')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
