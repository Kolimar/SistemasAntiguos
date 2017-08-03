<?php

namespace App\Http\Controllers\Dispositivos;

use App\Http\Controllers\ApiController;
use App\Traits\showAll;
use App\dispositivo;
use App\User;
use App\variable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class DispositivosController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $currentUser = $request->user();
       if ($request->user()->admin == 'true') {

        $consulta = [];
        $consulta['leyenda']=0;
        $consulta['numero_de_serie']=0;
        $consulta['ubicacion_actual']=0;
        $consulta['estado']=9;
        
        //los asigno
        foreach ($request->query() as $query => $value) {
            $consulta[$query] = $value;
        }

        //evaluo "cuando la posicion del array no es false", hago la consulta
        // IMPORTANTE: los Querys retornan colecciones laravel, las consultas raw devuelven array.
        // segun la documentacion de Laravel NO es conveniente usar raw por las inyecciones SQL y en este caso particular un array 
        // rompe el responser que esta esperando una coleccion.

       $dispositivos = dispositivo::when($consulta['leyenda'], function ($query) use ($consulta) {
                                return $query->where("nombre", "LIKE", '%'.$consulta['leyenda'].'%');
                            })
                        ->when($consulta['numero_de_serie'], function ($query) use ($consulta) {
                                return $query->where("nro_serie", "LIKE", '%'.$consulta['numero_de_serie'].'%');
                            })
                        ->when($consulta['ubicacion_actual'], function ($query) use ($consulta) {
                                return $query->where("ubicacion", "LIKE", '%'.$consulta['ubicacion_actual'].'%');
                            })
                        ->when($consulta['estado']!='9', function ($query) use ($consulta) {
                                return $query->where("encendido",$consulta['estado']);
                            })
                        ->get();
   
      }else{
        
        $dispositivos = dispositivo::where('perfil_cliente_id','=',$currentUser->id)
                                    ->get();
      }

        return $this->showAll($dispositivos);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request, User $user)
    {
      $currentUser = $request->user();
      $this->authorize('adminUser', $currentUser);
      
      return DB::transaction(function () use ($request) {
      $dispositivo = new dispositivo;  
      
      $dispositivo->encendido = 1;
      $dispositivo->perfil_cliente_id = $request->id_cliente;
      $dispositivo->nombre = $request->nombre;
      $dispositivo->nro_serie = $request->nro_serie;
      $dispositivo->ubicacion = $request->ubicacion;
      $dispositivo->save();
      $variables1 = variable::create([
            'status' => $request->var1_status,
            'code' => 'var1',
            'dispositivo_id' => $dispositivo->id,            
            'maximo' => $request->var1_maximo,
            'minimo' => $request->var1_minimo,
            'nombre' => $request->var1_nombre,
            'rango_maximo' => $request->var1_rango_max,
            'rango_minimo' => $request->var1_rango_min,
            'cantidad_mediciones' => 0,  
        ]);
      $variables2 = variable::create([
            'status' => $request->var2_status,
            'code' => 'var2',
            'dispositivo_id' => $dispositivo->id,
            
            'maximo' => $request->var2_maximo,
            'minimo' => $request->var2_minimo,
            'nombre' => $request->var2_nombre,
            'rango_maximo' => $request->var2_rango_max,
            'rango_minimo' => $request->var2_rango_min,
            'cantidad_mediciones' => 0,  
        ]);
      $variables3 = variable::create([
            'status' => $request->var3_status,
            'code' => 'var3',
            'dispositivo_id' => $dispositivo->id,
            'cantidad_mediciones' => 0,  
            'maximo' => $request->var3_maximo,
            'minimo' => $request->var3_minimo,
            'nombre' => $request->var3_nombre,
            'rango_maximo' => $request->var3_rango_max,
            'rango_minimo' => $request->var3_rango_min,
        ]);
      $variables4 = variable::create([
            'status' => $request->var4_status,
            'code' => 'var4',
            'dispositivo_id' => $dispositivo->id,
            'cantidad_mediciones' => 0,  
            'maximo' => $request->var4_maximo,
            'minimo' => $request->var4_minimo,
            'nombre' => $request->var4_nombre,
            'rango_maximo' => $request->var4_rango_max,
            'rango_minimo' => $request->var4_rango_min,
        ]);
      $variables5 = variable::create([
            'status' => $request->var5_status,
            'code' => 'var5',
            'dispositivo_id' => $dispositivo->id,
            'cantidad_mediciones' => 0,  
            'maximo' => $request->var5_maximo,
            'minimo' => $request->var5_minimo,
            'nombre' => $request->var5_nombre,
            'rango_maximo' => $request->var5_rango_max,
            'rango_minimo' => $request->var5_rango_min,
        ]);
  

    return $this->showOne($dispositivo);

    });
  }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function updateDisp(Request $request)
    {
      
      $currentUser = $request->user();
      $this->authorize('adminUser', $currentUser);


      
      

      $dispositivo = dispositivo::find($request->identificador);
      $dispositivo->perfil_cliente_id = $request->id_cliente;
      $dispositivo->nombre = $request->nombre;
      $dispositivo->nro_serie = $request->nro_serie;
      $dispositivo->ubicacion = $request->ubicacion;
      $dispositivo->save();


      $variables1 = variable::find($request->var1_id);


      $variables1->update([
            'status' => $request->var1_status,
            'code' => 'var1',
            'dispositivo_id' => $dispositivo->id,            
            'maximo' => $request->var1_maximo,
            'minimo' => $request->var1_minimo,
            'nombre' => $request->var1_nombre,
            'rango_maximo' => $request->var1_rango_max,
            'rango_minimo' => $request->var1_rango_min,
        ]);

      $variables2 = variable::find($request->var2_id);

      $variables2->update([
            'status' => $request->var2_status,
            'code' => 'var2',
            'dispositivo_id' => $dispositivo->id,
            
            'maximo' => $request->var2_maximo,
            'minimo' => $request->var2_minimo,
            'nombre' => $request->var2_nombre,
            'rango_maximo' => $request->var2_rango_max,
            'rango_minimo' => $request->var2_rango_min,
        ]);
      $variables3 = variable::find($request->var3_id);

      $variables3->update([
            'status' => $request->var3_status,
            'code' => 'var3',
            'dispositivo_id' => $dispositivo->id,
            
            'maximo' => $request->var3_maximo,
            'minimo' => $request->var3_minimo,
            'nombre' => $request->var3_nombre,
            'rango_maximo' => $request->var3_rango_max,
            'rango_minimo' => $request->var3_rango_min,
        ]);
      $variables4 = variable::find($request->var4_id);

      $variables4->update([
            'status' => $request->var4_status,
            'code' => 'var4',
            'dispositivo_id' => $dispositivo->id,
            
            'maximo' => $request->var4_maximo,
            'minimo' => $request->var4_minimo,
            'nombre' => $request->var4_nombre,
            'rango_maximo' => $request->var4_rango_max,
            'rango_minimo' => $request->var4_rango_min,
        ]);
      $variables5 = variable::find($request->var5_id);

      $variables5->update([
            'status' => $request->var5_status,
            'code' => 'var5',
            'dispositivo_id' => $dispositivo->id,
            
            'maximo' => $request->var5_maximo,
            'minimo' => $request->var5_minimo,
            'nombre' => $request->var5_nombre,
            'rango_maximo' => $request->var5_rango_max,
            'rango_minimo' => $request->var5_rango_min,
        ]);
  

    return $this->showOne($dispositivo);

   
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
