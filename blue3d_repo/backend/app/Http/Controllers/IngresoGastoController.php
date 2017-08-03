<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\IngresoGasto;

class IngresoGastoController extends Controller
{

    public $arrayTotal= array();
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      // QUERY PARA FECHA
      if (($request->fecha_inicio && $request->fecha_inicio != " ") && ($request->fecha_final && $request->fecha_final != " ")) {

          $query1= "ingresos_gastos.fecha BETWEEN '$request->fecha_inicio' AND '$request->fecha_final'";

      }else{

          $query1= "ingresos_gastos.fecha LIKE '%$request->fecha_inicio%'";

      }

      // QUERY PARA MOTIVO
      if ($request->motivo && $request->motivo != " ") {

          $query2= "AND ingresos_gastos.motivo LIKE '%$request->motivo%'";

      }else{

          $query2= " ";

      }

      // QUERY PARA MONTO
      if ($request->monto && $request->monto != " ") {

          $query3= "AND ingresos_gastos.monto LIKE '%$request->monto%'";

      }else{

          $query3= " ";

      }

      // QUERY PARA DESCRIPCION
      if ($request->descripcion && $request->descripcion != " ") {

          $query4= "AND ingresos_gastos.descripcion LIKE '%$request->descripcion%'";

      }else{

          $query4= " ";

      }

      // QUERY PARA TIPO CAJA
      if ($request->tipo_caja && $request->tipo_caja != " ") {

          $query5= "AND ingresos_gastos.tipo_caja LIKE '%$request->tipo_caja%'";

      }else{

          $query5= " ";

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

      $ingresos= IngresoGasto::
        selectRaw(\DB::raw('
          ingresos_gastos.*,
          DATE_FORMAT(ingresos_gastos.fecha, "%d-%m-%Y") as fecha_export
        '))
        ->whereRaw(\DB::raw($query1 . " " . $query2 . " " . $query3 . " " . $query4 . " " . $query5))
        ->orderBy($columna,$ord)
        ->offset($offset)
        ->limit(10)
        ->get();

        return response()->json($ingresos, 200);

    }

    // EXPORTAR A EXCEL
    public function exportExcel(request $request)
    {

      $arrayRequest= json_decode($request->array);
      if (count($arrayRequest) == 0) {

        return response()->json('No existen datos', 400);

      }else{

        $sumTotal= 0;
        $sumTotalA= 0;
        $sumTotalB= 0;
        $array= array();
        foreach ($arrayRequest as $row) {

          $sumTotal= $row->monto + $sumTotal;

          if ($row->tipo_caja == "A") {
            $sumTotalA= $row->monto + $sumTotalA;
          }

          if ($row->tipo_caja == "B") {
            $sumTotalB= $row->monto + $sumTotalB;
          }

          array_push($array,
            array(
              'Fecha' => $row->fecha_export,
              'Motivo' => $row->motivo,
              'Monto' => $row->monto,
              'Descripción' => $row->descripcion,
              'Tipo de caja' => $row->tipo_caja,
            )
          );
        }

        \Excel::create('ingreso_de_gastos_'.time().'', function($excel) use($array, $sumTotal, $sumTotalA, $sumTotalB) {
          $excel->sheet('Ingreso de gastos', function($sheet) use($array, $sumTotal, $sumTotalA, $sumTotalB) {

            $sheet->setFontSize(12);
            $sheet->fromArray($array);

            $sheet->rows(array(
                array('', ''),
                array('Total Caja A', $sumTotalA),
                array('Total Caja B', $sumTotalB),
                array('Total', $sumTotal),
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

          $dateFecha= date_create($request->fecha);
          $fecha= date_format($dateFecha, 'Y-m-d');

          $monto= str_replace(".", "", $request->monto);

          $ingreso= new IngresoGasto($request->all());
          $ingreso->fecha= $fecha;
          $ingreso->monto= $monto;
          $ingreso->created_at= Carbon::now('America/Argentina/Buenos_Aires');
          $ingreso->created_by= $user->id;
          $ingreso->save();

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

          $dateFecha= date_create($request->fecha);
          $fecha= date_format($dateFecha, 'Y-m-d');

          $monto= str_replace(".", "", $request->monto);

          $ingreso= IngresoGasto::FindOrFail($id);
          $ingreso->fecha= $fecha;
          $ingreso->motivo= $request->motivo;
          $ingreso->monto= $monto;
          $ingreso->descripcion= $request->descripcion;
          $ingreso->tipo_caja= $request->tipo_caja;
          $ingreso->save();

          $ingresos= IngresoGasto::orderBy('fecha','ASC')->where('id','=',$id)->get();

          \DB::commit();
          return response()->json($ingresos, 200);

      }catch (Exception $e) {
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

          $ingreso= IngresoGasto::FindOrFail($id);
          $ingreso->delete();

          \DB::commit();
          return response()->json("ok", 200);

      }catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
      }

    }
}
