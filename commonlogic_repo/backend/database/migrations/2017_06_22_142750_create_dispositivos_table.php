<?php
use App\dispositivo;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDispositivosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dispositivos', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('encendido')->default(dispositivo::ENCENDIDO);
            $table->boolean('encendido_real')->default(dispositivo::ENCENDIDO);
            $table->string('nombre');
            $table->string('nro_serie');
            $table->string('ubicacion');
            $table->integer('perfil_cliente_id')->unsigned();
            $table->dateTime('fecha_ultima_medicion')->nullable();
            $table->timestamps();

            $table->foreign('perfil_cliente_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dispositivos');
    }
}
