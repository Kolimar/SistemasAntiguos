<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBriefsCanalesAdquisicionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('briefs_canales_adquisicion', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_brief')->unsigned()->nullable();
          $table->integer('id_canal_adquisicion')->unsigned()->nullable();
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_brief')->references('id')->on('briefs')->onDelete('cascade');
          $table->foreign('id_canal_adquisicion')->references('id')->on('canales_adquisicion')->onDelete('cascade');
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
        Schema::dropIfExists('briefs_canales_adquisicion');
    }
}
