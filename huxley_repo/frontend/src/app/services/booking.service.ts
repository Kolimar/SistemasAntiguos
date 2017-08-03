import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import * as global from '../globals/globalesVar';
import { AuthHttp } from 'ng2-bearer';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {AuthenticationService} from './authentication.service';


@Injectable()
export class BookingService {

isAdmin: boolean = false;
auth;
users: any;

  constructor(public authHttp: AuthHttp,private _auth:AuthenticationService) { 
  }

	getBooking(currentPage) {
	  return this.authHttp.get(global.urlApi + 'Bookings?page='+currentPage)
	    .map(res => res.json());
	}
  getlog(itemID){
    return this.authHttp.get(global.urlApi + 'logBooking?id='+itemID)
      .map(res => res.json());
  }
   search(currentPage,busquedaCodigo,busquedaCantidad,busquedaUtilizado, sortby,sortbydesc){
     if (sortby!='false') {
       return this.authHttp.get(global.urlApi + 'Bookings?page='+ currentPage+'&Codigo='+busquedaCodigo+'&Cantidad='+busquedaCantidad+'&Utilizado='+busquedaUtilizado+'&sort_by='+sortby).map((response: Response) => response.json());
     }else if (sortbydesc!='false' ){
      return this.authHttp.get(global.urlApi + 'Bookings?page='+ currentPage+'&Codigo='+busquedaCodigo+'&Cantidad='+busquedaCantidad+'&Utilizado='+busquedaUtilizado+'&sort_by_desc='+sortbydesc).map((response: Response) => response.json());
   }else{
      return this.authHttp.get(global.urlApi + 'Bookings?page='+ currentPage+'&Codigo='+busquedaCodigo+'&Cantidad='+busquedaCantidad+'&Utilizado='+busquedaUtilizado).map((response: Response) => response.json());
       }

    }
}
