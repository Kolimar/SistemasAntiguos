<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $this->call(PuestosTableSeeder::class);
      $this->call(AbmsTableSeeder::class);
    	$this->call(TareasTemplatesTableSeeder::class);
      $this->call(ServiciosTableSeeder::class);

    }
}
