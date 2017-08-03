<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePreciosXParticularesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('precios_x_particulares', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('id_particular')->unsigned();
          $table->integer('id_prestacion')->unsigned();
          $table->integer('precio');
          $table->datetime('created_at');
          $table->integer('created_by')->unsigned();

          $table->foreign('id_particular')->references('id')->on('particulares')->onDelete('cascade');
          $table->foreign('id_prestacion')->references('id')->on('prestaciones')->onDelete('cascade');
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
        Schema::dropIfExists('precios_x_particulares');
    }
}
