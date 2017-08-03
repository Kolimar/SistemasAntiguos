<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Cliente;
use App\RolContactoCliente;
use App\Servicio;
use App\ContactoCliente;
use App\Puesto;
use App\FormaPago;
use App\TipoEmpresa;
use App\MetodoFacturacion;
use App\TipoVenta;
use App\TipoTelefonoCliente;
use App\Brief;
use App\User;
use App\Log;
use App\CanalAdquisicion;
use Carbon\Carbon;
use App\WorkflowIngresoCliente;
use App\WorkflowServicio;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Traits\GlobalTrait;

class ClienteController extends Controller
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

          $query1= "clientes.nombre LIKE '%$request->nombre%'";

      }else{

          $query1= "clientes.nombre LIKE '%$request->nombre%'";

      }

      // QUERY PARA FECHA DE COMIENZO DE GESTION

      if ($request->fecha_comienzo && $request->fecha_comienzo != " ") {

          $query2= "AND clientes.fecha_comienzo LIKE '%$request->fecha_comienzo%'";

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

      if ($request->estado == "0") {

          $estado= 0;
          $query4= "AND clientes.estado = $estado";

      }elseif($request->estado == "1"){

          $estado= 1;
          $query4= "AND clientes.estado = $estado";

      }else{

          $query4 = "AND clientes.estado = 1";

      }

      // ORDENAMIENTOS
      if ($request->nombre_ord && $request->nombre_ord != " ") {

          $columna= 'clientes.nombre';
          $ord= $request->nombre_ord;

      }elseif($request->fecha_ord && $request->fecha_ord != " "){

          $columna= 'clientes.fecha_comienzo';
          $ord= $request->fecha_ord;

      }else{

          $columna= 'clientes.nombre';
          $ord= 'ASC';

      }

      // LIMITE
      $offset= ((int)$request->pagina) * 10;

      $listClientes= Cliente::
        leftjoin('users','users.id','=','clientes.pm_asignado')
        ->leftjoin('briefs','briefs.id_cliente','=','clientes.id')
        ->selectRaw(\DB::raw('
        clientes.id,
        clientes.nombre,
        DATE_FORMAT(clientes.fecha_comienzo, "%d-%m-%Y") as fecha_comienzo,
        users.nombres as nombres_pm,
        users.apellidos as apellidos_pm,
        clientes.estado,
        briefs.id as id_brief,
        briefs.nombre as nombre_brief
        '))
        ->whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4))
        ->orderBy($columna, $ord)
        ->offset($offset)
        ->limit(10)
        ->get();

      return response()->json($listClientes);

    }

    // QUERY PARA PANEL DE CLIENTES
    public function getPanelClientes(Request $request)
    {

      // QUERY PARA SI FILTRO POR CLIENTE
      if ($request->cliente && $request->cliente != " ") {
        $idCliente= "clientes.id = $request->cliente";
      }else{
        $idCliente= "clientes.nombre LIKE '%$request->cliente%'";
      }

      // ORDENAMIENTOS
      if ($request->cliente_ord && $request->cliente_ord != " ") {

          $columna= 'clientes.nombre';
          $ord= $request->cliente_ord;

      }else{

          $columna= 'clientes.nombre';
          $ord= 'ASC';

      }

      // LIMITE
      $offset= ((int)$request->pagina) * 10;

      $clientes= Cliente::
        with(array('tareas' => function($query) {
            $query
              ->orderBy('fecha_limite','ASC')
              ->orderBy('fecha_ejecucion','ASC');
        }))
        ->with(array('logs' => function($query) {
            $query
              ->whereRaw(\DB::raw('(id_motivo = 1 OR id_motivo = 2)'))
              ->orderBy('fecha_hora','DESC');
        }))
        ->with('contactosClientes.telefonosContactos')
        ->with('contactosClientes.emailsContactos')
        ->with('contactosClientes.rolesContactos')
        ->with(array('servicios' => function($query) {
          $query
            ->where('habilitado','=',1)
            ->where('eliminado','=',0)
            ->orderBy('nombre','ASC');
        }))
        ->whereRaw(\DB::raw($idCliente))
        ->orderBy($columna, $ord)
        ->offset($offset)
        ->limit(10)
        ->get();

      return response()->json($clientes);

    }

    public function getListado()
    {

      $listadoClientes= Cliente::
          select('id','nombre','pm_asignado')
          ->orderBy('clientes.nombre','ASC')
          ->get();
      return response()->json($listadoClientes);

    }

    public function getListadoActivos()
    {

      $listadoClientes= Cliente::
          select('id','nombre','pm_asignado')
          ->orderBy('clientes.nombre','ASC')
          ->where('estado','=',1)
          ->get();
      return response()->json($listadoClientes);

    }

    public function getListadoFormasPago()
    {

      $listadoFormasPago= FormaPago::orderBy('nombre','ASC')->get();
      return response()->json($listadoFormasPago);

    }

    public function getListadoClientesServicios($id)
    {

      $clientesServicios= \DB::table('clientes_servicios_contratados')
          ->join('servicios','servicios.id','=','clientes_servicios_contratados.id_servicio')
          ->join('clientes','clientes.id','=','clientes_servicios_contratados.id_cliente')
          ->select('servicios.id as id_servicio','servicios.nombre as nombre_servicio')
          ->where('clientes_servicios_contratados.id_cliente','=',$id)
          ->get();

      return response()->json($clientesServicios);

    }

    public function getPmCliente($id){

      $pm_cliente= Cliente::
          select('id','pm_asignado','pm_asignado as user_asignado')
          ->where('clientes.id','=',$id)
          ->get();
      return response()->json($pm_cliente);

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
          $user= JWTAuth::parseToken()->authenticate();

          $jsonContactos= json_decode($request->arrayContacto);
          $jsonServicios= json_decode($request->arrayServicio);

          $dateFechaComienzoBrief= date_create($request->fecha_comienzo);
          $fecha_comienzo= date_format($dateFechaComienzoBrief, 'Y-m-d');

          $monto_abono= str_replace(".", "", $request->monto_abono);
          $presupuesto_invertir_publicidad= str_replace(".", "", $request->presupuesto_invertir_publicidad);

          //////////////// CLIENTES ///////////////
          // INSERTAR CLIENTES
          $idCliente= \DB::table('clientes')
          ->insertGetId([
            'nombre' => $request->nombre,
            'pm_asignado' => $request->pm_asignado,
            'fecha_comienzo' => $fecha_comienzo,
            'fecha_primera_reunion' => NULL,
            'monto_abono' => $monto_abono,
            'presupuesto_invertir_publicidad' => $presupuesto_invertir_publicidad,
            'id_metodo_facturacion' => $request->id_metodo_facturacion,
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

          /////////// BRIEFS //////////////////////
          // INSERTAR BRIEF
          $idBrief= \DB::table('briefs')
          ->insertGetId([
            'nombre' => $request->nombre,
            'pm_asignado' => $request->pm_asignado,
            'fecha_comienzo' => $fecha_comienzo,
            'monto_abono' => $monto_abono,
            'presupuesto_invertir_publicidad' => $presupuesto_invertir_publicidad,
            'id_metodo_facturacion' => $request->id_metodo_facturacion,
            'estado' => 'Borrador',
            'eliminado' => 0,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
            'id_cliente' => $idCliente
          ]);

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

      $cliente= Cliente::
        leftjoin('users','users.id','=','clientes.pm_asignado')
        ->select('clientes.*','users.id as id_pm','users.nombres as nombres_pm','users.apellidos as apellidos_pm')
        ->where('clientes.id','=',$id)
        ->get();

      $contactos= \DB::table('contactos_clientes')
        ->join('clientes_contactos','clientes_contactos.id_contacto_cliente','=','contactos_clientes.id')
        ->select('contactos_clientes.*')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->where('contactos_clientes.eliminado','=',0)
        ->orderBy('contactos_clientes.es_principal',1)
        ->orderBy('contactos_clientes.nombre','ASC')
        ->get();

      $emailsContactos= \DB::table('clientes_contactos')
        ->join('contactos_clientes','contactos_clientes.id','=','clientes_contactos.id_contacto_cliente')
        ->join('emails_contactos_clientes','emails_contactos_clientes.id_contacto_cliente','=','contactos_clientes.id')
        ->select('emails_contactos_clientes.id','emails_contactos_clientes.email','contactos_clientes.id as id_contacto')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->get();

      $telefonosContactos= \DB::table('clientes_contactos')
        ->join('contactos_clientes','contactos_clientes.id','=','clientes_contactos.id_contacto_cliente')
        ->join('telefonos_contactos_clientes','telefonos_contactos_clientes.id_contacto_cliente','=','contactos_clientes.id')
        ->join('tipos_telefonos','tipos_telefonos.id','=','telefonos_contactos_clientes.id_tipo_telefono')
        ->select('telefonos_contactos_clientes.id','telefonos_contactos_clientes.telefono','telefonos_contactos_clientes.id_tipo_telefono','tipos_telefonos.nombre as nombre_tipo_telefono','contactos_clientes.id as id_contacto')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->get();

      $rolesContactos= \DB::table('clientes_contactos')
        ->join('contactos_clientes','contactos_clientes.id','=','clientes_contactos.id_contacto_cliente')
        ->join('contactos_clientes_roles','contactos_clientes_roles.id_contacto_cliente','=','contactos_clientes.id')
        ->join('roles_contactos','roles_contactos.id','=','contactos_clientes_roles.id_rol_contacto')
        ->select('roles_contactos.id','roles_contactos.nombre','contactos_clientes.id as id_contacto')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->get();

      $tiposEmpresas= \DB::table('clientes_tipos_empresas')
        ->join('tipos_empresas','tipos_empresas.id','=','clientes_tipos_empresas.id_tipo_empresa')
        ->select('tipos_empresas.id')
        ->where('clientes_tipos_empresas.id_cliente','=',$id)
        ->get();

      $tiposVentas= \DB::table('clientes_tipos_ventas')
        ->join('tipos_ventas','tipos_ventas.id','=','clientes_tipos_ventas.id_tipo_venta')
        ->select('tipos_ventas.id')
        ->where('clientes_tipos_ventas.id_cliente','=',$id)
        ->get();

      $canalesAdquisicion= \DB::table('clientes_canales_adquisicion')
        ->join('canales_adquisicion','canales_adquisicion.id','=','clientes_canales_adquisicion.id_canal_adquisicion')
        ->select('canales_adquisicion.id')
        ->where('clientes_canales_adquisicion.id_cliente','=',$id)
        ->get();

      $servicios= \DB::table('clientes_servicios_contratados')
        ->join('servicios','servicios.id','=','clientes_servicios_contratados.id_servicio')
        ->select('clientes_servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
        ->where('clientes_servicios_contratados.id_cliente','=',$id)
        ->where('clientes_servicios_contratados.eliminado','=',0)
        ->orderBy('servicios.nombre','ASC')
        ->get();

      $briefs= Cliente::
        join('briefs_primera_reunion_cliente','briefs_primera_reunion_cliente.id_cliente','=','clientes.id')
        ->select('briefs_primera_reunion_cliente.*')
        ->where('clientes.id','=',$id)
        ->get();

      return response()->json(compact('cliente','contactos','emailsContactos','telefonosContactos','rolesContactos','tiposEmpresas','tiposVentas','canalesAdquisicion','servicios','briefs'), 200);

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
          $campo= $request->campo;
          $valorCampo= $request->valorCampo;

          if ($campo == 'id_tipo_empresa') {

              // ARRAY TIPO EMPRESA
              $jsonTiposEmpresa= json_decode($valorCampo);
              $deleteTiposEmpresas= \DB::table('clientes_tipos_empresas')->where('id_cliente','=',$id)->delete();
              foreach ($jsonTiposEmpresa as $tipoEmpresa) {
                $tipoEmpresaBrief= \DB::table('clientes_tipos_empresas')
                ->insert([
                  'id_cliente' => $id,
                  'id_tipo_empresa' => $tipoEmpresa,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
              }

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

          }else if ($campo == 'id_tipo_venta') {

              // ARRAY TIPO VENTA
              $jsonTiposVenta= json_decode($valorCampo);
              $deleteTiposVenta= \DB::table('clientes_tipos_ventas')->where('id_cliente','=',$id)->delete();
              foreach ($jsonTiposVenta as $tipoVenta) {
                $tipoVentaBrief= \DB::table('clientes_tipos_ventas')
                ->insert([
                  'id_cliente' => $id,
                  'id_tipo_venta' => $tipoVenta,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
              }

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

          }else if ($campo == 'id_canal_adquisicion') {

              // ARRAY CANAL ADQUISICION
              $jsonCanalesAdquisicion= json_decode($valorCampo);
              $deleteCanalesAdquisicion= \DB::table('clientes_canales_adquisicion')->where('id_cliente','=',$id)->delete();
              foreach ($jsonCanalesAdquisicion as $canalAdquisicion) {
                $canalAdquisicionBrief= \DB::table('clientes_canales_adquisicion')
                ->insert([
                  'id_cliente' => $id,
                  'id_canal_adquisicion' => $canalAdquisicion,
                  'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
                  'created_by' => $user->id,
                ]);
              }

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

          }else{

            if ($campo == 'pm_asignado') {

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $valorCampo]);

              // SE REGISTRA EL LOG ALTA DE CLIENTE
              $nombrePm= User::find($valorCampo);
              Log::registrarLog($id, 12, "Se cambió project manager a $nombrePm->nombres $nombrePm->apellidos");

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }elseif ($campo == 'presupuesto_invertir_publicidad') {

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $valorCampo]);

              // SE REGISTRA EL LOG ALTA DE CLIENTE
              Log::registrarLog($id, 13, "Se cambió el presupuesto a invertir en publicidad a $valorCampo$");

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }elseif ($campo == 'contrato_firmado') {

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $valorCampo]);

              if ($valorCampo == true) {
                // SE REGISTRA EL LOG ALTA DE CLIENTE
                Log::registrarLog($id, 15, "Se firmó el contrato");
              }

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }elseif ($campo == 'quien_factura') {

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                if ($valorCampo == true) {
                  // SE REGISTRA EL LOG ALTA DE CLIENTE
                  Log::registrarLog($id, 16, "Se cambió quien factura a $valorCampo");
                }

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }elseif ($campo == 'etapa') {

                  \DB::table('clientes')
                    ->where('id', $id)
                    ->update([$campo => $valorCampo]);

                  if ($valorCampo == true) {
                    // SE REGISTRA EL LOG ALTA DE CLIENTE
                    Log::registrarLog($id, 18, "Se cambió la etapa $valorCampo");
                  }

                  \DB::commit();
                  $retornarData= $this->show($id);
                  return $retornarData;

              }elseif ($campo == 'objetivo_mensual') {

                  \DB::table('clientes')
                    ->where('id', $id)
                    ->update([$campo => $valorCampo]);

                  if ($valorCampo == true) {
                    // SE REGISTRA EL LOG ALTA DE CLIENTE
                    Log::registrarLog($id, 19, "se cambio el objetivo de consultas mensuales a $valorCampo");
                  }

                  \DB::commit();
                  $retornarData= $this->show($id);
                  return $retornarData;

              }elseif ($campo == 'fecha_comienzo') {

              $dateFechaComienzoBrief= date_create($valorCampo);
              $valorCampo= date_format($dateFechaComienzoBrief, 'Y-m-d');

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $valorCampo]);

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }else if ($campo == 'fecha_primera_reunion') {

              if ($valorCampo) {

                $dateFechaPrimeraReunion= date_create($valorCampo);
                $valorCampo= date_format($dateFechaPrimeraReunion, 'Y-m-d');

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }else if ($campo == 'fecha_baja') {

              if ($valorCampo) {

                $dateFechaBaja= date_create($valorCampo);
                $valorCampo= date_format($dateFechaBaja, 'Y-m-d');

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }elseif ($campo == 'monto_abono') {

              $monto= str_replace(".", "", $valorCampo);

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $monto]);

              // SE REGISTRA EL LOG ALTA DE CLIENTE
              Log::registrarLog($id, 11, "Se cambió el monto de abono a $valorCampo$");

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }elseif ($campo == 'presupuesto_invertir_publicidad') {

              $valorCampo= str_replace(".", "", $valorCampo);

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $valorCampo]);

              // SE REGISTRA EL LOG ALTA DE CLIENTE
              Log::registrarLog($id, 11, "Se cambió el monto de abono a $valorCampo");

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }elseif ($campo == 'scoring') {

              if ($valorCampo) {

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }else if($campo == 'id_metodo_facturacion'){

              if ($valorCampo) {

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                // SE REGISTRA EL LOG ALTA DE CLIENTE
                $nombreMetodo= MetodoFacturacion::find($valorCampo);
                Log::registrarLog($id, 14, "Se cambió el metodo de facturacion a $nombreMetodo->nombre");

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                // SE REGISTRA EL LOG ALTA DE CLIENTE
                Log::registrarLog($id, 15, "Se cambió el metodo de facturacion a Ninguno");

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }else if($campo == 'id_forma_pago'){

              if ($valorCampo) {

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                // SE REGISTRA EL LOG ALTA DE CLIENTE
                $nombrePago= FormaPago::find($valorCampo);
                Log::registrarLog($id, 17, "Se cambió la forma de pago a $nombrePago->nombre");

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                Log::registrarLog($id, 18, "Se cambió la forma de pago a Ninguna");
                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }else if($campo == 'cuit'){

              if ($valorCampo) {

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }else if($campo == 'puntaje_cliente'){

              if ($valorCampo) {

                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }else{

                $valorCampo= NULL;
                \DB::table('clientes')
                  ->where('id', $id)
                  ->update([$campo => $valorCampo]);

                \DB::commit();
                $retornarData= $this->show($id);
                return $retornarData;

              }

            }else{

              \DB::table('clientes')
                ->where('id', $id)
                ->update([$campo => $valorCampo]);

              \DB::commit();
              $retornarData= $this->show($id);
              return $retornarData;

            }

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
        $idContacto= \DB::table('contactos_clientes')
        ->insertGetId([
          'nombre' => $jsonContactos->nombre,
          'apellido' => $jsonContactos->apellido,
          'es_principal' => $jsonContactos->es_principal,
          'religion_judia' => $jsonContactos->religion_judia,
          'medio_contacto' => $jsonContactos->medio_contacto,
          'comentarios' => $jsonContactos->comentario_contacto,
          'eliminado' => 0,
          'created_by' => $user->id,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
        ]);

        // RELACIONAR CONTACTOS A CLIENTE
        $contactosToCliente= \DB::table('clientes_contactos')
        ->insert([
          'id_cliente' => $request->id_cliente,
          'id_contacto_cliente' => $idContacto,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => $user->id,
        ]);

        // ROLES DE CONTACTO
        foreach ($jsonContactos->roles as $rol) {
          $rolesCreate= \DB::table('contactos_clientes_roles')
          ->insert([
            'id_contacto_cliente' => $idContacto,
            'id_rol_contacto' => $rol->rol_contacto,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // EMAILS DE CONTACTO
        foreach ($jsonContactos->emails as $email) {
          $emailsCreate= \DB::table('emails_contactos_clientes')
          ->insert([
            'id_contacto_cliente' => $idContacto,
            'email' => $email->email,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // TELEFONOS DE CONTACTO
        foreach ($jsonContactos->telefonos as $telefono) {
            $telefonosCreate= \DB::table('telefonos_contactos_clientes')
            ->insert([
              'id_contacto_cliente' => $idContacto,
              'id_tipo_telefono' => $telefono->tipo_telefono,
              'telefono' => $telefono->telefono,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);
        }

        $retorno= $this->retornarData($request->id_cliente);

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
        $deleteContacto= ContactoCliente::find($jsonContactos->id)->delete();

        $idContacto= \DB::table('contactos_clientes')
        ->insertGetId([
          'nombre' => $jsonContactos->nombre,
          'apellido' => $jsonContactos->apellido,
          'es_principal' => $jsonContactos->es_principal,
          'religion_judia' => $jsonContactos->religion_judia,
          'medio_contacto' => $jsonContactos->medio_contacto,
          'comentarios' => $jsonContactos->comentario_contacto,
          'eliminado' => 0,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => $user->id,
        ]);

        // RELACIONAR CONTACTOS A CLIENTE
        $contactosToCliente= \DB::table('clientes_contactos')
        ->insert([
          'id_cliente' => $id,
          'id_contacto_cliente' => $idContacto,
          'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
          'created_by' => $user->id,
        ]);

        // ROLES DE CONTACTO
        foreach ($jsonContactos->roles as $rol) {
          $rolesCreate= \DB::table('contactos_clientes_roles')
          ->insert([
            'id_contacto_cliente' => $idContacto,
            'id_rol_contacto' => $rol->rol_contacto,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // EMAILS DE CONTACTO
        foreach ($jsonContactos->emails as $email) {
          $emailsCreate= \DB::table('emails_contactos_clientes')
          ->insert([
            'id_contacto_cliente' => $idContacto,
            'email' => $email->email,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id,
          ]);
        }

        // TELEFONOS DE CONTACTO
        foreach ($jsonContactos->telefonos as $telefono) {
          $telefonosCreate= \DB::table('telefonos_contactos_clientes')
          ->insert([
            'id_contacto_cliente' => $idContacto,
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

          $contacto= ContactoCliente::FindOrFail($id);
          $contacto->eliminado= 1;
          $contacto->save();

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

      $contactos= \DB::table('contactos_clientes')
        ->join('clientes_contactos','clientes_contactos.id_contacto_cliente','=','contactos_clientes.id')
        ->select('contactos_clientes.*')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->where('contactos_clientes.eliminado','=',0)
        ->orderBy('contactos_clientes.es_principal',1)
        ->orderBy('contactos_clientes.nombre','ASC')
        ->get();

      $emailsContactos= \DB::table('clientes_contactos')
        ->join('contactos_clientes','contactos_clientes.id','=','clientes_contactos.id_contacto_cliente')
        ->join('emails_contactos_clientes','emails_contactos_clientes.id_contacto_cliente','=','contactos_clientes.id')
        ->select('emails_contactos_clientes.id','emails_contactos_clientes.email','contactos_clientes.id as id_contacto')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->get();

      $telefonosContactos= \DB::table('clientes_contactos')
        ->join('contactos_clientes','contactos_clientes.id','=','clientes_contactos.id_contacto_cliente')
        ->join('telefonos_contactos_clientes','telefonos_contactos_clientes.id_contacto_cliente','=','contactos_clientes.id')
        ->join('tipos_telefonos','tipos_telefonos.id','=','telefonos_contactos_clientes.id_tipo_telefono')
        ->select('telefonos_contactos_clientes.id','telefonos_contactos_clientes.telefono','telefonos_contactos_clientes.id_tipo_telefono','tipos_telefonos.nombre as nombre_tipo_telefono','contactos_clientes.id as id_contacto')
        ->where('clientes_contactos.id_cliente','=',$id)
        ->get();

      $rolesContactos= \DB::table('clientes_contactos')
        ->join('contactos_clientes','contactos_clientes.id','=','clientes_contactos.id_contacto_cliente')
        ->join('contactos_clientes_roles','contactos_clientes_roles.id_contacto_cliente','=','contactos_clientes.id')
        ->join('roles_contactos','roles_contactos.id','=','contactos_clientes_roles.id_rol_contacto')
        ->select('roles_contactos.id','roles_contactos.nombre','contactos_clientes.id as id_contacto')
        ->where('clientes_contactos.id_cliente','=',$id)
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
          $dateFechaComienzoBrief= date_create($request->fecha_comienzo);
          $valorFechaComienzoBrief= date_format($dateFechaComienzoBrief, 'Y-m-d');

          if ($request->cantidad_mensual) {
            $cantidad_mensual= $request->cantidad_mensual;
          }else{
            $cantidad_mensual= NULL;
          }

          // VERIFICAR SI EXISTE UN SERVICIO IDENTIDO
          $verificarExistencia= \DB::table('clientes_servicios_contratados')
            ->where('id_servicio','=',$request->id_servicio)
            ->where('id_cliente','=',$request->id_cliente)
            ->where('eliminado','=',0)
            ->count();

          if ($verificarExistencia > 0) {

            return response()->json("El servicio seleccionado ya existe para el cliente", 409);

          }else{

            $servicio= \DB::table('clientes_servicios_contratados')
            ->insertGetId([
              'cantidad_mensual' => $cantidad_mensual,
              'fecha_comienzo' => $valorFechaComienzoBrief,
              'id_servicio' => $request->id_servicio,
              'id_cliente' => $request->id_cliente,
              'eliminado' => 0,
              'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
              'created_by' => $user->id,
            ]);

            // CREAR NUEVAS TAREAS DE SERVICIOS AGREGADOSS
            WorkflowServicio::nuevaTareaServicio($request->id_servicio, $request->id_cliente, $servicio);

            // SE REGISTRA EL LOG ALTA DE CLIENTE
            $nombreServicio= Servicio::find($request->id_servicio);
            Log::registrarLog($request->id_cliente, 10, "El cliente contrato el servicio $nombreServicio->nombre");

            $listServicios= \DB::table('clientes_servicios_contratados')
              ->join('servicios','servicios.id','=','clientes_servicios_contratados.id_servicio')
              ->select('clientes_servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
              ->where('clientes_servicios_contratados.id_cliente','=',$request->id_cliente)
              ->where('clientes_servicios_contratados.eliminado','=',0)
              ->orderBy('servicios.nombre','ASC')
              ->get();

            \DB::commit();
            return response()->json($listServicios, 200);

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

        if ($jsonServicios->cantidad_mensual) {
          $cantidad_mensual= $jsonServicios->cantidad_mensual;
        }else{
          $cantidad_mensual= NULL;
        }

        $servicio= \DB::table('clientes_servicios_contratados')
        ->where('id','=',$jsonServicios->id)
        ->update([
          'cantidad_mensual' => $cantidad_mensual,
        ]);

        $listServicios= \DB::table('clientes_servicios_contratados')
          ->join('servicios','servicios.id','=','clientes_servicios_contratados.id_servicio')
          ->select('clientes_servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
          ->where('clientes_servicios_contratados.id_cliente','=',$jsonServicios->id_cliente)
          ->where('clientes_servicios_contratados.eliminado','=',0)
          ->orderBy('servicios.nombre','ASC')
          ->get();

        // SE REGISTRA EL LOG ALTA DE CLIENTE
        $nombreServicio= Servicio::find($jsonServicios->id_servicio);
        Log::registrarLog($jsonServicios->id_cliente, 10, "Se modificó la cantidad mensual del servicio $nombreServicio->nombre a $cantidad_mensual");

        \DB::commit();
        return response()->json($listServicios, 200);

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

          $servicio= \DB::table('clientes_servicios_contratados')
            ->where('id','=',$id)
            ->update([
              'eliminado' => 1
            ]);

          $listServicios= \DB::table('clientes_servicios_contratados')
            ->join('servicios','servicios.id','=','clientes_servicios_contratados.id_servicio')
            ->select('clientes_servicios_contratados.*', 'servicios.id as id_servicio', 'servicios.nombre as nombre_servicio', 'servicios.es_recurrente as es_recurrente')
            ->where('clientes_servicios_contratados.id_cliente','=',$id)
            ->where('clientes_servicios_contratados.eliminado','=',0)
            ->orderBy('servicios.nombre','ASC')
            ->get();

          \DB::commit();
          return response()->json($listServicios, 200);

      } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);

      }
    }

    /// CONTRATO

    public function subirContrato($id)
    {

      try {
        \DB::beginTransaction();

        $ruta= "../public/contratos/";
        $archivo= $_FILES["archivo"];
        $tmp_name= $_FILES["archivo"]["tmp_name"];

        $path = $_FILES['archivo']['name'];
        $ext = pathinfo($path[0], PATHINFO_EXTENSION);

        if ($archivo) {

          $cliente= Cliente::find($id);
          $nombreArchivo= $id . "_" . $cliente->nombre . "_" . time() . "." . $ext;
          $textoSinCaracteres= GlobalTrait::eliminarCaracteresEspecialeString($nombreArchivo);
          move_uploaded_file($tmp_name[0], $ruta.$textoSinCaracteres);

          $cliente= Cliente::FindOrFail($id);
          $cliente->url_contrato= $ruta.$textoSinCaracteres;
          $cliente->save();

          \DB::commit();
          $retornarData= $this->show($id);
          return $retornarData;

        }else{

          return response()->json("No existe el archivo", 404);

        }

      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salió mal, intente más tarde', 500);

      }

    }

    public function descargarContrato($id)
    {
        $cliente= Cliente::find($id);
        $fichero = $cliente->url_contrato;
        $name= $cliente->nombre . "_" . time();

        if (file_exists($fichero)) {
            $finfo= finfo_open(FILEINFO_MIME);
            $content_type= finfo_file($finfo, $fichero);
            finfo_close($finfo);
            $file_name= basename($fichero).PHP_EOL;
            $size= filesize($fichero);

            $headers= array(
              "Content-Type" => $content_type,
              "Content-Disposition" => "attachment; filename=$file_name",
              "Content-Transfer" => "Encoding: binary",
              "Content-Length" => $size,
              "type" => $content_type
            );
            readfile($fichero);
            exit;
            return response()->download($fichero, $name, $headers);

        }else{

          return response()->json("No existen archivos para descargar");

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
      try {
        \DB::beginTransaction();

        $dateBaja= date_create($request->fecha_baja);
        $fechabaja= date_format($dateBaja, 'Y-m-d');

        $cliente= Cliente::FindOrFail($id);
        $cliente->fecha_baja = $fechabaja;
        $cliente->motivo_baja = $request->motivo_baja;
        $cliente->save();

        // SE REGISTRA EL LOG ALTA DE CLIENTE
        Log::registrarLog($id, 8, "Se dió de baja al cliente $cliente->nombre");

        \DB::commit();
        return response()->json("ok", 200);

      } catch (Exception $e) {

        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salió mal, intente más tarde', 500);

      }

    }
}
