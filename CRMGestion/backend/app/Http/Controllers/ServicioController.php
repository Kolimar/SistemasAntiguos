<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Servicio;

use Carbon\Carbon;

use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        // QUERY PARA TITULO

        if ($request->nombre && $request->nombre != " ") {

            $query1= "servicios.nombre LIKE '%$request->nombre%'";

        }else{

            $query1= "servicios.nombre LIKE '%$request->nombre%'";

        }

        // QUERY PARA DESCRIPCION

        if ($request->descripcion && $request->descripcion != " ") {

            $query2= "AND servicios.descripcion LIKE '%$request->descripcion%'";

        }else{

            $query2= "AND servicios.descripcion LIKE '%$request->descripcion%'";

        }

        // QUERY PARA ES RECURRENTE

        if ($request->es_recurrente == "0") {

            $es_recurrente= 0;
            $query3= "AND servicios.es_recurrente = $es_recurrente";

        }elseif ($request->es_recurrente == "1") {

            $es_recurrente= 1;
            $query3= "AND servicios.es_recurrente = $es_recurrente";

        }else{

            $query3= " ";
        }

        // QUERY PARA MONTO SUGERIDO

        $monto_sugerido= str_replace(",", ".", $request->monto_sugerido);

        if ($monto_sugerido && $monto_sugerido != " ") {

            $query4= "AND servicios.monto_sugerido LIKE '$monto_sugerido%'";

        }else{

            $query4= " ";

        }

        // QUERY PARA HABILITADO

        if ($request->habilitado == "0") {

            $habilitado= 0;
            $query5= "AND servicios.habilitado = $habilitado";


        }elseif ($request->habilitado == "1") {

            $habilitado= 1;
            $query5= "AND servicios.habilitado = $habilitado";

        }else{

            $query5= "AND servicios.habilitado = 1";
        }

        // ORDENAMIENTOS

        if ($request->nombre_ord) {

            $columna= 'nombre';
            $ord= $request->nombre_ord;

        }else{

            $columna= 'nombre';
            $ord= 'ASC';

        }

        // LIMITE

        $offset= ((int)$request->pagina) * 10;

        $servicios= \DB::table('servicios')
            ->select(\DB::raw('servicios.*, REPLACE(servicios.monto_sugerido, ".", ",") as monto'))
            ->whereRaw(\DB::raw($query1. " " .$query2. " " .$query3. " " .$query4. " " .$query5))
            ->orderBy($columna, $ord)
            ->offset($offset)
            ->limit(10)
            ->get();

        return response()->json($servicios);

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
            $nombre= Servicio::where('nombre','=',$request->nombre)->count('nombre');

            if($nombre >= 1){

                return response()->json('El nombre del servicio ya se encuentra registrado', 409);

            }else{
                $monto_sugerido= str_replace(".", "", $request->monto_sugerido);
                JWTAuth::parseToken();
                $user = JWTAuth::parseToken()->authenticate();

                if (empty($monto_sugerido)) {

                    $servicios= new Servicio($request->all());
                    $servicios->monto_sugerido= NULL;
                    $servicios->created_at= Carbon::now('America/Argentina/Buenos_Aires');
                    $servicios->created_by= $user->id;
                    $servicios->save();

                \DB::commit();
                return response()->json('Registro ok', 201);

                }else{

                    $servicios= new Servicio($request->all());
                    $servicios->monto_sugerido= $monto_sugerido;
                    $servicios->created_at= Carbon::now('America/Argentina/Buenos_Aires');
                    $servicios->created_by= $user->id;
                    $servicios->save();

                \DB::commit();
                return response()->json('Registro ok', 201);

                }

            }

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

            $servicios= Servicio::FindOrFail($id);
            $monto_sugerido= str_replace(".", "", $request->monto_sugerido);

            if (empty($monto_sugerido)) {

                $servicios->nombre= $request->nombre;
                $servicios->descripcion= $request->descripcion;
                $servicios->es_recurrente= $request->es_recurrente;
                $servicios->monto_sugerido= NULL;
                $servicios->habilitado= $request->habilitado;
                $servicios->save();

                $serviciosData= \DB::table('servicios')
                    ->select(\DB::raw('servicios.*, REPLACE(servicios.monto_sugerido, ".", ",") as monto'))
                    ->where('id','=',$id)
                    ->get();

                \DB::commit();
                return response()->json($serviciosData);

            }else{

                $servicios->nombre= $request->nombre;
                $servicios->descripcion= $request->descripcion;
                $servicios->es_recurrente= $request->es_recurrente;
                $servicios->monto_sugerido= $monto_sugerido;
                $servicios->habilitado= $request->habilitado;
                $servicios->save();

                $serviciosData= \DB::table('servicios')
                    ->select(\DB::raw('servicios.*, REPLACE(servicios.monto_sugerido, ".", ",") as monto'))
                    ->where('id','=',$id)
                    ->get();

                \DB::commit();
                return response()->json($serviciosData);

            }

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

            $servicio = Servicio::find($id);
            $servicio->habilitado= 0;
            $servicio->save();

            \DB::commit();
            return response()->json('Ok', 200);

        } catch (Exception $e) {

            \DB::rollBack();
            Log::critical('No se pudo completal la acción: ' .$e);
            return response()->json('Algo salió mal, intente más tarde', 500);

        }
    }
}
