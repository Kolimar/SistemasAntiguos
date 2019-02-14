<?php

namespace App\Http\Controllers\Mediciones;

use App\Http\Controllers\ApiController;
use App\variable;
use Illuminate\Http\Request;
use App\dispositivo;
use App\medicion;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class MedicionesController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

      $historico = dispositivo::find($request->iotID)->with('variables')->get();

      return $this->showAllnouser($historico);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
      $toMail =  env('MAIL_NOTIFICACIONES', 'tec.solutions.network@gmail.com');

       try{

      //inicializo en 0 (false) cada instancia de la consulta que sirve para realizar los querys
      $post = [];

      $post['var1']= null;
      $post['var2']= null;
      $post['var3']= null;
      $post['var4']= null;
      $post['var5']= null;

      foreach ($request->all() as $query => $value) {

    if($value != ''){
           $post[$query] = $value;
    }

      }

      if ($request->token == '3odUw2kewV') {
        
      $post['dispositivo_id'] = $request->dispositivo_id;
     
      $dispositivo = dispositivo::find($post['dispositivo_id']);
      
      }else{
        return response()->json('Accion no autorizada');
      }


      


 if ($dispositivo->encendido) {


    \DB::beginTransaction();
      $nombreIOT = $dispositivo->nombre;
      //los asigno
      if ($post['var1'] != null) {
      $var1 = variable::where('dispositivo_id','=',$post['dispositivo_id'])
                                ->where('code','=','var1')
                                ->first();

      if ($var1!=null ) {
        if ($var1->status) {

          /////////////////////////////////////////////////////
          // acá valido si la medicion se encuentra en rango
          $in_range1 = $post['var1'] >= $var1->rango_minimo && $post['var1'] <= $var1->rango_maximo; 
          //si su "status" de estar o no en rango es igual al anterior no pasa nada, pero si es distinto se notifica.
          if ($in_range1!=$var1->unidad) {
            
            $var1->unidad = $in_range1;
            $nombreVariable = $var1->nombre;              

            if ($var1->unidad=='0') {
             

              $resultado = 'Fuera de rango. ';
              $medicion = $post['var1'] . ' , estando el mismo fuera del rango definido.';
              $medicion2 = 'Le informaremos nuevamente cuando el mismo vuelva a parámetros normales.';
              
              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;
             
              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
              

            }else if ($var1->unidad=='1'){

              $resultado = 'Métrica normalizada. ';
              $medicion = $post['var1'] . ', estando el mismo dentro del rango definido.';
              $medicion2 = '';

              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;

              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
            }
          
          }

          // FIN DEL ENVIO DE NOTIFICACION
          /////////////////////////////////////////////////////

          $var1->fecha_ultima_medicion = Carbon::now('America/Argentina/Buenos_Aires');
          $var1->ultima_medicion = $post['var1'];

          $var1->cantidad_mediciones = $var1->cantidad_mediciones + 1;      
          $var1->suma_mediciones = $var1->suma_mediciones + $post['var1'];  
          if ($var1->json!=null) {
            $var1->json = $var1->json . ',{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var1'] . '"}';
          }else{
            $var1->json = '{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var1'] . '"}';
          }      

          $var1->save();
        }
      }                        # code...


      }
      if ($post['var2']  != null) {
      $var2 = variable::where('dispositivo_id','=',$post['dispositivo_id'])
                                ->where('code','=','var2')
                                ->first();

      if ($var2!=null ) {
        if ($var2->status) {

           /////////////////////////////////////////////////////
          // acá valido si la medicion se encuentra en rango
          $in_range1 = $post['var2'] >= $var2->rango_minimo && $post['var2'] <= $var2->rango_maximo; 
          //si su "status" de estar o no en rango es igual al anterior no pasa nada, pero si es distinto se notifica.
          if ($in_range1!=$var2->unidad) {
            
            $var2->unidad = $in_range1;
            $nombreVariable = $var2->nombre;              

            if ($var2->unidad=='0') {
             

              $resultado = 'Fuera de rango. ';
              $medicion = $post['var2'] . ' , estando el mismo fuera del rango definido.';
              $medicion2 = 'Le informaremos nuevamente cuando el mismo vuelva a parámetros normales.';
              
              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;
             
              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
              

            }else if ($var2->unidad=='1'){

              $resultado = 'Métrica normalizada. ';
              $medicion = $post['var2'] . ', estando el mismo dentro del rango definido.';
              $medicion2 = '';

              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;

              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
            }
          
          }

          // FIN DEL ENVIO DE NOTIFICACION
          /////////////////////////////////////////////////////
          $var2->fecha_ultima_medicion = Carbon::now('America/Argentina/Buenos_Aires');
          $var2->ultima_medicion = $post['var2'];

          $var2->cantidad_mediciones = $var2->cantidad_mediciones + 1;      
          $var2->suma_mediciones = $var2->suma_mediciones + $post['var2'];  
          if ($var2->json!=null) {
            $var2->json = $var2->json . ',{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var2'] . '"}';
          }else{
            $var2->json = '{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var2'] . '"}';
          }               
          $var2->save();
        }
     }      
 }


      if ($post['var3']  != null) {
      $var3 = variable::where('dispositivo_id','=',$post['dispositivo_id'])
                                    ->where('code','=','var3')
                                    ->first();
      if ($var3!=null ) {
        if ($var3->status) {

           /////////////////////////////////////////////////////
          // acá valido si la medicion se encuentra en rango
          $in_range1 = $post['var3'] >= $var3->rango_minimo && $post['var3'] <= $var3->rango_maximo; 
          //si su "status" de estar o no en rango es igual al anterior no pasa nada, pero si es distinto se notifica.
          if ($in_range1!=$var3->unidad) {
            
            $var3->unidad = $in_range1;
            $nombreVariable = $var3->nombre;              

            if ($var3->unidad=='0') {
             

              $resultado = 'Fuera de rango. ';
              $medicion = $post['var3'] . ' , estando el mismo fuera del rango definido.';
              $medicion2 = 'Le informaremos nuevamente cuando el mismo vuelva a parámetros normales.';
              
              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;
             
              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
              

            }else if ($var3->unidad=='1'){

              $resultado = 'Métrica normalizada. ';
              $medicion = $post['var3'] . ', estando el mismo dentro del rango definido.';
              $medicion2 = '';

              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;

              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
            }
          
          }

          // FIN DEL ENVIO DE NOTIFICACION
          /////////////////////////////////////////////////////
          $var3->fecha_ultima_medicion = Carbon::now('America/Argentina/Buenos_Aires');
          $var3->ultima_medicion = $post['var3'];

          $var3->cantidad_mediciones = $var3->cantidad_mediciones + 1;      
          $var3->suma_mediciones = $var3->suma_mediciones + $post['var3'];  
          if ($var3->json!=null) {
            $var3->json = $var3->json . ',{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var3'] . '"}';
          }else{
            $var3->json = '{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var3'] . '"}';
          }         
          $var3->save();
        }
     }      
 }
      


      if ($post['var4'] != null) {
      $var4 = variable::where('dispositivo_id','=',$post['dispositivo_id'])
                                    ->where('code','=','var4')
                                    ->first();
      if ($var4!=null ) {
        if ($var4->status) {

           /////////////////////////////////////////////////////
          // acá valido si la medicion se encuentra en rango
          $in_range1 = $post['var4'] >= $var4->rango_minimo && $post['var4'] <= $var4->rango_maximo; 
          //si su "status" de estar o no en rango es igual al anterior no pasa nada, pero si es distinto se notifica.
          if ($in_range1!=$var4->unidad) {
            
            $var4->unidad = $in_range1;
            $nombreVariable = $var4->nombre;              

            if ($var4->unidad=='0') {
             

              $resultado = 'Fuera de rango. ';
              $medicion = $post['var4'] . ' , estando el mismo fuera del rango definido.';
              $medicion2 = 'Le informaremos nuevamente cuando el mismo vuelva a parámetros normales.';
              
              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;
             
              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
              

            }else if ($var4->unidad=='1'){

              $resultado = 'Métrica normalizada. ';
              $medicion = $post['var4'] . ', estando el mismo dentro del rango definido.';
              $medicion2 = '';

              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;

              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
            }
          
          }

          // FIN DEL ENVIO DE NOTIFICACION
          /////////////////////////////////////////////////////
          $var4->fecha_ultima_medicion = Carbon::now('America/Argentina/Buenos_Aires');
          $var4->ultima_medicion = $post['var4'];

          $var4->cantidad_mediciones = $var4->cantidad_mediciones + 1;      
          $var4->suma_mediciones = $var4->suma_mediciones + $post['var4'];  
          if ($var4->json!=null) {
            $var4->json = $var4->json . ',{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var4'] . '"}';
          }else{
            $var4->json = '{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var4'] . '"}';
          }         
          $var4->save();
        }
     }      

}


      if ($post['var5'] != null) {
      $var5 = variable::where('dispositivo_id','=',$post['dispositivo_id'])
                                    ->where('code','=','var5')
                                    ->first();
      if ($var5!=null ) {
        if ($var5->status) {

           /////////////////////////////////////////////////////
          // acá valido si la medicion se encuentra en rango
          $in_range1 = $post['var5'] >= $var5->rango_minimo && $post['var5'] <= $var5->rango_maximo; 
          //si su "status" de estar o no en rango es igual al anterior no pasa nada, pero si es distinto se notifica.
          if ($in_range1!=$var5->unidad) {
            
            $var5->unidad = $in_range1;
            $nombreVariable = $var5->nombre;              

            if ($var5->unidad=='0') {
             

              $resultado = 'Fuera de rango. ';
              $medicion = $post['var5'] . ' , estando el mismo fuera del rango definido.';
              $medicion2 = 'Le informaremos nuevamente cuando el mismo vuelva a parámetros normales.';
              
              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;
             
              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
              

            }else if ($var5->unidad=='1'){

              $resultado = 'Métrica normalizada. ';
              $medicion = $post['var5'] . ', estando el mismo dentro del rango definido.';
              $medicion2 = '';

              $asunto =  $nombreIOT . ' | ' . $nombreVariable . ': ' .  $resultado;

              Mail::to($toMail)->send(new \App\Mail\statusNotification($medicion, $nombreIOT, $nombreVariable, $resultado, $asunto, $medicion2));
            }
          
          }

          // FIN DEL ENVIO DE NOTIFICACION
          /////////////////////////////////////////////////////
          $var5->fecha_ultima_medicion = Carbon::now('America/Argentina/Buenos_Aires');
          $var5->ultima_medicion = $post['var5'];

          $var5->cantidad_mediciones = $var5->cantidad_mediciones + 1;      
          $var5->suma_mediciones = $var5->suma_mediciones + $post['var5'];  
          if ($var5->json!=null) {
            $var5->json = $var5->json . ',{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var5'] . '"}';
          }else{
            $var5->json = '{"' . Carbon::now('America/Argentina/Buenos_Aires') . '":"' . $post['var5'] . '"}';
          }

          $var5->save();
        }
     }      
      }


      $dispUpd = dispositivo::find($post['dispositivo_id']);

      $dispUpd->fecha_ultima_medicion = Carbon::now('America/Argentina/Buenos_Aires');
      $dispUpd->save();

        $medicion = true;
      }else{
        $medicion = false;
      }
    
      $encendido = dispositivo::find($post['dispositivo_id'])->encendido_real;

    \DB::commit();

      return response()->json(compact('medicion','encendido'));


}catch(Exception $e){


  \DB::rollBack();
  
  Log::critical('Error en captura de medicion'. $e);

  return response()->json('Algo salio mal, por favor intente mas tarde ', 500);
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

}
