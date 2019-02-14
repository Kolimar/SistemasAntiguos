import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import * as global from '../globals/globalesVar';
import { AuthHttp } from 'ng2-bearer';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {AuthenticationService} from './authentication.service';


@Injectable()
export class ContenedorService {
isAdmin: boolean = false;
auth;
users: any;

  constructor(public authHttp: AuthHttp,private _auth:AuthenticationService) { 
  }
  getContenedoresLista(){
     return this.authHttp.get(global.urlApi + 'ContenedoresLista')
      .map(res => res.json());
  }
	getContenedores(currentPage) {
	  return this.authHttp.get(global.urlApi + 'Contenedores?page='+currentPage)
	    .map(res => res.json());
	}
  getlog(itemID){
    return this.authHttp.get(global.urlApi + 'logContenedores?id='+itemID)
      .map(res => res.json());
  }
  submitFormulario(
      tipoAccion,
      InputCliente
      ,InputContenedor
      ,InputSizes
      ,InputPatente
      ,Inputbuque
      ,inputTipo
      ,inputDireccion
      ,inputEstado
      ,inputTerminal
      ,inputOperador
      ,inputDeposito
      ,inputBooking
      ,inputObs
      ,inputDocumento
      ,inputNombre
      ,inputPatente_semi
      ,inputEmpresa
    ){

    return this.authHttp.put(global.urlApi + 'cargaMovimiento?tipoAccion='+tipoAccion+'&InputCliente='+InputCliente+'&InputContenedor='+InputContenedor+'&InputSizes='+InputSizes+'&InputPatente='+InputPatente+'&Inputbuque='+Inputbuque+'&inputTipo='+inputTipo+'&inputDireccion='+inputDireccion+'&inputEstado='+inputEstado+'&inputTerminal='+inputTerminal+'&inputOperador='+inputOperador+'&inputDeposito='+inputDeposito+'&inputBooking='+inputBooking+'&inputObs='+inputObs+'&inputDocumento='+inputDocumento+'&inputNombre='+inputNombre+'&inputPatente_semi='+inputPatente_semi+'&inputEmpresa='+inputEmpresa,InputCliente).map(res => res.json());

  }

editContenedor(formulario){

    return this.authHttp.put(global.urlApi+'editcontenedor',formulario)
      .map(res => res.json());

  }
  submitFormularioIngreso(tipoAccion,form){

    return this.authHttp.put(global.urlApi+'cargaMovimiento?tipoAccion='+tipoAccion,form)
      .map(res => res.json());

  }

   search(currentPage,busquedaCodigo,busquedaSize,busquedaTipo,busquedaEstado,busquedaDeposito,busquedaDiasplaza,busquedaBloqueado, sortby,sortbydesc){
     if (sortby!='false') {
       return this.authHttp.get(global.urlApi + 'Contenedores?page='+ currentPage+'&Codigo='+busquedaCodigo+'&Size='+busquedaSize+'&Tipo='+busquedaTipo+'&Estado='+busquedaEstado+'&Deposito='+busquedaDeposito+'&Diasplaza='+busquedaDiasplaza+'&Bloqueado='+busquedaBloqueado+'&sort_by='+sortby).map((response: Response) => response.json());
     }else if (sortbydesc!='false' ){
      return this.authHttp.get(global.urlApi + 'Contenedores?page='+ currentPage+'&Codigo='+busquedaCodigo+'&Size='+busquedaSize+'&Tipo='+busquedaTipo+'&Estado='+busquedaEstado+'&Deposito='+busquedaDeposito+'&Diasplaza='+busquedaDiasplaza+'&Bloqueado='+busquedaBloqueado+'&sort_by_desc='+sortbydesc).map((response: Response) => response.json());
   }else{
      return this.authHttp.get(global.urlApi + 'Contenedores?page='+ currentPage+'&Codigo='+busquedaCodigo+'&Size='+busquedaSize+'&Tipo='+busquedaTipo+'&Estado='+busquedaEstado+'&Deposito='+busquedaDeposito+'&Diasplaza='+busquedaDiasplaza+'&Bloqueado='+busquedaBloqueado).map((response: Response) => response.json());
       }

    }
}
