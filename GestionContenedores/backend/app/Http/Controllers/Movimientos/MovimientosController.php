<?php

namespace App\Http\Controllers\Movimientos;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Movimiento;
use Carbon\Carbon;
use App\Contenedor;
use App\Clientes;
use App\Transportista;
use App\Depositos;
use App\buqueSalida;
use App\Bookings;
use App\logBookings;
use App\logContenedores;

class MovimientosController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $consulta = [];
        $consulta['desde']=0;
        $consulta['hasta']=0;
        
        //los asigno
        foreach ($request->query() as $query => $value) {
            if (!empty($value)) {
                $consulta[$query] = $value;
            }
        }
        
        
        $Movimientos = Movimiento::when($consulta['desde'], function ($query) use ($consulta) {
                                return $query->where("fecha_movimiento", ">=",$consulta['desde']);
                            })
                        ->when($consulta['hasta'], function ($query) use ($consulta) {
                                return $query->where("fecha_movimiento", "<=",$consulta['hasta']);
                            })
                        ->orderBy('fecha_movimiento', 'desc')
                        ->get();

        return $this->showAllNouser($Movimientos);
    }


    public function store(Request $request)
    {

 /*******************************************************************************************************/
 /*******************************************************************************************************/
 /******ASIGNACION DE VARIABLES Y CREACION DE $CONSULTA CON LA INFO**************************************/
 /*****************QUE VOY A NECESITAR PARA GRABAR*******************************************************/
 /*******************************************************************************************************/

try{

    $consulta = [];

    $currentUser = $request->user();
    
    $Contenedor = Contenedor::where('codigo',$request->InputContenedor)->get();
    $logDeBooking = new logBookings;
    $logDeContenedor = new logContenedores;
    $logDeBooking->usuario = $currentUser->id;
    $logDeContenedor->usuario=$currentUser->id;

    if ($request->tipoAccion == 'INGRESO') {
            
            $reglas = [                       
                'InputCliente' =>'required',
                'InputContenedor' =>'required',
                'InputSizes' =>'required',
                'InputPatente' =>'required',
                'inputTipo' =>'required',
                'inputEstado' =>'required',
                'inputTerminal' =>'required',
                'inputOperador' =>'required',
                'inputDeposito' =>'required',
                'inputDocumento' =>'required',
                'inputNombre' =>'required',
                'inputPatente_semi' =>'required',
                'inputEmpresa' =>'required'
            ];

            $this->validate($request, $reglas);

            //Si es un ingreso voy a tener que vaciar estos campos
            $consulta['inputObs'] = "";
            $consulta['Inputbuque'] = NULL;
            $consulta['inputDireccion'] = "";
            $consulta['inputBooking'] = NULL;
            $logDeBooking->accion = "INGRESO";
            $logDeContenedor->accion="INGRESO";
            //Si es un ingreso tengo que validar en caso que exista el contenedor que esté en algún depósito.-
            if (!empty($Contenedor->all())) {
                $bloqueado = $Contenedor->first()->bloqueado;
                if (!empty($Contenedor->first()->deposito_id)) {

                    $Deposito = Depositos::find($Contenedor->first()->deposito_id)->nombre;

                    return response()->json('El contenedor que intentas ingresar se encuentra '. $bloqueado .' en el deposito '.$Deposito, 480);
                
                }else if ($bloqueado == 'Bloqueado') {
                    return response()->json('El contenedor que intentas ingresar se encuentra bloqueado. ', 480);
                }
                
           }

        

        }else if($request->tipoAccion == 'REMISION'){

            $reglas = [                       
                'inputOperador' =>'required',
                'InputSizes' =>'required',
                'inputTipo' =>'required',
                'InputContenedor' =>'required',
                'inputTerminal' =>'required',
                'InputPatente' =>'required',
                'inputDocumento' =>'required',
                'inputNombre' =>'required',
                'inputEmpresa' =>'required',
                'inputPatente_semi' =>'required'
            ];
         
         $this->validate($request, $reglas);

            if (empty($Contenedor->first()->deposito_id)) {
                    return response()->json('El contenedor que intentas remitir no existe en el deposito', 480);
                
           }else if (!empty($Contenedor->first()->deposito_id)) {
                $bloqueado = $Contenedor->first()->bloqueado;
                    if ($bloqueado == 'Bloqueado') {
                        # code...
                        return response()->json('El contenedor que intentas remitir se encuentra bloqueado.', 480);
                    }

            }
            $logDeBooking->accion = "REMISION";
            $logDeContenedor->accion="REMISION";
            $consulta['inputDeposito'] = Depositos::find($Contenedor->first()->deposito_id)->nombre;
            $consulta['inputObs'] = "";
            $consulta['InputCliente'] =NULL;
            $consulta['Inputbuque'] = NULL;
            $consulta['inputDireccion'] = NULL;
            $consulta['inputBooking'] = NULL;
            $consulta['inputEstado'] = $Contenedor->first()->estado;

       

        }else if($request->tipoAccion == 'EGRESO'){
            $reglas = [                       
                'InputCliente' =>'required',
                'InputContenedor' =>'required',
                'InputPatente' =>'required',
                'InputSizes' =>'required',
                'Inputbuque' =>'required',
                'inputBooking' =>'required',
                'inputDireccion' =>'required',
                'inputDocumento' =>'required',
                'inputEmpresa' =>'required',
                'inputNombre' =>'required',
                'inputOperador' =>'required',
                'inputPatente_semi' =>'required',
                'inputLimite' =>'required',
                'inputTerminal' =>'required',
                'inputTipo' =>'required'
            ];

        $this->validate($request, $reglas);

            $logDeBooking->accion = "EGRESO";
            $logDeContenedor->accion="EGRESO";
            $Bookings = Bookings::where('codigo',$request->inputBooking)->get();

            if (empty($Contenedor->first()->deposito_id)) {
                    return response()->json('El contenedor que intentas egresar no existe en el deposito', 480);
                
            }else{
                
                $bloqueado = $Contenedor->first()->bloqueado;
                    if ($bloqueado == 'Bloqueado') {
                        # code...
                        return response()->json('El contenedor que intentas remitir se encuentra bloqueado.', 480);
                    }
               
            }
            if ($request->inputLimite>999) {
               return response()->json('La cantidad de Bookings no es valida', 480);
            }

            
        
            $consulta['inputDeposito'] = Depositos::find($Contenedor->first()->deposito_id)->nombre;
          
            $consulta['inputObs'] = "";
            $consulta['inputEstado'] = $Contenedor->first()->estado;

            
        }

        
        foreach ($request->input() as $query => $value) {
            if (!empty($value)) {
                $consulta[$query] = $value;
            }
        }

  }catch(Exception $e){


            \DB::rollBack();
            
            Log::critical('Error en la creacion de variables '. $e);

            return response()->json('Algo salio mal, intente mas tarde ', 500);
}
try{

         \DB::beginTransaction();

 /**************************VERIFICAR Y *****************************************************************/
 /***********************CREAR SI NO EXISTE EL CLIENTE **************************************************/
 /**********************--------SECCION CLIENTES---------************************************************/
 /*******************************************************************************************************/
 /*******************************************************************************************************/
        if($request->tipoAccion != 'REMISION') {

         //si no es una remision verifico el usuario

         $cliente = Clientes::where('nombre',$consulta['InputCliente'])->get();
         //si esta vacia la consulta es porque el cliente no existe, por lo tanto lo creo.-
         if (empty($cliente->all())) {
                
            $clienteNuevo = Clientes::create([
                'direccion'=> $consulta['inputDireccion'],
                'nombre'=> $consulta['InputCliente'],
                ]);
         }else if(!empty($consulta['inputDireccion']) and $consulta['inputDireccion']!=$cliente->first()->direccion){
            $cliente->first()->direccion = $consulta['inputDireccion'];
            $cliente->first()->save();
         }

        }

 /*******************************************************************************************************/
 /*******************************************************************************************************/
 /******************************SECCION BOOKINNG*********************************************************/
 /*******************************************************************************************************/
 /*******************************************************************************************************/
  //TANTO BOOKING COMO LOS BUQUES SON EXCLUSIVOS DEL EGRESO, POR LO QUE INICIO EL IF EGRESO ACA Y TERMINA
 //AL FINAL DEL BUQUE
    
    $logDeBooking->fecha = Carbon::now('America/Argentina/Buenos_Aires');
    $logDeContenedor->fecha = Carbon::now('America/Argentina/Buenos_Aires');
    
    if($request->tipoAccion == 'EGRESO') {
        if (!empty($Bookings->all())) {
                
                $Bookings->first()->cantidad_egresos = $Bookings->first()->cantidad_egresos + 1;

                $Bookings->first()->save();

         }else{
            $logDeBooking->accion = $logDeBooking->accion . " | CREACION";
            
            $BookingNuevo = Bookings::create([
                'codigo'=> $consulta['inputBooking'],
                'cantidad_egresos'=> 1,
                'limite_contenedores'=> $consulta['inputLimite'],
                ]);

         }

/*******************************************************************************************************/
 /*******************************************************************************************************/
 /******************************SECCION BUQUE DE SALIDA *************************************************/
 /*******************************************************************************************************/
 /*******************************************************************************************************/

        $buqueDeSalida = buqueSalida::where('nombre',$consulta['Inputbuque'])->get();
        if (empty($buqueDeSalida->all())) {
                
            $buqueDeSalidaNuevo = buqueSalida::create([
                'nombre'=> $consulta['Inputbuque'],
                ]);
         }
    }
 

    
 /*******************************************************************************************************/
 /**********************BUSCAR CONTENEDOR Y CREAR SI NO EXISTE*******************************************/
 /******************************SECCION CONTENEDORES*****************************************************/
 /*******************************************************************************************************/
 /*******************************************************************************************************/

            
        $Deposito = Depositos::where('nombre',$consulta['inputDeposito'])->get();
            
        $idDeposito = $Deposito->first()->id;

         //si esta vacia la consulta es porque el Contenedor no existe, por lo tanto lo creo.-
         if (empty($Contenedor->all())) {

            $logDeContenedor->accion= $logDeContenedor->accion . " | CREACION";

            $ContenedorNuevo = Contenedor::create([
                'codigo'=> $consulta['InputContenedor'],
                'size'=> $consulta['InputSizes'],
                'tipo'=> $consulta['inputTipo'],
                'estado'=> $consulta['inputEstado'],
                'fecha_ultimo_movimiento'=> Carbon::now('America/Argentina/Buenos_Aires'),
                'deposito_id' =>  $idDeposito,
                'bloqueado'=> 'Disponible',
                ]);

         }
         else{   
              if($request->tipoAccion != 'INGRESO') {

                $Contenedor->first()->deposito_id =  NULL;
                $Contenedor->first()->estado =  $consulta['inputEstado'];
                $Contenedor->first()->fecha_ultimo_movimiento =  Carbon::now('America/Argentina/Buenos_Aires');
                $Contenedor->first()->save(); 
              }else{
                $Contenedor->first()->deposito_id =  $idDeposito;
                $Contenedor->first()->estado =  $consulta['inputEstado'];
                $Contenedor->first()->fecha_ultimo_movimiento =  Carbon::now('America/Argentina/Buenos_Aires');
                $Contenedor->first()->save(); 
                
              }
         }

   
 /*******************************************************************************************************/
 /************************BUSCAR TRANSPORTISTA Y CREAR SI NO EXISTE*************************************/
 /******************************SECCION TRANSPORTISTAS***************************************************/
 /*******************************************************************************************************/
 /*******************************************************************************************************/
         $transportista = Transportista::where('patente',$consulta['InputPatente'])->get();

         //si esta vacia la consulta es porque el transportista no existe, por lo tanto lo creo.-
         if (empty($transportista->all())) {

            $transportistaNuevo = Transportista::create([
                'nombre'=>$consulta['inputNombre'],
                'patente'=>$consulta['InputPatente'],
                'documento'=>$consulta['inputDocumento'],
                'patente_semi'=>$consulta['inputPatente_semi'],
                'empresa'=>$consulta['inputEmpresa'],
                ]);

         }
         else{
            $transportista->first()->nombre =  $consulta['inputNombre'];
            $transportista->first()->documento =  $consulta['inputDocumento'];
            $transportista->first()->patente_semi =  $consulta['inputPatente_semi'];
            $transportista->first()->empresa =  $consulta['inputEmpresa'];
            $transportista->first()->save(); 
         }
 /*******************************************************************************************************/
 /*******************GRABA LOS DATOS COMO STRING SIN RELACIONES EN LA TABLA MOVIMIENTOS******************/
 /******************************SECCION CREAR Y GRABAR EL MOVIMIENTO EN LA BD ***************************/
 /*******************************************************************************************************/
 /*******************************************************************************************************/
        $movimiento = Movimiento::create([
            'fecha_movimiento'=> Carbon::now('America/Argentina/Buenos_Aires'),
            'tipo_movimiento'=> $consulta['tipoAccion'],
            
            'contenedor_codigo'=> $consulta['InputContenedor'],
            'contenedor_size'=> $consulta['InputSizes'],
            'contenedor_tipo'=> $consulta['inputTipo'],
            'contenedor_estado'=> $consulta['inputEstado'],
            
            'buque_salida'=> $consulta['Inputbuque'],
            'terminal_destino'=> $consulta['inputTerminal'],
            
            'cliente_direccion'=> $consulta['inputDireccion'],
            'cliente_razon_social'=> $consulta['InputCliente'],
            'deposito'=> $consulta['inputDeposito'],
            'booking_codigo'=> $consulta['inputBooking'],

            'transportista_nombre'=> $consulta['inputNombre'],
            'transportista_patente'=> $consulta['InputPatente'],
            'transportista_documento'=> $consulta['inputDocumento'],
            'transportista_patente_semi'=> $consulta['inputPatente_semi'],
            'transportista_empresa'=> $consulta['inputEmpresa'],

            'observaciones'=> $consulta['inputObs'],

            'perfil_cliente_id'=> $currentUser->id,
        ]);
/*FINAL DE GRABADO EN LOG*/
    $datoContenedor = Contenedor::where('codigo',$consulta['InputContenedor'])->get();
    $logDeContenedor->contenedor= $datoContenedor->pluck('id')->first();
    $logDeContenedor->descripcion= $logDeContenedor->accion . " " . $datoContenedor->pluck('codigo')->first() ." - " . $consulta['inputEstado'];
    $logDeContenedor->save();
    



    if ($consulta['tipoAccion']=='EGRESO') {
        $datoBooking = Bookings::where('codigo',$consulta['inputBooking'])->get();
        $logDeBooking->booking = $datoBooking->pluck('id')->first();
        
        $logDeBooking->contenedor = $datoContenedor->pluck('id')->first();

        $logDeBooking->descripcion = $logDeBooking->accion . " " .  $datoContenedor->pluck('codigo')->first() . " - " . $datoBooking->pluck('cantidad_egresos')->first() . "/" . $datoBooking->pluck('limite_contenedores')->first();
        
        $logDeBooking->save();
       
    }

        \DB::commit();

         return response()->json(['data' => 'Movimiento generado satisfactoriamente', 'code' => 200], 200);
         
  }catch(Exception $e){


            \DB::rollBack();
            
            Log::critical('Error en la ejecucion de guardado '. $e);

            return response()->json('Algo salio mal, intente mas tarde ', 500);
        }
    }

    
    public function show($id)
    {
        //
    }

   
    public function update(Request $request, $id)
    {
        //
    }

   
    public function destroy($id)
    {
        //
    }
}
