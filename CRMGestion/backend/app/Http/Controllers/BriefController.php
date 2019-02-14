<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\RolContacto;
use App\Servicio;
use App\ServicioContratado;
use App\ClienteServicioContratado;
use App\Contacto;
use App\Cliente;
use App\Puesto;
use App\FormaPago;
use App\TipoEmpresa;
use App\MetodoFacturacion;
use App\TipoVenta;
use App\TipoTelefono;
use App\Brief;
use App\CanalAdquisicion;
use Carbon\Carbon;
USE App\Log;
use App\WorkflowIngresoCliente;
use App\WorkflowServicio;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class BriefController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      // QUERY PARA NOMBRE

      if ($request->nombre_filtro && $request->nombre != " ") {

          $query1= "briefs.nombre LIKE '%$request->nombre%'";

      }else{

          $query1= "briefs.nombre LIKE '%$request->nombre%'";

      }

      // QUERY PARA FECHA DE COMIENZO DE GESTION

      if ($request->fecha_comienzo && $request->fecha_comienzo != " ") {

          $query2= "AND briefs.fecha_comienzo LIKE '%$request->fecha_comienzo%'";

      }else{

          $query2= " ";

      }

      // QUERY PARA PM ASIGNADO

      if ($request->pm_asignado && $request->pm_asignado != " ") {

          $query3= "AND users.nombres LIKE '%$request->pm_asignado%'";

      }else{

          $query3= " ";

      }

      // QUERY PARA ESTADO

      if ($request->estado && $request->estado != " ") {

          $query4= "AND briefs.estado LIKE '%$request->estado%'";

      }else{

          $query4= " ";

      }

      // ORDENAMIENTOS

      if ($request->nombre_ord && $request->nombre_ord != " ") {

          $columna= 'briefs.nombre';
          $ord= $request->nombre_ord;

      }elseif($request->fecha_ord && $request->fecha_ord != " "){

          $columna= 'briefs.fecha_comienzo';
          $ord= $request->fecha_ord;

      }else{

          $columna= 'briefs.nombre';
          $ord= 'ASC';

      }

      // LIMITE

      $offset= ((int)$request->pagina) * 10;

      $listBriefs= Brief::
        leftjoin('users','users.id','=','briefs.pm_asignado')
        ->selectRaw(\DB::raw('
        briefs.id,
        briefs.nombre,
        DATE_FORMAT(briefs.fecha_comienzo, "%d-%m-%Y") as fecha_comienzo,
        users.nombres as nombres_pm,
        users.apellidos as apellidos_pm,
        briefs.estado
        '))
        ->whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . "AND briefs.eliminado = 0"))
        ->orderBy($columna, $ord)
        ->offset($offset)
        ->limit(10)
        ->get();

      return response()->json($listBriefs);


    }

    public function getListadoRolesContacto()
    {

      $listRoles= RolContacto::orderBy('nombre','ASC')->get();
      return response()->json($listRoles);

    }

    public function getListadoTiposTelefonos(){

      $listTipoTelefonos= TipoTelefono::orderBy('nombre','ASC')->get();
      return response()->json($listTipoTelefonos);

    }

    public function getListadoServicios()
    {

      $listServicios= Servicio::where('habilitado','=',1)->orderBy('nombre','ASC')->get();
      return response()->json($listServicios);

    }

    public function getListadoTiposEmpresas()
    {

      $listTiposEmpresas= TipoEmpresa::orderBy('nombre','ASC')->get();
      return response()->json($listTiposEmpresas);

    }

    public function getListadoMetodosFacturacion()
    {

      $listMetodosFacturacion= MetodoFacturacion::orderBy('nombre','ASC')->get();
      return response()->json($listMetodosFacturacion);

    }

    public function getListadoTiposVentas()
    {

      $listTiposVentas= TipoVenta::orderBy('nombre','ASC')->get();
      return response()->json($listTiposVentas);

    }

    public function getListadoCanalesAdquisicion()
    {

      $listCanalesAdquicision= CanalAdquisicion::orderBy('nombre','ASC')->get();
      return response()->json($listCanalesAdquicision);

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
      try {
        \DB::beginTransaction();

        $jsonContactos= json_decode($request->arrayContacto);
        $jsonServicios= json_decode($request->arrayServicio);
        $jsonTiposEmpresa= json_decode($request->arrayTipoEmpresa);
        $jsonTiposVenta= json_decode($request->arrayTipoVenta);
        $jsonCanalesAdquisicion= json_decode($request->arrayCanalAdquisicion);

        $user= JWTAuth::parseToken()->authenticate();

        // CREACION DE BRIEF
        if ($request->create) {

          $dateFechaComienzoBrief= date_create($request->fecha_comienzo);
          $fecha_comienzo= date_format($dateFechaComienzoBrief, 'Y-m-d');

          $monto_abono= str_replace(".", "", $request->monto_abono);
          $presupuesto_invertir_publicidad= str_replace(".", "", $request->presupuesto_invertir_publicidad);

          if ($request->id_metodo_facturacion) {
            $metodo_facturacion= $request->id_metodo_facturacion;
          }else{
            $metodo_facturacion= NULL;
          }

          // INSERTAR BRIEF
          $idBrief= \DB::table('briefs')
          ->insertGetId([
            'nombre' => $request->nombre,
            'pm_asignado' => $request->pm_asignado,
            'fecha_comienzo' => $fecha_comienzo,
            'propuesta_original' => $request->propuesta_original,
            'monto_abono' => $monto_abono,
            'presupuesto_invertir_publicidad' => $presupuesto_invertir_publicidad,
            'distribucion_presupuesto_publicidad' => $request->distribucion_presupuesto_publicidad,
            'id_metodo_facturacion' => $metodo_facturacion,
            'sitio_web' => $request->sitio_web,
            'fan_page' => $request->fan_page,
            'rubro' => $request->rubro,
            'modelo_negocio' => $request->modelo_negocio,
            'calidad_modelo_negocio' => $request->calidad_modelo_negocio,
            'acciones_realiza_internet' => $request->acciones_realiza_internet,
            'upselibilidad' => $request->upselibilidad,
            'comentario_upselibilidad' => $request->comentario_upselibilidad,
            'educabilidad' => $request->educabilidad,
            'comentario_educabilidad' => $request->comentario_educabilidad,
            'comentario_adquisicion' => $request->comentario_adquisicion,
            'conocimiento_internet' => $request->conocimiento_internet,
            'capacidad_financiera_cliente' => $request->capacidad_financiera_cliente,
            'nivel_esperado_hinchapelotes' => $request->nivel_esperado_hinchapelotes,
            'puntaje_cliente' => $request->puntaje_cliente,
            'competidores_cliente' => $request->competidores_cliente,
            'personalidad' => $request->personalidad,
            'porque_llego' => $request->personalidad,
            'servicio_buscado' => $request->personalidad,
            'estado' => 'Creado',
            'eliminado' => 0,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);

          // INSERTAR CLIENTES
          $idCliente= \DB::table('clientes')
          ->insertGetId([
            'nombre' => $request->nombre,
            'pm_asignado' => $request->pm_asignado,
            'fecha_comienzo' => $fecha_comienzo,
            'fecha_primera_reunion' => NULL,
            'propuesta_original' => $request->propuesta_original,
            'monto_abono' => $monto_abono,
            'presupuesto_invertir_publicidad' => $presupuesto_invertir_publicidad,
            'distribucion_presupuesto_publicidad' => $request->distribucion_presupuesto_publicidad,
            'id_metodo_facturacion' => $metodo_facturacion,
            'sitio_web' => $request->sitio_web,
            'fan_page' => $request->fan_page,
            'rubro' => $request->rubro,
            'modelo_negocio' => $request->modelo_negocio,
            'calidad_modelo_negocio' => $request->calidad_modelo_negocio,
            'acciones_realiza_internet' => $request->acciones_realiza_internet,
            'upselibilidad' => $request->upselibilidad,
            'comentario_upselibilidad' => $request->comentario_upselibilidad,
            'educabilidad' => $request->educabilidad,
            'comentario_educabilidad' => $request->comentario_educabilidad,
            'comentario_adquisicion' => $request->comentario_adquisicion,
            'conocimiento_internet' => $request->conocimiento_internet,
            'capacidad_financiera_cliente' => $request->capacidad_financiera_cliente,
            'nivel_esperado_hinchapelotes' => $request->nivel_esperado_hinchapelotes,
            'puntaje_cliente' => $request->puntaje_cliente,
            'competidores_cliente' => $request->competidores_cliente,
            'personalidad' => $request->personalidad,
            'porque_llego' => $request->porque_llego,
            'servicio_buscado' => $request->servicio_buscado,
            'contrato_firmado' => 0,
            'etapa' => 'Setup',
            'estado' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);

          // CREAR REALCION CON BRIEF DE PRIMERA REUNION
          \DB::table('briefs_primera_reunion')
          ->insertGetId([
            'id_cliente' => $idCliente,
            'estado' => 'Borrador',
            'created_by' => $user->id,
          ]);

          \DB::table('briefs_primera_reunion_cliente')
          ->insertGetId([
            'id_cliente' => $idCliente,
            'estado' => 'Borrador',
            'created_by' => $user->id,
          ]);

          // ARRAY TIPO EMPRESA PARA BRIEF Y CLIENTE
          foreach ($jsonTiposEmpresa as $keyTipoEmpresa => $tipoEmpresa) {
            $tipoEmpresaBrief= \DB::table('briefs_tipos_empresas')
            ->insert([
              'id_brief' => $idBrief,
              'id_tipo_empresa' => $tipoEmpresa,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            $tipoEmpresaCliente= \DB::table('clientes_tipos_empresas')
            ->insert([
              'id_cliente' => $idCliente,
              'id_tipo_empresa' => $tipoEmpresa,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // ARRAY TIPO VENTA PARA BRIEF Y CLIENTE
          foreach ($jsonTiposVenta as $keyTipoVenta => $tipoVenta) {
            $tipoVentaBrief= \DB::table('briefs_tipos_ventas')
            ->insert([
              'id_brief' => $idBrief,
              'id_tipo_venta' => $tipoVenta,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            $tipoVentaCliente= \DB::table('clientes_tipos_ventas')
            ->insert([
              'id_cliente' => $idCliente,
              'id_tipo_venta' => $tipoVenta,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // ARRAY CANAL ADQUISICION PARA BRIEF Y CLIENTE
          foreach ($jsonCanalesAdquisicion as $keyCanalAdquisicion => $canalAdquisicion) {
            $canalAdquisicionBrief= \DB::table('briefs_canales_adquisicion')
            ->insert([
              'id_brief' => $idBrief,
              'id_canal_adquisicion' => $canalAdquisicion,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            $canalAdquisicionCliente= \DB::table('clientes_canales_adquisicion')
            ->insert([
              'id_cliente' => $idCliente,
              'id_canal_adquisicion' => $canalAdquisicion,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // CONTACTOS PARA BRIEF
          foreach($jsonContactos as $jsonContacto) {
            $idContacto= \DB::table('contactos')
            ->insertGetId([
              'nombre' => $jsonContacto->nombre,
              'apellido' => $jsonContacto->apellido,
              'es_principal' => $jsonContacto->es_principal,
              'religion_judia' => $jsonContacto->religion_judia,
              'medio_contacto' => $jsonContacto->medio_contacto,
              'comentarios' => $jsonContacto->comentario_contacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // ROLES DE CONTACTO
            foreach ($jsonContacto->roles as $rol) {
              $rolesCreate= \DB::table('contactos_roles')
              ->insert([
                'id_contacto' => $idContacto,
                'id_rol_contacto' => $rol->rol_contacto,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // EMAILS DE CONTACTO
            foreach ($jsonContacto->emails as $email) {
              $emailsCreate= \DB::table('emails_contactos')
              ->insert([
                'id_contacto' => $idContacto,
                'email' => $email->email,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // TELEFONOS DE CONTACTO
            foreach ($jsonContacto->telefonos as $telefono) {
                $telefonosCreate= \DB::table('telefonos_contactos')
                ->insert([
                  'id_contacto' => $idContacto,
                  'telefono' => $telefono->telefono,
                  'id_tipo_telefono' => $telefono->tipo_telefono,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
            }

            // RELACIONAR CONTACTOS A BRIEF
            $contactosToBrief= \DB::table('briefs_contactos')
            ->insert([
              'id_brief' => $idBrief,
              'id_contacto' => $idContacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            //////////////////////////////////////////////////

            // CONTACTOS DE CLIENTES
            $idContactoCliente= \DB::table('contactos_clientes')
            ->insertGetId([
              'nombre' => $jsonContacto->nombre,
              'apellido' => $jsonContacto->apellido,
              'es_principal' => $jsonContacto->es_principal,
              'religion_judia' => $jsonContacto->religion_judia,
              'medio_contacto' => $jsonContacto->medio_contacto,
              'comentarios' => $jsonContacto->comentario_contacto,
              'eliminado' => 0,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // ROLES DE CONTACTO
            foreach ($jsonContacto->roles as $rol) {
              $rolesCreate= \DB::table('contactos_clientes_roles')
              ->insert([
                'id_contacto_cliente' => $idContactoCliente,
                'id_rol_contacto' => $rol->rol_contacto,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // EMAILS DE CONTACTO
            foreach ($jsonContacto->emails as $email) {
              $emailsCreate= \DB::table('emails_contactos_clientes')
              ->insert([
                'id_contacto_cliente' => $idContactoCliente,
                'email' => $email->email,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // TELEFONOS DE CONTACTO
            foreach ($jsonContacto->telefonos as $telefono) {
                $telefonosCreate= \DB::table('telefonos_contactos_clientes')
                ->insert([
                  'id_contacto_cliente' => $idContactoCliente,
                  'telefono' => $telefono->telefono,
                  'id_tipo_telefono' => $telefono->tipo_telefono,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
            }

            // RELACIONAR CONTACTOS A CLIENTES
            $contactosToCliente= \DB::table('clientes_contactos')
            ->insert([
              'id_cliente' => $idCliente,
              'id_contacto_cliente' => $idContactoCliente,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

          }

          // SERVICIOS PARA BRIEF Y CLIENTE
          foreach ($jsonServicios as $jsonServicio) {
            $servicioBrief= \DB::table('servicios_contratados')
            ->insert([
              'cantidad_mensual' => $jsonServicio->cantidad_mensual,
              'fecha_comienzo' => $fecha_comienzo,
              'id_servicio' => $jsonServicio->id_servicio,
              'id_brief' => $idBrief,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            $servicioCliente= \DB::table('clientes_servicios_contratados')
            ->insertGetId([
              'cantidad_mensual' => $jsonServicio->cantidad_mensual,
              'fecha_comienzo' => $fecha_comienzo,
              'id_servicio' => $jsonServicio->id_servicio,
              'id_cliente' => $idCliente,
              'eliminado' => 0,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // CREACION DE TAREAS AUTOMATICAS
          WorkflowIngresoCliente::crearTareasAutomaticas($request->pm_asignado, $idCliente);

          // CREACION DE TAREAS TEMPLATE RELACIONADAS A SERVICIO
          WorkflowServicio::crearTareasServicios($idCliente);

          // SE REGISTRA EL LOG ALTA DE CLIENTE
          Log::registrarLog($idCliente, 7, "Se dió de alta al cliente");

          // SE REGISTRA EL LOG ALTA DE CLIENTE
          Log::registrarLog($idCliente, 9, "Se dió de alta el brief de venta");

          \DB::commit();
          return response()->json('ok', 201);

        }

        // BRIEF EN BORRADOR
        if ($request->borrador) {
          // PM
          if ($request->pm_asignado) {
            $pm_asignado= $request->pm_asignado;
          }else{
            $pm_asignado= NULL;
          }

          // FECHA COMIENZO
          if ($request->fecha_comienzo) {
            $dateFechaComienzoBrief= date_create($request->fecha_comienzo);
            $fecha_comienzo= date_format($dateFechaComienzoBrief, 'Y-m-d');
          }else{
            $fecha_comienzo= NULL;
          }

          // MONTO ABONO
          if ($request->monto_abono) {
            $monto_abono= str_replace(".", "", $request->monto_abono);

          }else{
            $monto_abono= NULL;
          }

          // PRESUPUESTO A INVERTIR PUBLICIDAD
          if ($request->presupuesto_invertir_publicidad) {
            $presupuesto_invertir_publicidad= str_replace(".", "", $request->presupuesto_invertir_publicidad);
          }else{
            $presupuesto_invertir_publicidad= NULL;
          }

          // METODO FACTURACION
          if ($request->id_metodo_facturacion) {
            $metodo_facturacion= $request->id_metodo_facturacion;
          }else{
            $metodo_facturacion= NULL;
          }

          // PRESUPUESTO A INVERTIR PUBLICIDAD
          if ($request->puntaje_cliente) {
            $puntaje_cliente= $request->puntaje_cliente;
          }else{
            $puntaje_cliente= NULL;
          }

          $idBrief= \DB::table('briefs')
          ->insertGetId([
            'nombre' => $request->nombre,
            'pm_asignado' => $pm_asignado,
            'fecha_comienzo' => $fecha_comienzo,
            'propuesta_original' => $request->propuesta_original,
            'monto_abono' => $monto_abono,
            'presupuesto_invertir_publicidad' => $presupuesto_invertir_publicidad,
            'distribucion_presupuesto_publicidad' => $request->distribucion_presupuesto_publicidad,
            'id_metodo_facturacion' => $metodo_facturacion,
            'sitio_web' => $request->sitio_web,
            'fan_page' => $request->fan_page,
            'rubro' => $request->rubro,
            'modelo_negocio' => $request->modelo_negocio,
            'calidad_modelo_negocio' => $request->calidad_modelo_negocio,
            'acciones_realiza_internet' => $request->acciones_realiza_internet,
            'upselibilidad' => $request->upselibilidad,
            'comentario_upselibilidad' => $request->comentario_upselibilidad,
            'educabilidad' => $request->educabilidad,
            'comentario_educabilidad' => $request->comentario_educabilidad,
            'comentario_adquisicion' => $request->comentario_adquisicion,
            'conocimiento_internet' => $request->conocimiento_internet,
            'capacidad_financiera_cliente' => $request->capacidad_financiera_cliente,
            'nivel_esperado_hinchapelotes' => $request->nivel_esperado_hinchapelotes,
            'puntaje_cliente' => $puntaje_cliente,
            'competidores_cliente' => $request->competidores_cliente,
            'personalidad' => $request->personalidad,
            'porque_llego' => $request->porque_llego,
            'servicio_buscado' => $request->servicio_buscado,
            'estado' => 'Borrador',
            'eliminado' => 0,
            'created_by' => $user->id,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          ]);

          // ARRAY TIPO EMPRESA
          if ($jsonTiposEmpresa) {
            foreach ($jsonTiposEmpresa as $tipoEmpresa) {
              $tipoEmpresaBrief= \DB::table('briefs_tipos_empresas')
              ->insert([
                'id_brief' => $idBrief,
                'id_tipo_empresa' => $tipoEmpresa,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }
          }

          // ARRAY TIPO VENTA
          if ($jsonTiposVenta) {
            foreach ($jsonTiposVenta as $tipoVenta) {
              $tipoVentaBrief= \DB::table('briefs_tipos_ventas')
              ->insert([
                'id_brief' => $idBrief,
                'id_tipo_venta' => $tipoVenta,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }
          }

          // ARRAY CANAL ADQUISICION
          if ($jsonCanalesAdquisicion) {
            foreach ($jsonCanalesAdquisicion as $canalAdquisicion) {
              $canalAdquisicionBrief= \DB::table('briefs_canales_adquisicion')
              ->insert([
                'id_brief' => $idBrief,
                'id_canal_adquisicion' => $canalAdquisicion,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }
          }

          // CONTACTOS
          foreach($jsonContactos as $jsonContacto) {
            $idContacto= \DB::table('contactos')
            ->insertGetId([
              'nombre' => $jsonContacto->nombre,
              'apellido' => $jsonContacto->apellido,
              'es_principal' => $jsonContacto->es_principal,
              'religion_judia' => $jsonContacto->religion_judia,
              'medio_contacto' => $jsonContacto->medio_contacto,
              'comentarios' => $jsonContacto->comentario_contacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // RELACIONAR CONTACTOS A BRIEF
            $contactosToBrief= \DB::table('briefs_contactos')
            ->insert([
              'id_brief' => $idBrief,
              'id_contacto' => $idContacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // ROLES DE CONTACTO
            foreach ($jsonContacto->roles as $rol) {
              $rolesCreate= \DB::table('contactos_roles')
              ->insert([
                'id_contacto' => $idContacto,
                'id_rol_contacto' => $rol->rol_contacto,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // EMAILS DE CONTACTO
            foreach ($jsonContacto->emails as $email) {
              $emailsCreate= \DB::table('emails_contactos')
              ->insert([
                'id_contacto' => $idContacto,
                'email' => $email->email,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // TELEFONOS DE CONTACTO
            foreach ($jsonContacto->telefonos as $telefono) {
                $telefonosCreate= \DB::table('telefonos_contactos')
                ->insert([
                  'id_contacto' => $idContacto,
                  'id_tipo_telefono' => $telefono->tipo_telefono,
                  'telefono' => $telefono->telefono,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
            }

          }

          // SERVICIOS DE BRIEF
          foreach ($jsonServicios as $jsonServicio) {
            if ($jsonServicio->cantidad_mensual) {
              $cantidad_mensual= $jsonServicio->cantidad_mensual;
            }else{
              $cantidad_mensual= NULL;
            }
            $servicio= \DB::table('servicios_contratados')
            ->insert([
              'cantidad_mensual' => $cantidad_mensual,
              'fecha_comienzo' => $fecha_comienzo,
              'id_servicio' => $jsonServicio->id_servicio,
              'id_brief' => $idBrief,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          \DB::commit();
          return response()->json('ok', 201);

        }

      } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salio mal', 500);

      }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $brief= Brief::
        leftjoin('users','users.id','=','briefs.pm_asignado')
        ->select('briefs.*','users.id as id_pm','users.nombres as nombres_pm','users.apellidos as apellidos_pm')
        ->where('briefs.id','=',$id)
        ->get();

      $contactos= \DB::table('contactos')
        ->join('briefs_contactos','briefs_contactos.id_contacto','=','contactos.id')
        ->select('contactos.*')
        ->where('briefs_contactos.id_brief','=',$id)
        ->orderBy('contactos.es_principal',1)
        ->orderBy('contactos.nombre','ASC')
        ->get();

      $emailsContactos= \DB::table('briefs_contactos')
        ->join('contactos','contactos.id','=','briefs_contactos.id_contacto')
        ->join('emails_contactos','emails_contactos.id_contacto','=','contactos.id')
        ->select('emails_contactos.id','emails_contactos.email','contactos.id as id_contacto')
        ->where('briefs_contactos.id_brief','=',$id)
        ->get();

      $telefonosContactos= \DB::table('briefs_contactos')
        ->join('contactos','contactos.id','=','briefs_contactos.id_contacto')
        ->join('telefonos_contactos','telefonos_contactos.id_contacto','=','contactos.id')
        ->join('tipos_telefonos','tipos_telefonos.id','=','telefonos_contactos.id_tipo_telefono')
        ->select('telefonos_contactos.id','telefonos_contactos.telefono','telefonos_contactos.id_tipo_telefono','tipos_telefonos.nombre as nombre_tipo_telefono','contactos.id as id_contacto')
        ->where('briefs_contactos.id_brief','=',$id)
        ->get();

      $rolesContactos= \DB::table('briefs_contactos')
        ->join('contactos','contactos.id','=','briefs_contactos.id_contacto')
        ->join('contactos_roles','contactos_roles.id_contacto','=','contactos.id')
        ->join('roles_contactos','roles_contactos.id','=','contactos_roles.id_rol_contacto')
        ->select('roles_contactos.id','roles_contactos.nombre','contactos.id as id_contacto')
        ->where('briefs_contactos.id_brief','=',$id)
        ->get();

      $tiposEmpresas= \DB::table('briefs_tipos_empresas')
        ->join('tipos_empresas','tipos_empresas.id','=','briefs_tipos_empresas.id_tipo_empresa')
        ->select('tipos_empresas.id')
        ->where('briefs_tipos_empresas.id_brief','=',$id)
        ->get();

      $tiposVentas= \DB::table('briefs_tipos_ventas')
        ->join('tipos_ventas','tipos_ventas.id','=','briefs_tipos_ventas.id_tipo_venta')
        ->select('tipos_ventas.id')
        ->where('briefs_tipos_ventas.id_brief','=',$id)
        ->get();

      $canalesAdquisicion= \DB::table('briefs_canales_adquisicion')
        ->join('canales_adquisicion','canales_adquisicion.id','=','briefs_canales_adquisicion.id_canal_adquisicion')
        ->select('canales_adquisicion.id')
        ->where('briefs_canales_adquisicion.id_brief','=',$id)
        ->get();

      $servicios= \DB::table('servicios_contratados')
        ->join('servicios','servicios.id','=','servicios_contratados.id_servicio')
        ->select('servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
        ->where('servicios_contratados.id_brief','=',$id)
        ->orderBy('servicios.nombre','ASC')
        ->get();

      return response()->json(compact('brief','contactos','emailsContactos','telefonosContactos','rolesContactos','tiposEmpresas','tiposVentas','canalesAdquisicion','servicios'), 200);
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

        $user= JWTAuth::parseToken()->authenticate();
        $jsonContactos= json_decode($request->arrayContacto);
        $jsonServicios= json_decode($request->arrayServicio);
        $jsonTiposEmpresa= json_decode($request->arrayTipoEmpresa);
        $jsonTiposVenta= json_decode($request->arrayTipoVenta);
        $jsonCanalesAdquisicion= json_decode($request->arrayCanalAdquisicion);

        // BRIEF EN BORRADOR EN EVENTO CHANGE CADA CAMPO
        if ($request->guardar) {

          $campo= $request->campo;
          $valorCampo= $request->valorCampo;

          // FECHA COMIENZO
          if ($campo == 'fecha_comienzo') {
            $dateFechaComienzoBrief= date_create($valorCampo);
            $valorCampo= date_format($dateFechaComienzoBrief, 'Y-m-d');
          }else{
            $valorCampo;
          }

          // MONTO ABONO O PRESUPUESTO A INVERTIR EN PUBLICIDAD
          if ($campo == 'monto_abono' || $campo == 'presupuesto_invertir_publicidad') {
            $valorCampo= str_replace(".", "", $valorCampo);
          }else{
            $valorCampo;
          }

          if ($campo == 'id_tipo_empresa') {

              // ARRAY TIPO EMPRESA
              $jsonTiposEmpresa= json_decode($valorCampo);
              $deleteTiposEmpresas= \DB::table('briefs_tipos_empresas')->where('id_brief','=',$id)->delete();
              foreach ($jsonTiposEmpresa as $tipoEmpresa) {
                $tipoEmpresaBrief= \DB::table('briefs_tipos_empresas')
                ->insert([
                  'id_brief' => $id,
                  'id_tipo_empresa' => $tipoEmpresa,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
              }

          }else if ($campo == 'id_tipo_venta') {

              // ARRAY TIPO VENTA
              $jsonTiposVenta= json_decode($valorCampo);
              $deleteTiposVenta= \DB::table('briefs_tipos_ventas')->where('id_brief','=',$id)->delete();
              foreach ($jsonTiposVenta as $tipoVenta) {
                $tipoVentaBrief= \DB::table('briefs_tipos_ventas')
                ->insert([
                  'id_brief' => $id,
                  'id_tipo_venta' => $tipoVenta,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
              }

          }else if ($campo == 'id_canal_adquisicion') {

              // ARRAY CANAL ADQUISICION
              $jsonCanalesAdquisicion= json_decode($valorCampo);
              $deleteCanalesAdquisicion= \DB::table('briefs_canales_adquisicion')->where('id_brief','=',$id)->delete();
              foreach ($jsonCanalesAdquisicion as $canalAdquisicion) {
                $canalAdquisicionBrief= \DB::table('briefs_canales_adquisicion')
                ->insert([
                  'id_brief' => $id,
                  'id_canal_adquisicion' => $canalAdquisicion,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
              }

          }else{

            \DB::table('briefs')
            ->where('id', $id)
            ->update([$campo => $valorCampo]);

          }

          \DB::commit();
          return response()->json('ok', 200);

        }

        // GUARDADO EN BORRADOR BRIEF
        if ($request->borrador) {

          // PM
          if ($request->pm_asignado) {
            $pm_asignado= $request->pm_asignado;
          }else{
            $pm_asignado= NULL;
          }

          // FECHA COMIENZO
          if ($request->fecha_comienzo) {
            $dateFechaComienzoBrief= date_create($request->fecha_comienzo);
            $fecha_comienzo= date_format($dateFechaComienzoBrief, 'Y-m-d');
          }else{
            $fecha_comienzo= NULL;
          }

          // MONTO ABONO
          if ($request->monto_abono) {
            $monto_abono= str_replace(".", "", $request->monto_abono);

          }else{
            $monto_abono= NULL;
          }

          // PRESUPUESTO A INVERTIR PUBLICIDAD
          if ($request->presupuesto_invertir_publicidad) {
            $presupuesto_invertir_publicidad= str_replace(".", "", $request->presupuesto_invertir_publicidad);
          }else{
            $presupuesto_invertir_publicidad= NULL;
          }

          // PRESUPUESTO A INVERTIR PUBLICIDAD
          if ($request->puntaje_cliente) {
            $puntaje_cliente= $request->puntaje_cliente;
          }else{
            $puntaje_cliente= NULL;
          }

          $brief= Brief::FindOrFail($id);
          $brief->nombre= $request->nombre;
          $brief->pm_asignado= $pm_asignado;
          $brief->fecha_comienzo= $fecha_comienzo;
          $brief->propuesta_original= $request->propuesta_original;
          $brief->monto_abono= $monto_abono;
          $brief->presupuesto_invertir_publicidad= $presupuesto_invertir_publicidad;
          $brief->distribucion_presupuesto_publicidad= $request->distribucion_presupuesto_publicidad;
          $brief->id_metodo_facturacion= $request->id_metodo_facturacion;
          $brief->sitio_web= $request->sitio_web;
          $brief->fan_page= $request->fan_page;
          $brief->rubro= $request->rubro;
          $brief->modelo_negocio= $request->modelo_negocio;
          $brief->calidad_modelo_negocio= $request->calidad_modelo_negocio;
          $brief->acciones_realiza_internet= $request->acciones_realiza_internet;
          $brief->upselibilidad= $request->upselibilidad;
          $brief->comentario_upselibilidad= $request->comentario_upselibilidad;
          $brief->educabilidad= $request->educabilidad;
          $brief->comentario_educabilidad= $request->comentario_educabilidad;
          $brief->comentario_adquisicion= $request->comentario_adquisicion;
          $brief->conocimiento_internet= $request->conocimiento_internet;
          $brief->capacidad_financiera_cliente= $request->capacidad_financiera_cliente;
          $brief->nivel_esperado_hinchapelotes= $request->nivel_esperado_hinchapelotes;
          $brief->puntaje_cliente= $puntaje_cliente;
          $brief->competidores_cliente= $request->competidores_cliente;
          $brief->personalidad= $request->personalidad;
          $brief->porque_llego= $request->porque_llego;
          $brief->servicio_buscado= $request->servicio_buscado;
          $brief->save();

          // ARRAY TIPO EMPRESA PARA BRIEF Y CLIENTE
          \DB::table('briefs_tipos_empresas')->where('id_brief','=',$id)->delete();
          foreach ($jsonTiposEmpresa as $tipoEmpresa) {
            \DB::table('briefs_tipos_empresas')
            ->insert([
              'id_brief' => $id,
              'id_tipo_empresa' => $tipoEmpresa,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // ARRAY TIPO VENTA PARA BRIEF Y CLIENTE
          \DB::table('briefs_tipos_ventas')->where('id_brief','=',$id)->delete();
          foreach ($jsonTiposVenta as $tipoVenta) {
            \DB::table('briefs_tipos_ventas')
            ->insert([
              'id_brief' => $id,
              'id_tipo_venta' => $tipoVenta,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // ARRAY CANAL ADQUISICION PARA BRIEF Y CLIENTE
          \DB::table('briefs_canales_adquisicion')->where('id_brief','=',$id)->delete();
          foreach ($jsonCanalesAdquisicion as $canalAdquisicion) {
            \DB::table('briefs_canales_adquisicion')
            ->insert([
              'id_brief' => $id,
              'id_canal_adquisicion' => $canalAdquisicion,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // CONTACTOS PARA BRIEF
          foreach($jsonContactos as $jsonContacto) {
            Contacto::find($jsonContacto->id)->delete();
            // CONTACTOS DE CLIENTES
            $idContacto= \DB::table('contactos')
            ->insertGetId([
              'nombre' => $jsonContacto->nombre,
              'apellido' => $jsonContacto->apellido,
              'es_principal' => $jsonContacto->es_principal,
              'religion_judia' => $jsonContacto->religion_judia,
              'medio_contacto' => $jsonContacto->medio_contacto,
              'comentarios' => $jsonContacto->comentario_contacto,
              'created_by' => $user->id,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            ]);

            // ROLES DE CONTACTO
            foreach ($jsonContacto->roles as $rol) {
              $rolesCreate= \DB::table('contactos_roles')
              ->insert([
                'id_contacto' => $idContacto,
                'id_rol_contacto' => $rol->rol_contacto,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // EMAILS DE CONTACTO
            foreach ($jsonContacto->emails as $email) {
              $emailsCreate= \DB::table('emails_contactos')
              ->insert([
                'id_contacto' => $idContacto,
                'email' => $email->email,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // TELEFONOS DE CONTACTO
            foreach ($jsonContacto->telefonos as $telefono) {
                $telefonosCreate= \DB::table('telefonos_contactos')
                ->insert([
                  'id_contacto' => $idContacto,
                  'telefono' => $telefono->telefono,
                  'id_tipo_telefono' => $telefono->tipo_telefono,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
            }

            // RELACIONAR CONTACTOS A CLIENTES
            $contactosToBrief= \DB::table('briefs_contactos')
            ->insert([
              'id_brief' => $id,
              'id_contacto' => $idContacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

          }

          // SERVICIOS PARA BRIEF Y CLIENTE
          foreach ($jsonServicios as $jsonServicio) {
            \DB::table('servicios_contratados')->where('id','=',$jsonServicio->id)->delete();
            $servicioBrief= \DB::table('servicios_contratados')
            ->insertGetId([
              'cantidad_mensual' => $jsonServicio->cantidad_mensual,
              'fecha_comienzo' => $request->fecha_comienzo,
              'id_servicio' => $jsonServicio->id_servicio,
              'id_brief' => $id,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          \DB::commit();
          return response()->json('ok', 201);

        }

        // GENERAR BRIEF DE VENTA IMPACTA EN CLIENTE
        if ($request->create) {

          $monto_abono= str_replace(".", "", $request->monto_abono);
          $presupuesto_invertir_publicidad= str_replace(".", "", $request->presupuesto_invertir_publicidad);

          $brief= Brief::FindOrFail($id);
          $brief->nombre= $request->nombre;
          $brief->pm_asignado= $request->pm_asignado;
          $brief->fecha_comienzo= $request->fecha_comienzo;
          $brief->propuesta_original= $request->propuesta_original;
          $brief->monto_abono= $monto_abono;
          $brief->presupuesto_invertir_publicidad= $presupuesto_invertir_publicidad;
          $brief->distribucion_presupuesto_publicidad= $request->distribucion_presupuesto_publicidad;
          $brief->id_metodo_facturacion= $request->id_metodo_facturacion;
          $brief->sitio_web= $request->sitio_web;
          $brief->fan_page= $request->fan_page;
          $brief->rubro= $request->rubro;
          $brief->modelo_negocio= $request->modelo_negocio;
          $brief->calidad_modelo_negocio= $request->calidad_modelo_negocio;
          $brief->acciones_realiza_internet= $request->acciones_realiza_internet;
          $brief->upselibilidad= $request->upselibilidad;
          $brief->comentario_upselibilidad= $request->comentario_upselibilidad;
          $brief->educabilidad= $request->educabilidad;
          $brief->comentario_educabilidad= $request->comentario_educabilidad;
          $brief->comentario_adquisicion= $request->comentario_adquisicion;
          $brief->conocimiento_internet= $request->conocimiento_internet;
          $brief->capacidad_financiera_cliente= $request->capacidad_financiera_cliente;
          $brief->nivel_esperado_hinchapelotes= $request->nivel_esperado_hinchapelotes;
          $brief->puntaje_cliente= $request->puntaje_cliente;
          $brief->competidores_cliente= $request->competidores_cliente;
          $brief->personalidad= $request->personalidad;
          $brief->porque_llego= $request->porque_llego;
          $brief->servicio_buscado= $request->servicio_buscado;
          $brief->estado= "Creado";
          $brief->save();

          // UPDATEAR CLIENTES
          \DB::table('clientes')
          ->where('id','=',$request->id_cliente)
          ->update([
            'nombre' => $request->nombre,
            'pm_asignado' => $request->pm_asignado,
            'fecha_comienzo' => $request->fecha_comienzo,
            'fecha_primera_reunion' => NULL,
            'propuesta_original' => $request->propuesta_original,
            'monto_abono' => $monto_abono,
            'presupuesto_invertir_publicidad' => $presupuesto_invertir_publicidad,
            'distribucion_presupuesto_publicidad' => $request->distribucion_presupuesto_publicidad,
            'id_metodo_facturacion' => $request->id_metodo_facturacion,
            'sitio_web' => $request->sitio_web,
            'fan_page' => $request->fan_page,
            'rubro' => $request->rubro,
            'modelo_negocio' => $request->modelo_negocio,
            'calidad_modelo_negocio' => $request->calidad_modelo_negocio,
            'acciones_realiza_internet' => $request->acciones_realiza_internet,
            'upselibilidad' => $request->upselibilidad,
            'comentario_upselibilidad' => $request->comentario_upselibilidad,
            'educabilidad' => $request->educabilidad,
            'comentario_educabilidad' => $request->comentario_educabilidad,
            'comentario_adquisicion' => $request->comentario_adquisicion,
            'conocimiento_internet' => $request->conocimiento_internet,
            'capacidad_financiera_cliente' => $request->capacidad_financiera_cliente,
            'nivel_esperado_hinchapelotes' => $request->nivel_esperado_hinchapelotes,
            'puntaje_cliente' => $request->puntaje_cliente,
            'competidores_cliente' => $request->competidores_cliente,
            'personalidad' => $request->personalidad,
            'porque_llego' => $request->porque_llego,
            'servicio_buscado' => $request->servicio_buscado,
            'contrato_firmado' => 0,
            'etapa' => 'Setup',
            'estado' => 1,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);

          // ARRAY TIPO EMPRESA PARA BRIEF Y CLIENTE
          \DB::table('briefs_tipos_empresas')->where('id_brief','=',$id)->delete();
          \DB::table('clientes_tipos_empresas')->where('id_cliente','=',$request->id_cliente)->delete();
          foreach ($jsonTiposEmpresa as $tipoEmpresa) {
            \DB::table('briefs_tipos_empresas')
            ->insert([
              'id_brief' => $id,
              'id_tipo_empresa' => $tipoEmpresa,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            \DB::table('clientes_tipos_empresas')
            ->insert([
              'id_cliente' => $request->id_cliente,
              'id_tipo_empresa' => $tipoEmpresa,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // ARRAY TIPO VENTA PARA BRIEF Y CLIENTE
          \DB::table('briefs_tipos_ventas')->where('id_brief','=',$id)->delete();
          \DB::table('clientes_tipos_ventas')->where('id_cliente','=',$request->id_cliente)->delete();
          foreach ($jsonTiposVenta as $tipoVenta) {
            \DB::table('briefs_tipos_ventas')
            ->insert([
              'id_brief' => $id,
              'id_tipo_venta' => $tipoVenta,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            \DB::table('clientes_tipos_ventas')
            ->insert([
              'id_cliente' => $request->id_cliente,
              'id_tipo_venta' => $tipoVenta,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // ARRAY CANAL ADQUISICION PARA BRIEF Y CLIENTE
          \DB::table('briefs_canales_adquisicion')->where('id_brief','=',$id)->delete();
          \DB::table('clientes_canales_adquisicion')->where('id_cliente','=',$request->id_cliente)->delete();
          foreach ($jsonCanalesAdquisicion as $canalAdquisicion) {
            $canalAdquisicionBrief= \DB::table('briefs_canales_adquisicion')
            ->insert([
              'id_brief' => $id,
              'id_canal_adquisicion' => $canalAdquisicion,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            \DB::table('clientes_canales_adquisicion')
            ->insert([
              'id_cliente' => $request->id_cliente,
              'id_canal_adquisicion' => $canalAdquisicion,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
          }

          // CONTACTOS PARA BRIEF
          Cliente::find($request->id_cliente)->contactosClientes()->delete();
          foreach($jsonContactos as $jsonContacto) {
            Contacto::find($jsonContacto->id)->delete();
            $idContacto= \DB::table('contactos')
            ->insertGetId([
              'nombre' => $jsonContacto->nombre,
              'apellido' => $jsonContacto->apellido,
              'es_principal' => $jsonContacto->es_principal,
              'religion_judia' => $jsonContacto->religion_judia,
              'medio_contacto' => $jsonContacto->medio_contacto,
              'comentarios' => $jsonContacto->comentario_contacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // ROLES DE CONTACTO
            foreach ($jsonContacto->roles as $rol) {
              $rolesCreate= \DB::table('contactos_roles')
              ->insert([
                'id_contacto' => $idContacto,
                'id_rol_contacto' => $rol->rol_contacto,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // EMAILS DE CONTACTO
            foreach ($jsonContacto->emails as $email) {
              $emailsCreate= \DB::table('emails_contactos')
              ->insert([
                'id_contacto' => $idContacto,
                'email' => $email->email,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // TELEFONOS DE CONTACTO
            foreach ($jsonContacto->telefonos as $telefono) {
                $telefonosCreate= \DB::table('telefonos_contactos')
                ->insert([
                  'id_contacto' => $idContacto,
                  'telefono' => $telefono->telefono,
                  'id_tipo_telefono' => $telefono->tipo_telefono,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
            }

            // RELACIONAR CONTACTOS A BRIEF
            $contactosToBrief= \DB::table('briefs_contactos')
            ->insert([
              'id_brief' => $id,
              'id_contacto' => $idContacto,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            //////////////////////////////////////////////////
            // CONTACTOS DE CLIENTES
            $idContactoCliente= \DB::table('contactos_clientes')
            ->insertGetId([
              'nombre' => $jsonContacto->nombre,
              'apellido' => $jsonContacto->apellido,
              'es_principal' => $jsonContacto->es_principal,
              'religion_judia' => $jsonContacto->religion_judia,
              'medio_contacto' => $jsonContacto->medio_contacto,
              'comentarios' => $jsonContacto->comentario_contacto,
              'eliminado' => 0,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // ROLES DE CONTACTO
            foreach ($jsonContacto->roles as $rol) {
              $rolesCreate= \DB::table('contactos_clientes_roles')
              ->insert([
                'id_contacto_cliente' => $idContactoCliente,
                'id_rol_contacto' => $rol->rol_contacto,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // EMAILS DE CONTACTO
            foreach ($jsonContacto->emails as $email) {
              $emailsCreate= \DB::table('emails_contactos_clientes')
              ->insert([
                'id_contacto_cliente' => $idContactoCliente,
                'email' => $email->email,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
            }

            // TELEFONOS DE CONTACTO
            foreach ($jsonContacto->telefonos as $telefono) {
                $telefonosCreate= \DB::table('telefonos_contactos_clientes')
                ->insert([
                  'id_contacto_cliente' => $idContactoCliente,
                  'telefono' => $telefono->telefono,
                  'id_tipo_telefono' => $telefono->tipo_telefono,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
            }

            // RELACIONAR CONTACTOS A CLIENTES
            $contactosToCliente= \DB::table('clientes_contactos')
            ->insert([
              'id_cliente' => $request->id_cliente,
              'id_contacto_cliente' => $idContactoCliente,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

          }

          // SERVICIOS PARA BRIEF Y CLIENTE
          foreach ($jsonServicios as $jsonServicio) {
            \DB::table('servicios_contratados')->where('id','=',$jsonServicio->id)->delete();
            $servicioBrief= \DB::table('servicios_contratados')
            ->insert([
              'cantidad_mensual' => $jsonServicio->cantidad_mensual,
              'fecha_comienzo' => $request->fecha_comienzo,
              'id_servicio' => $jsonServicio->id_servicio,
              'id_brief' => $id,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            $verificar= \DB::table('clientes_servicios_contratados')->where('id_servicio','=',$jsonServicio->id_servicio)->where('id_cliente','=',$request->id_cliente)->count();
            if ($verificar == 0) {

              $servicioCliente= \DB::table('clientes_servicios_contratados')
              ->insertGetId([
                'cantidad_mensual' => $jsonServicio->cantidad_mensual,
                'fecha_comienzo' => $request->fecha_comienzo,
                'id_servicio' => $jsonServicio->id_servicio,
                'id_cliente' => $request->id_cliente,
                'eliminado' => 0,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);
              WorkflowServicio::nuevaTareaServicio($jsonServicio->id_servicio, $request->id_cliente, $servicioCliente);

            }

          }

          \DB::commit();
          return response()->json('ok', 201);

        }


      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salio mal', 500);

      }

    }

    public function addContacto(Request $request)
    {

      try {
        \DB::beginTransaction();

        $user= JWTAuth::parseToken()->authenticate();
        $jsonContactos= json_decode($request->arrayContacto);

        // CONTACTOS
        $idContacto= \DB::table('contactos')
        ->insertGetId([
          'nombre' => $jsonContactos->nombre,
          'apellido' => $jsonContactos->apellido,
          'es_principal' => $jsonContactos->es_principal,
          'religion_judia' => $jsonContactos->religion_judia,
          'medio_contacto' => $jsonContactos->medio_contacto,
          'comentarios' => $jsonContactos->comentario_contacto,
          'created_by' => $user->id,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        // RELACIONAR CONTACTOS A BRIEF
        $contactosToBrief= \DB::table('briefs_contactos')
        ->insert([
          'id_brief' => $request->id_brief,
          'id_contacto' => $idContacto,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => $user->id,
        ]);

        // ROLES DE CONTACTO
        foreach ($jsonContactos->roles as $rol) {
          $rolesCreate= \DB::table('contactos_roles')
          ->insert([
            'id_contacto' => $idContacto,
            'id_rol_contacto' => $rol->rol_contacto,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // EMAILS DE CONTACTO
        foreach ($jsonContactos->emails as $email) {
          $emailsCreate= \DB::table('emails_contactos')
          ->insert([
            'id_contacto' => $idContacto,
            'email' => $email->email,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // TELEFONOS DE CONTACTO
        foreach ($jsonContactos->telefonos as $telefono) {
            $telefonosCreate= \DB::table('telefonos_contactos')
            ->insert([
              'id_contacto' => $idContacto,
              'id_tipo_telefono' => $telefono->tipo_telefono,
              'telefono' => $telefono->telefono,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
        }

        $retorno= $this->retornarData($request->id_brief);
        \DB::commit();

        return $retorno;

      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salio mal', 500);

      }

    }

    public function editContacto(Request $request, $id)
    {

      try {
        \DB::beginTransaction();

        $user= JWTAuth::parseToken()->authenticate();
        $jsonContactos= json_decode($request->arrayContacto);

        // CONTACTOS
        $deleteContacto= Contacto::find($jsonContactos->id)->delete();

        $idContacto= \DB::table('contactos')
        ->insertGetId([
          'nombre' => $jsonContactos->nombre,
          'apellido' => $jsonContactos->apellido,
          'es_principal' => $jsonContactos->es_principal,
          'religion_judia' => $jsonContactos->religion_judia,
          'medio_contacto' => $jsonContactos->medio_contacto,
          'comentarios' => $jsonContactos->comentario_contacto,
          'created_by' => $user->id,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        // RELACIONAR CONTACTOS A BRIEF
        $contactosToBrief= \DB::table('briefs_contactos')
        ->insert([
          'id_brief' => $id,
          'id_contacto' => $idContacto,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => $user->id,
        ]);

        // ROLES DE CONTACTO
        foreach ($jsonContactos->roles as $rol) {
          $rolesCreate= \DB::table('contactos_roles')
          ->insert([
            'id_contacto' => $idContacto,
            'id_rol_contacto' => $rol->rol_contacto,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // EMAILS DE CONTACTO
        foreach ($jsonContactos->emails as $email) {
          $emailsCreate= \DB::table('emails_contactos')
          ->insert([
            'id_contacto' => $idContacto,
            'email' => $email->email,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // TELEFONOS DE CONTACTO
        foreach ($jsonContactos->telefonos as $telefono) {
          $telefonosCreate= \DB::table('telefonos_contactos')
          ->insert([
            'id_contacto' => $idContacto,
            'id_tipo_telefono' => $telefono->tipo_telefono,
            'telefono' => $telefono->telefono,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
            ]);
          }

          $retorno= $this->retornarData($id);
          \DB::commit();
          return $retorno;

      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salio mal', 500);

      }

    }

    public function deleteContacto($id)
    {
      try {
          \DB::beginTransaction();

          $contacto= Contacto::find($id)->delete();
          $retorno= $this->retornarData($id);
          \DB::commit();
          return $retorno;

      } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);

      }
    }

    public function retornarData($id)
    {

      $contactos= \DB::table('contactos')
        ->join('briefs_contactos','briefs_contactos.id_contacto','=','contactos.id')
        ->select('contactos.*')
        ->where('briefs_contactos.id_brief','=',$id)
        ->orderBy('contactos.es_principal',1)
        ->orderBy('contactos.nombre','ASC')
        ->get();

      $emailsContactos= \DB::table('briefs_contactos')
        ->join('contactos','contactos.id','=','briefs_contactos.id_contacto')
        ->join('emails_contactos','emails_contactos.id_contacto','=','contactos.id')
        ->select('emails_contactos.id','emails_contactos.email','contactos.id as id_contacto')
        ->where('briefs_contactos.id_brief','=',$id)
        ->get();

      $telefonosContactos= \DB::table('briefs_contactos')
        ->join('contactos','contactos.id','=','briefs_contactos.id_contacto')
        ->join('telefonos_contactos','telefonos_contactos.id_contacto','=','contactos.id')
        ->join('tipos_telefonos','tipos_telefonos.id','=','telefonos_contactos.id_tipo_telefono')
        ->select('telefonos_contactos.id','telefonos_contactos.telefono','telefonos_contactos.id_tipo_telefono','tipos_telefonos.nombre as nombre_tipo_telefono','contactos.id as id_contacto')
        ->where('briefs_contactos.id_brief','=',$id)
        ->get();

      $rolesContactos= \DB::table('briefs_contactos')
        ->join('contactos','contactos.id','=','briefs_contactos.id_contacto')
        ->join('contactos_roles','contactos_roles.id_contacto','=','contactos.id')
        ->join('roles_contactos','roles_contactos.id','=','contactos_roles.id_rol_contacto')
        ->select('roles_contactos.id','roles_contactos.nombre','contactos.id as id_contacto')
        ->where('briefs_contactos.id_brief','=',$id)
        ->get();

      return response()->json(compact('contactos','emailsContactos','telefonosContactos','rolesContactos'), 200);

    }

    public function addServicio(Request $request)
    {

      try {
          \DB::beginTransaction();

          $user= JWTAuth::parseToken()->authenticate();

          // SERVICIOS DE BRIEF
          // FECHA COMIENZO
          if ($request->fecha_comienzo) {
            $dateFechaComienzoBrief= date_create($request->fecha_comienzo);
            $valorFechaComienzoBrief= date_format($dateFechaComienzoBrief, 'Y-m-d');
          }else{

            return response()->json('Debe ingresar la fecha de comienzo de gestión al brief', 400);

          }

          // VERIFICAR SI EXISTE UN SERVICIO IDENTIDO
          $verificarExistencia= \DB::table('servicios_contratados')
            ->where('id_servicio','=',$request->id_servicio)
            ->where('id_brief','=',$request->id_brief)
            ->count();

          if ($verificarExistencia > 0) {

            return response()->json("El servicio seleccionado ya existe para el brief", 409);

          }else{

              if ($request->cantidad_mensual) {
                $cantidad_mensual= $request->cantidad_mensual;
              }else{
                $cantidad_mensual= NULL;
              }

              $servicio= \DB::table('servicios_contratados')
              ->insert([
                'cantidad_mensual' => $cantidad_mensual,
                'fecha_comienzo' => $valorFechaComienzoBrief,
                'id_servicio' => $request->id_servicio,
                'id_brief' => $request->id_brief,
                'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                'created_by' => $user->id,
              ]);

              $updateServicio= \DB::table('servicios_contratados')
              ->where('id_brief','=',$request->id_brief)
              ->update([
                'fecha_comienzo' => $valorFechaComienzoBrief,
              ]);

              $Listservicios= \DB::table('servicios_contratados')
              ->join('servicios','servicios.id','=','servicios_contratados.id_servicio')
              ->select('servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
              ->where('servicios_contratados.id_brief','=',$request->id_brief)
              ->orderBy('servicios.nombre','ASC')
              ->get();

              \DB::commit();
              return response()->json($Listservicios, 200);

          }

      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salió mal, intente más tarde', 500);

      }

    }

    public function editServicio(Request $request, $id)
    {

      try {
        \DB::beginTransaction();

        $user= JWTAuth::parseToken()->authenticate();
        $jsonServicios= json_decode($request->arrayServicio);

        // FECHA COMIENZO
        if ($jsonServicios->fecha_comienzo) {
          $dateFechaComienzoBrief= date_create($jsonServicios->fecha_comienzo);
          $valorFechaComienzoBrief= date_format($dateFechaComienzoBrief, 'Y-m-d');
        }else{

          return response()->json('Debe ingresar la fecha de comienzo de gestión al brief', 400);

        }

        if ($jsonServicios->cantidad_mensual) {
          $cantidad_mensual= $jsonServicios->cantidad_mensual;
        }else{
          $cantidad_mensual= NULL;
        }

        $servicio= \DB::table('servicios_contratados')
        ->where('id','=',$jsonServicios->id)
        ->update([
          'cantidad_mensual' => $cantidad_mensual,
        ]);

        $updateServicio= \DB::table('servicios_contratados')
        ->where('id_brief','=',$jsonServicios->id_brief)
        ->update([
          'fecha_comienzo' => $valorFechaComienzoBrief,
        ]);

        $ListServicios= \DB::table('servicios_contratados')
        ->join('servicios','servicios.id','=','servicios_contratados.id_servicio')
        ->select('servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
        ->where('servicios_contratados.id_brief','=',$id)
        ->orderBy('servicios.nombre','ASC')
        ->get();

        \DB::commit();
        return response()->json($ListServicios, 200);


      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salió mal, intente más tarde', 500);

      }

    }

    public function deleteServicio($id)
    {
      try {
          \DB::beginTransaction();

          $servicio= \DB::table('servicios_contratados')
            ->where('id','=',$id)
            ->delete();

          $servicios= \DB::table('servicios_contratados')
            ->join('servicios','servicios.id','=','servicios_contratados.id_servicio')
            ->select('servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
            ->where('servicios_contratados.id_brief','=',$id)
            ->orderBy('servicios.nombre','ASC')
            ->get();

          \DB::commit();
          return response()->json($servicios, 200);

      } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);

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
        try {
          \DB::beginTransaction();

          $brief= Brief::FindOrFail($id);
          $brief->eliminado = 1;
          $brief->save();

          \DB::commit();
          return response()->json("ok", 200);

        } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);

        }

    }
}
