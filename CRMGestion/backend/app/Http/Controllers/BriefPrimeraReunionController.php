<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\BriefPrimeraReunion;
use App\Cliente;
use App\BriefPrimeraReunionCliente;
use App\Http\Traits\GlobalTrait;

class BriefPrimeraReunionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $briefs= Cliente::find($id)->briefPrimeraReunion()->get();
        return response()->json($briefs);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        try {
          \DB::beginTransaction();

          // GUARDAR CAMPO POR CAMPO AUTOMATICAMENTE EN CHANGE
          if ($request->saveOne) {

            $campo= $request->campo;
            $valorCampo= $request->valorCampo;

            \DB::table('briefs_primera_reunion')
              ->where('id','=',$id)
              ->where('id_cliente','=',$request->id_cliente)
              ->update([$campo => $valorCampo]);

            \DB::commit();
            $data= $this->show($request->id_cliente);
            return $data;

          // GENERAR BRIEF ASOCIADO AL CLIENTE Y MODIFICARLO
          }else if ($request->estado == "Generado") {

            $verificar= BriefPrimeraReunionCliente::find($id);
            if ($verificar) {

              return response()->json("Ya existe un registro del brief de primera reunion", 409);

            }else{

              \DB::table('briefs_primera_reunion')
                ->where('id_cliente','=',$request->id_cliente)
                ->update(
                  $request->all()
                );

              \DB::table('briefs_primera_reunion_cliente')
                ->where('id_cliente','=',$request->id_cliente)
                ->update(
                  $request->all()
                );

              \DB::commit();
              $data= $this->show($request->id_cliente);
              return $data;

            }

        // GUARDAR DATOS DE BRIEF DE PRIMERA REUNION DELCLIENTE
      }elseif($request->saveCBriefCliente){

          // GUARDAR CAMPO POR CAMPO AUTOMATICAMENTE EN CHANGE
          $campo= $request->campo;
          $valorCampo= $request->valorCampo;

          if ($campo == "recibir_contrato_firmado") {

            \DB::table('briefs_primera_reunion_cliente')
              ->where('id','=',$id)
              ->where('id_cliente','=',$request->id_cliente)
              ->update(['contrato_firmado' => $valorCampo]);

            \DB::commit();
            return response()->json('ok', 200);

          }elseif($campo == "modelo_negocio_brief"){

            \DB::table('briefs_primera_reunion_cliente')
              ->where('id','=',$id)
              ->where('id_cliente','=',$request->id_cliente)
              ->update(['modelo_negocio' => $valorCampo]);

            \DB::commit();
            return response()->json('ok', 200);

          }else{

            \DB::table('briefs_primera_reunion_cliente')
            ->where('id','=',$id)
            ->where('id_cliente','=',$request->id_cliente)
            ->update([$campo => $valorCampo]);

            \DB::commit();
            return response()->json('ok', 200);

          }

        // GUARDADO CON BOTON GUARDAR
        }else{

            \DB::table('briefs_primera_reunion')
              ->where('id','=',$id)
              ->update(
                $request->all()
              );

            \DB::commit();
            $data= $this->show($request->id_cliente);
            return $data;

          }

        } catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salio mal', 500);
        }

    }

    // EXPORTAR A EXCEL
    public function exportExcel(Request $request){
      $array= json_decode($request->array);
      if (count($array) == 0) {

        return response()->json('No existen datos', 400);

      }else{

        \Excel::create('brief_primera_reunion_'.time().'', function($excel) use($array) {
          $excel->sheet('Brief de primera reunión', function($sheet) use($array) {

            $sheet->setFontSize(12);
            foreach ($array as $row) {

              $sheet->rows(array(
                array('Inicial', ''),
                array('Recibir contrato firmado', (bool)$row->contrato_firmado ? 'Si' : 'No'),
                array('Presentarse y presentar al supervisor', (bool)$row->contrato_firmado ? 'Si' : 'No'),
                array('Explicarle la agenda y el motivo de la reunión', (bool)$row->explicacion_agenda ? 'Si' : 'No'),
                array('Explicar que el interlocutor de parte de ellos debe ser sólo 1 persona', (bool)$row->explicacion_interlocutor ? 'Si' : 'No'),
                array('', ''),

                array('Modelo de negocios', ''),
                array('Modelo de negocios del cliente: Productos y servicios, diferenciales, competencia, clientes, tipo de venta, etc.', $row->modelo_negocio),
                array('Setear expectativas de performance. Definir cantidad de consultas y definir calidad', $row->expectativas_performance),
                array('Relevar cómo gestiona sus ventas actuamente y cómo las va a manejar ahora', $row->relevo_ventas),
                array('', ''),

                array('Adwords', ''),
                array('Estrategia general, notas varias, palabras clave, etc.', $row->estrategia_general),
                array('Segmentación geográfica', $row->segmentacion_geografica),
                array('Presupuesto', $row->presupuesto_adwords),
                array('Accesos a campaña anterior', $row->acceso_campana),
                array('Explicar formas de pago y facturación', (bool)$row->explicacion_formas_pago ? 'Si' : 'No'),
                array('Datos de facturación y tarjeta: Método de pago, información fiscal y datos varios', $row->datos_facturacion),
                array('¿Cómo buscaría un cliente tuyo en Google?', $row->como_buscaria_cliente),
                array('Aclarar que no siempre sale primero, y tampoco sale el 100% de las veces', (bool)$row->aclaratoria ? 'Si' : 'No'),
                array('Explicar el proceso de mejora de campañas de Adwords', (bool)$row->explicacion_mejora ? 'Si' : 'No'),
                array('', ''),

                array('Landing pages', ''),
                array('Recordar el objetivo de la landing: Generar ventas. Es una herramienta para mejorar las campañas', (bool)$row->recordar_objetivo ? 'Si' : 'No'),
                array('La landing no es un sitio web. Explicar diferencias', (bool)$row->diferencia_landing ? 'Si' : 'No'),
                array('Mostrar ejemplos de landings. Explicar que tiene que lanzarse rápido', (bool)$row->mostrar_ejemplos_landings ? 'Si' : 'No'),
                array('Pedir teléfono, e-mail y whatsapp para poner en la landing', $row->pedir_datos_landing),
                array('Estrategia general de Landings y otra información', $row->estrategia_landing),
                array('Secciones de la landing', $row->secciones_landing),
                array('Explicar por qué la hosteamos nosotros en MKT1', $row->pq_hosteamos),
                array('Donde hostearla?', $row->donde_hostear),
                array('', ''),

                array('Remarketing', ''),
                array('Recordarle qué es. Explicar que se hace a lo último del plan de acción', (bool)$row->explicacion_remarketing ? 'Si' : 'No'),
                array('Comentarios varios Remarketing', $row->comentarios_remarketing),
                array('', ''),

                array('Facebook Ads', ''),
                array('Estrategia general Facebook Ads y perfil de sus clientes', $row->estrategia_facebook_ads),
                array('Datos de su Fan Page y cuenta publicitaria. Pedir accesos', $row->datos_fan_page_ads),
                array('Datos de tarjeta de crédito', $row->datos_tdc),
                array('Presupuesto', $row->presupuesto_facebook_ads),
                array('', ''),

                array('Facebook Posteos', ''),
                array('Estrategia general posteos en Facebook', $row->estrategia_facebook_posteos),
                array('Datos de su Fan Page', $row->datos_fan_page_posteos),
                array('', ''),

                array('Mailing', ''),
                array('Estrategia general Mailing', $row->estrategia_mailing),
                array('Información para primeros mailings', $row->info_primeros_mailings),
                array('Pedir base de datos', (bool)$row->pedir_bd ? 'Si' : 'No'),
                array('Explicar que el mailing no genera ventas de forma directa', (bool)$row->explicacion_mailing_no_ventas ? 'Si' : 'No'),
                array('', ''),

                array('Chat', ''),
                array('Explicación básica de como funciona', (bool)$row->explicacion_chat ? 'Si' : 'No'),
                array('', ''),

                array('Datos de acceso', ''),
                array('Datos de acceso al sitio, FTP, Hosting, Nic.ar. Sólo en caso necesario', $row->datos_sitio),

                array('Administrativo', ''),
                array('Todo lo administrativo se habla con sector Administración: Facturas, pagos, etc.', $row->depende_administracion),
                array('Recordar y confirmar que el pago es adelantado del 1 al 5 de cada mes', $row->recordar_pago),

                array('Final', ''),
                array('Explicar cómo tiene que gestionar las ventas', (bool)$row->explicacion_gestion_ventas ? 'Si' : 'No'),
                array('Se hacen reuniones presenciales trimestrales y el resto por teléfono', (bool)$row->reuniones ? 'Si' : 'No'),
                array('Nuestra forma de trabajo es de manera semanal', (bool)$row->forma_trabajo ? 'Si' : 'No'),
                array('Plan de acción: Tiempos semanales para hacer las tareas', (bool)$row->plan_accion ? 'Si' : 'No'),
                array('Expectativas luego del plan de accion: Consultas y ventas', (bool)$row->expectativas_plan_accion ? 'Si' : 'No'),
                array('Cómo y cuando llegan los reportes', (bool)$row->reportes ? 'Si' : 'No'),
                array('Recordar y confirmar que el pago es adelantado del 1 al 5 de cada mes', (bool)$row->recordar_pago_adelantado ? 'Si' : 'No'),
                array('Formas de aprobación de las piezas. Devoluciones de clientes de forma unificada. También unificar el envió de información general.', (bool)$row->formas_aprobacion ? 'Si' : 'No'),
                array('Explicar que se va a juntar con el equipo para definir cantidad de landings, campañas.', (bool)$row->explicacion_cantidad_landings_campanas ? 'Si' : 'No'),
                array('Explicarles bien claro y concreto como responder las consultas: Llamar en el momento.', (bool)$row->explicacion_responder_consultas ? 'Si' : 'No'),
                array('Cuales son los posibles puntos de conflicto con el cliente?.', $row->puntos_conflictos)
              ));

            }

          });
        })->export('xls');

      }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
