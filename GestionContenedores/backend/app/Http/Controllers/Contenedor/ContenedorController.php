<?php

namespace App\Http\Controllers\Contenedor;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Contenedor;
use App\ContenedorSize;
use App\ContenedorTipo;
use App\Clientes;
use App\Transportista;
use App\Terminales;
use App\Operadores;
use App\Depositos;
use App\Bookings;
use App\buqueSalida;
use App\logContenedores;


class ContenedorController extends ApiController
{
/*    try{

             \DB::beginTransaction();
             //proceso


             \DB::commit();

             //retorno

        }catch(Exception $e){
            //exepcion

                \DB::rollBack();
                
                Log::critical('Error en la ejecucion de listar '. $e);

                return response()->json('Algo salio mal, intente mas tarde ', 500);
 }*/
    public function editar(Request $request){
        

        try{

             \DB::beginTransaction();
             //proceso
             $contenedor =  Contenedor::find($request->id);

             $log = new logContenedores;
             if($contenedor->codigo != $request->codigo){


                $log->codigo = $request->codigo;
                
                }


             if($contenedor->size != $request->size){


                $log->size = $request->size;
                
                }


             if($contenedor->tipo != $request->tipo){


                $log->tipo = $request->tipo;
                
                }


             if($contenedor->estado != $request->estado){


                $log->estado = $request->estado;
                
                }


             if($contenedor->bloqueado != $request->bloqueado){


                $log->bloqueado = $request->bloqueado;
                
                }




             $contenedor->codigo = $request->codigo;
             $contenedor->size = $request->size ;
             $contenedor->tipo = $request->tipo;
             $contenedor->estado = $request->estado;
             $contenedor->bloqueado = $request->bloqueado;

             $contenedor->save();


             \DB::commit();

             //retorno
             return response()->json("El contenedor ha sido editado correctamente",200);
        }catch(Exception $e){
            //exepcion

                \DB::rollBack();
                
                Log::critical('Error en la edicion de contenedor '. $e);

                return response()->json('Algo salio mal, intente mas tarde ', 500);
            }
    

    }

     public function log(Request $request)
    {
        $logCont = logContenedores::leftjoin('users', 'logcontenedor.usuario', '=', 'users.id')
                                ->where('contenedor',$request->id)
                                ->select('logcontenedor.*', 'users.name as username', 'users.email as userMail')
                                ->orderBy('logcontenedor.fecha', 'desc')
                                ->get();


        return response()->json(compact("logCont"),200);
    }


    public function index(Request $request)
    {
    	
        $Contenedor = Contenedor::leftjoin('depositos', 'contenedors.deposito_id', '=', 'depositos.id')
		        				->select('contenedors.*', 'depositos.nombre as nombreDeposito')
		        				->get();

        return $this->showAllNouser($Contenedor);
    }

    public function listar(Request $request)
    {
   /* $consulta['EGRESO']=false;
    $consulta['INGRESO']=false;
    $consulta['REMISION']=false;
    foreach ($request->query() as $query => $value) {
            if (!empty($value)) {
                $consulta[$query] = $value;
            }
        }*/
    try{

         \DB::beginTransaction();


        $Contenedor = Contenedor::leftjoin('depositos', 'contenedors.deposito_id', '=', 'depositos.id')  						
		        				->select('contenedors.*','depositos.nombre as nombreDeposito')
		        				->get();
                                
		$arrTipos = ContenedorTipo::join('contenedor_sizes', 'contenedor_tipos.size_id', '=', 'contenedor_sizes.id')
                                ->select('contenedor_tipos.tipo','contenedor_sizes.size as size')
		        				->get();
                                
        $Cliente = Clientes::select('nombre','direccion')
                            ->get();

        $Transportista = Transportista::select('nombre','patente','documento','patente_semi','empresa')
                                        ->get();
        $Terminales = Terminales::select('nombre')->get();   

        $Operadores = Operadores::select('nombre')->get();                              

        $Depositos = Depositos::select('nombre')->get();

         $Bookings = Bookings::where('bookings.limite_contenedores','>=','bookings.cantidad_egresos')->get();

        $buques = buqueSalida::select('nombre')->get();

        $Tipos = array();

        foreach($arrTipos as $key => $item)
        {
           $Tipos[$item['size']][] = $item['tipo'];
        }

         \DB::commit();
        return response()->json(compact('Contenedor','Tipos', 'Cliente','Transportista','Terminales', 'Operadores','Depositos','Bookings','buques'));

    }catch(Exception $e){


            \DB::rollBack();
            
            Log::critical('Error en la ejecucion de listar '. $e);

            return response()->json('Algo salio mal, intente mas tarde ', 500);
        }
    }
}
