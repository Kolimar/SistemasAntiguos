import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import * as global from '../globals/globalesVar';
import { AuthHttp } from 'ng2-bearer';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {AuthenticationService} from './authentication.service';


@Injectable()
export class MovimientosService {

isAdmin: boolean = false;
auth;
users: any;

  constructor(public authHttp: AuthHttp,private _auth:AuthenticationService) { 
  }

	getMovimientos(currentPage) {
	  return this.authHttp.get(global.urlApi + 'Movimientos?page='+currentPage)
	    .map(res => res.json());
	}

   search(currentPage,busquedaFecha,busquedaMovimiento,busquedaCodigo,busquedaSize,busquedaTipo,busquedaEstado,busquedaDeposito,busquedaCliente,busquedaBloqueado, sortby,sortbydesc){
     if (sortby!='false') {
       return this.authHttp.get(global.urlApi + 'Movimientos?page='+ currentPage+'&Fecha='+busquedaFecha+'&Movimiento='+busquedaMovimiento+'&Codigo='+busquedaCodigo+'&Size='+busquedaSize+'&Tipo='+busquedaTipo+'&Estado='+busquedaEstado+'&Deposito='+busquedaDeposito+'&Cliente='+busquedaCliente+'&Bloqueado='+busquedaBloqueado+'&sort_by='+sortby).map((response: Response) => response.json());
     }else if (sortbydesc!='false' ){
      return this.authHttp.get(global.urlApi + 'Movimientos?page='+ currentPage+'&Fecha='+busquedaFecha+'&Movimiento='+busquedaMovimiento+'&Codigo='+busquedaCodigo+'&Size='+busquedaSize+'&Tipo='+busquedaTipo+'&Estado='+busquedaEstado+'&Deposito='+busquedaDeposito+'&Cliente='+busquedaCliente+'&Bloqueado='+busquedaBloqueado+'&sort_by_desc='+sortbydesc).map((response: Response) => response.json());
   }else{
      return this.authHttp.get(global.urlApi + 'Movimientos?page='+ currentPage+'&Fecha='+busquedaFecha+'&Movimiento='+busquedaMovimiento+'&Codigo='+busquedaCodigo+'&Size='+busquedaSize+'&Tipo='+busquedaTipo+'&Estado='+busquedaEstado+'&Deposito='+busquedaDeposito+'&Cliente='+busquedaCliente+'&Bloqueado='+busquedaBloqueado).map((response: Response) => response.json());
       }

    }
}
