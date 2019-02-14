<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBriefsFormasPagosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('briefs_formas_pagos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_brief')->nullable()->unsigned();
            $table->integer('id_forma_pago')->unsigned();
            $table->datetime('created_at');
            $table->integer('created_by')->unsigned();

            $table->foreign('id_brief')->references('id')->on('briefs')->onDelete('cascade');
            $table->foreign('id_forma_pago')->references('id')->on('formas_pagos')->onDelete('cascade');
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
        Schema::dropIfExists('briefs_formas_pagos');
    }
}
