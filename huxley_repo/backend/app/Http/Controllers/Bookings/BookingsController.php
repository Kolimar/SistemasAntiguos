<?php

namespace App\Http\Controllers\Bookings;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Bookings;
use App\logBookings;


class BookingsController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
     
      
        $consulta = [];
        $consulta['Codigo']=0;
        $consulta['Cantidad']=-1;
        $consulta['Utilizado']=-1;
        
        //los asigno
        foreach ($request->query() as $query => $value) {
            if (!empty($value)) {
                $consulta[$query] = $value;
            }
        }
        
        
        $Bookings = Bookings::when($consulta['Codigo'], function ($query) use ($consulta) {
                                return $query->where("codigo", "LIKE", '%'.$consulta['Codigo'].'%');
                            })
                        ->when($consulta['Cantidad']!=-1, function ($query) use ($consulta) {
                                return $query->where("limite_contenedores",$consulta['Cantidad']);
                            })
                        ->when($consulta['Utilizado']!=-1, function ($query) use ($consulta) {
                                return $query->where("cantidad_egresos",$consulta['Utilizado']);
                            })
                        ->get();


       return $this->showAllNouser($Bookings);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function log(Request $request)
    {
        $logBook = logBookings::leftjoin('users', 'logbooking.usuario', '=', 'users.id')
                                ->where('booking',$request->id)
                                ->select('logbooking.*', 'users.name as username', 'users.email as userMail')
                                ->orderBy('logbooking.fecha', 'desc')
                                ->get();


       return response()->json(compact("logBook"),200);
    }

}
