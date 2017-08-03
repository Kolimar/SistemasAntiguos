<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Estudio;
use App\PagoObraSocial;
use App\PagoParticular;
use App\PagoExtraObraSocial;
use App\PagoExtraParticular;

class EstudioController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(request $request)
    {

      // QUERY PARA FECHA
      if (($request->fecha_inicio && $request->fecha_inicio != " ") && ($request->fecha_final && $request->fecha_final != " ")) {

          $query1= "estudios.fecha BETWEEN '$request->fecha_inicio' AND '$request->fecha_final'";

      }else{

          $query1= "estudios.fecha LIKE '%$request->fecha_inicio%'";

      }

      // QUERY PARA HORA
      if ($request->hora && $request->hora != " ") {

          $query2= "AND estudios.hora LIKE '%$request->hora%'";

      }else{

          $query2= " ";

      }

      // QUERY PARA PACIENTE
      if ($request->paciente && $request->paciente != " ") {

          $query3= "AND pacientes.id = '$request->paciente'";

      }else{

          $query3= " ";

      }

      // QUERY PARA DOCTOR
      if ($request->doctor && $request->doctor != " ") {

          $query4= "AND doctores.id = '$request->doctor'";

      }else{

          $query4= " ";

      }

      // QUERY PARA OBSERVACIONES
      if ($request->observaciones && $request->observaciones != " ") {

          $query5= "AND estudios.observaciones LIKE '%$request->observaciones%'";

      }else{

          $query5= " ";

      }

      // QUERY PARA N FACTURA
      if ($request->factura && $request->factura != " ") {

          $query6= "AND estudios.n_factura LIKE '%$request->factura%'";

      }else{

          $query6= " ";

      }

      // QUERY PARA PRESTACION
      if ($request->prestacion && $request->prestacion != " ") {

          $query7= "AND prestaciones.id = '$request->prestacion'";

      }else{

          $query7= " ";

      }

      // ORDENAMIENTOS
      if ($request->fecha_ord) {
          $columna= 'fecha';
          $ord= $request->fecha_ord;
      }else{
          $columna= 'fecha';
          $ord= 'ASC';
      }

      // LIMITE
      $offset= ((int)$request->pagina) * 10;

      $estudios= Estudio::
        join('pacientes','pacientes.id','=','estudios.id_paciente')
        ->leftjoin('obras_sociales','obras_sociales.id','=','pacientes.id_obra_social')
        ->leftjoin('particulares','particulares.id','=','pacientes.id_particular')
        ->join('doctores','doctores.id','=','estudios.id_doctor')
        ->join('prestaciones','prestaciones.id','=','estudios.id_prestacion')
        ->selectRaw(\DB::raw(
          'estudios.*,
          DATE_FORMAT(estudios.fecha, "%d-%m-%Y") as fecha_export,
          doctores.id as id_doctor,
          doctores.nombres as nombre_doctor,
          doctores.apellidos as apellido_doctor,
          pacientes.id as id_paciente,
          pacientes.nombres as nombre_paciente,
          pacientes.apellidos as apellido_paciente,
          prestaciones.id as id_prestacion,
          prestaciones.nombre as nombre_prestacion,
          DATE_FORMAT(estudios.hora, "%h:%i:%p") as hora_view,
          obras_sociales.id as id_obra_social,
          obras_sociales.nombre as nombre_obra_social,
          particulares.id as id_particular,
          particulares.nombre as nombre_particular
          '
          ))
        ->whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . " " . $query5 . " " . $query6 . " " . $query7))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($estudios, 200);

    }

    // EXPORTAR A EXCEL
    public function exportExcel(request $request)
    {

      $arrayRequest= json_decode($request->array);
      if (count($arrayRequest) == 0) {

        return response()->json('No existen datos', 400);

      }else{

        \Excel::create('estudios_'.time().'', function($excel) use($arrayRequest) {
          $excel->sheet('Estudios', function($sheet) use($arrayRequest) {

            $sheet->setFontSize(12);
            $sheet->rows(array(
              array(
                'Fecha',
                'Hora',
                'Paciente',
                'Obra social / Particular',
                'Doctor',
                'Prestación',
                'Observaciones',
                'N° factura',
                'Precio del estudio',
                'Pagado',
                'Extra'
              ),
            ));

            $sumOS= 0;
            $sumPart= 0;

            foreach ($arrayRequest as $row) {
              $extra= 0;
              $estudios= Estudio::
                with('paciente.obraSocial')
                ->with('paciente.particular')
                ->with('doctor')
                ->with('prestacion')
                ->with('pagosObrasSociales.pagosExtrasObrasSociales')
                ->with('pagosParticulares.pagosExtrasParticulares')
                ->where('estudios.id','=',$row->id)
                ->first();

              if (count($estudios->paciente->obraSocial) > 0) {
                $os_part= $estudios->paciente->obraSocial->nombre;
                $pagado= $estudios->pagosObrasSociales[0]->pago;

                $sumOS= $sumOS + $estudios->pagosObrasSociales[0]->pago;
                foreach ($estudios->pagosObrassociales[0]->pagosExtrasObrasSociales as $pagoExtra) {
                  $sumPart= $sumPart + $pagoExtra->pago;

                  $extra= $extra + $pagoExtra->pago;
                }
              }

              if (count($estudios->paciente->particular) > 0) {
                $os_part= $estudios->paciente->particular->nombre;
                $pagado= $estudios->pagosParticulares[0]->pago;

                foreach ($estudios->pagosParticulares[0]->pagosExtrasParticulares as $pagoExtra) {
                  $sumPart= $sumPart + $pagoExtra->pago;

                  $extra= $extra + $pagoExtra->pago;
                }

                $sumPart= $sumPart + $estudios->pagosParticulares[0]->pago;
              }

              $sheet->rows(array(
                array(
                  $row->fecha_export,
                  $row->hora_view,
                  $estudios->paciente->nombres. " " .$estudios->paciente->apellidos,
                  $os_part,
                  $estudios->doctor->nombres. " " .$estudios->doctor->apellidos,
                  $estudios->prestacion->nombre,
                  $estudios->observaciones,
                  $estudios->n_factura,
                  $estudios->precio,
                  $pagado,
                  $extra
                ),
              ));

            }

            $sheet->rows(array(
              array('','','','','','','','')
            ));

            $sheet->rows(array(
              array('Total obra social', $sumOS),
              array('Total particular', $sumPart),
              array('Total', $sumOS + $sumPart)
            ));

          });
        })->export('xls');

      }

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

          JWTAuth::parseToken();
          $user = JWTAuth::parseToken()->authenticate();

          // GUARDAR ESTUDIO
          $date= date_create($request->fecha);
          $fecha= date_format($date, 'Y-m-d');

          $precio= str_replace(".", "", $request->precioSelected);

          $idEstudio = \DB::table('estudios')->insertGetId([
            'fecha' => $fecha,
            'hora' => $request->hora,
            'id_paciente' => $request->id_paciente,
            'id_doctor' => $request->id_doctor,
            'id_prestacion' => $request->id_prestacion,
            'observaciones' => $request->observaciones,
            'n_factura' => $request->n_factura,
            'precio' => $precio,
            'created_at' => Carbon::now('America/Argentina/Buenos_Aires'),
            'created_by' => $user->id
          ]);

          // SI ES PARTICULAR
          if ($request->tipo== 'particular') {
            $pago= new PagoParticular($request->all());
            $pago->id_particular= $request->idSelected;
            $pago->pago= str_replace(".", "", $request->pago);
            $pago->fecha= Carbon::now('America/Argentina/Buenos_Aires');
            $pago->id_estudio= $idEstudio;
            $pago->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $pago->created_by= $user->id;
            $pago->save();

          // SI ES OBRA SOCIAL
          }elseif($request->tipo== 'os'){
            $pago= new PagoObraSocial($request->all());
            $pago->id_obra_social= $request->idSelected;
            $pago->pago= str_replace(".", "", $request->pago);
            $pago->fecha= Carbon::now('America/Argentina/Buenos_Aires');
            $pago->id_estudio= $idEstudio;
            $pago->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $pago->created_by= $user->id;
            $pago->save();
          }

          \DB::commit();
          return response()->json('Registro ok', 201);

      }catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
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
        //
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

          $date= date_create($request->fecha);
          $fecha= date_format($date, 'Y-m-d');

          $estudio= Estudio::FindOrFail($id);
          $estudio->fecha= $fecha;
          $estudio->hora= $request->hora;
          $estudio->id_doctor= $request->id_doctor;
          $estudio->n_factura= $request->n_factura;
          $estudio->observaciones= $request->observaciones;
          $estudio->save();

          $estudios= Estudio::
            join('pacientes','pacientes.id','=','estudios.id_paciente')
            ->join('doctores','doctores.id','=','estudios.id_doctor')
            ->join('prestaciones','prestaciones.id','=','estudios.id_prestacion')
            ->selectRaw(\DB::raw(
              'estudios.*,
              DATE_FORMAT(estudios.fecha, "%d-%m-%Y") as fecha_export,
              doctores.id as id_doctor,
              doctores.nombres as nombre_doctor,
              doctores.apellidos as apellido_doctor,
              pacientes.id as id_paciente,
              pacientes.nombres as nombre_paciente,
              pacientes.apellidos as apellido_paciente,
              prestaciones.id as id_prestacion,
              prestaciones.nombre as nombre_prestacion,
              DATE_FORMAT(estudios.hora, "%h:%i:%p") as hora_view
              '
              ))
            ->where('estudios.id','=',$id)
            ->get();

          \DB::commit();
          return response()->json($estudios, 200);

      }catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
      }

    }

    // CARGAR PAGOS
    public function getPagos($id)
    {

       $pagos= Estudio::
        with('pagosObrasSociales.pagosExtrasObrasSociales')
        ->with('pagosParticulares.pagosExtrasParticulares')
        ->where('estudios.id','=',$id)
        ->first();

       return response()->json($pagos, 200);

    }

    // AGREGAR PAGOS
    public function addPago(Request $request)
    {

      try {
        \DB::beginTransaction();

        JWTAuth::parseToken();
        $user = JWTAuth::parseToken()->authenticate();

        // SI ES PARTICULAR
        if ($request->tipo== 'particular') {
          $pago= new PagoExtraParticular($request->all());
          $pago->pago= str_replace(".", "", $request->monto);
          $pago->fecha= Carbon::now('America/Argentina/Buenos_Aires');
          $pago->id_pago_particular= $request->id_tipo;
          $pago->created_at= Carbon::now('America/Argentina/Buenos_Aires');
          $pago->created_by= $user->id;
          $pago->save();

        // SI ES OBRA SOCIAL
        }elseif($request->tipo== 'os'){
          $pago= new PagoExtraObraSocial($request->all());
          $pago->pago= str_replace(".", "", $request->monto);
          $pago->fecha= Carbon::now('America/Argentina/Buenos_Aires');
          $pago->id_pago_os= $request->id_tipo;
          $pago->created_at= Carbon::now('America/Argentina/Buenos_Aires');
          $pago->created_by= $user->id;
          $pago->save();
        }

        \DB::commit();
        $pagos= $this->getPagos($request->id_estudio);
        return $pagos;

      } catch (Exception $e) {
        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salió mal, intente más tarde', 500);
      }

    }

    // EDITAR PAGOS
    public function editPago(Request $request, $id)
    {

      try {
        \DB::beginTransaction();

        if ($request->monto) {
          $currency= str_replace(".", "", $request->monto);

          if ($request->tipo== 'particular') {

            $pago= PagoExtraParticular::find($id);
            $pago->pago= $currency;
            $pago->save();

            \DB::commit();
            $pagos= $this->getPagos($request->id_estudio);
            return $pagos;

          }

          if ($request->tipo== 'os') {

            $pago= PagoExtraObraSocial::find($id);
            $pago->pago= $currency;
            $pago->save();

            \DB::commit();
            $pagos= $this->getPagos($request->id_estudio);
            return $pagos;

          }

        }else{
          return response()->json("Debe ingresar un monto", 409);
        }

      } catch (Exception $e) {
        \DB::rollBack();
        Log::critical('No se pudo completal la acción: ' .$e);
        return response()->json('Algo salió mal, intente más tarde', 500);
      }

    }

    // ELIMINAR PAGOS
    public function deletePago(Request $request, $id)
    {

      try {
        \DB::beginTransaction();

        if ($request->tipo== 'particular') {

          $pago= PagoExtraParticular::find($id);
          $pago->delete();

          \DB::commit();
          $pagos= $this->getPagos($request->id_estudio);
          return $pagos;

        }

        if ($request->tipo== 'os') {

          $pago= PagoExtraObraSocial::find($id);
          $pago->delete();

          \DB::commit();
          $pagos= $this->getPagos($request->id_estudio);
          return $pagos;

        }

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
        //
    }
}
