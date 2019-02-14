<?php

use Illuminate\Database\Seeder;

use Carbon\Carbon;

class AbmsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      // ROLES DE CONTACTO
      DB::table('roles_contactos')->insert([
          'nombre' => 'Dueño principal',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('roles_contactos')->insert([
          'nombre' => 'Otros socios',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('roles_contactos')->insert([
          'nombre' => 'Contacto directo',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('roles_contactos')->insert([
          'nombre' => 'Administrativo / Cobranzas',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('roles_contactos')->insert([
          'nombre' => 'Diseñador',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('roles_contactos')->insert([
          'nombre' => 'Programador',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // FORMAS DE PAGO
      DB::table('formas_pagos')->insert([
          'nombre' => 'Depósito',
          'descripcion' => 'Descripcion',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('formas_pagos')->insert([
          'nombre' => 'Transferencia',
          'descripcion' => 'Descripcion',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('formas_pagos')->insert([
          'nombre' => 'Cheque',
          'descripcion' => 'Descripcion',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('formas_pagos')->insert([
          'nombre' => 'Efectivo',
          'descripcion' => 'Descripcion',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // TIPOS DE EMPRESA
      DB::table('tipos_empresas')->insert([
          'nombre' => 'Importador/Distribuidor/Mayorista',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_empresas')->insert([
          'nombre' => 'Industrial',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_empresas')->insert([
          'nombre' => 'Servicios',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_empresas')->insert([
          'nombre' => 'Venta minorista',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // TIPOS DE FACTURACION
      DB::table('metodos_facturacion')->insert([
          'nombre' => 'Factura A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('metodos_facturacion')->insert([
          'nombre' => 'Factura C',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('metodos_facturacion')->insert([
          'nombre' => 'Sin Factura',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // TIPOS DE VENTA
      DB::table('tipos_ventas')->insert([
          'nombre' => 'B2B',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_ventas')->insert([
          'nombre' => 'Mayorista',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_ventas')->insert([
          'nombre' => 'B2C',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_ventas')->insert([
          'nombre' => 'C2C',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_ventas')->insert([
          'nombre' => 'Empresas grandes',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // CANALES DE ADQUISICION
      DB::table('canales_adquisicion')->insert([
          'nombre' => 'Canal 1',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('canales_adquisicion')->insert([
          'nombre' => 'Canal 2',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('canales_adquisicion')->insert([
          'nombre' => 'Canal 3',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('canales_adquisicion')->insert([
          'nombre' => 'Canal 4',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('canales_adquisicion')->insert([
          'nombre' => 'Canal 5',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // TIPOS DE TELÉFONO
      DB::table('tipos_telefonos')->insert([
          'nombre' => 'Fijo',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_telefonos')->insert([
          'nombre' => 'Celular solo',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_telefonos')->insert([
          'nombre' => 'Celular y Whatsapp',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // TIPOS DE TAREAS
      DB::table('tipos_tareas')->insert([
          'nombre' => 'General',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_tareas')->insert([
          'nombre' => 'Llamada',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_tareas')->insert([
          'nombre' => 'Reunión',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('tipos_tareas')->insert([
          'nombre' => 'Reunión trimestral',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // MOTIVOS DE LOGS
      // MANUALES
      DB::table('motivos_logs')->insert([
          'nombre' => 'Llamado estratégico',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'M',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Llamado general',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'M',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Creación campaña Adwords',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'M',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Optimización campaña Adwords',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'M',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Creación campaña Facebook Ads',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'M',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Optimización campaña Facebook Ads',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'M',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      // AUTOMATICOS
      DB::table('motivos_logs')->insert([
          'nombre' => 'Alta de clientes',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Baja de clientes',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Alta brief de ventas',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Modificación servicios contratados',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio en monto del abono de cliente',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de PM asignado',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de presupuesto mensual a invertir en publicidad',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de método de facturación',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Firma de contrato',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de quién factura',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de forma de pago',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de etapa',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

      DB::table('motivos_logs')->insert([
          'nombre' => 'Cambio de objetivo de consultas mensuales',
          'es_milestone' => rand(0,1),
          'interes_gerencial' => rand(0,1),
          'tipo' => 'A',
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => rand(1,6),
      ]);

    }
}
