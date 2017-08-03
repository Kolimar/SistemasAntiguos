import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import * as global from '../globals/globalesVar';
import { AuthHttp } from 'ng2-bearer';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {AuthenticationService} from './authentication.service';
@Injectable()
export class UserService {

    
    isAdmin: boolean = false;
    auth;
    users: any;
    constructor(public authHttp: AuthHttp,private _auth:AuthenticationService) {
    }
    getUsers(currentPage) {
      return this.authHttp.get(global.urlApi + 'clientes?page='+currentPage)
        .map(res => res.json());
    }
    showOneUser(id){
      return this.authHttp.get(global.urlApi + 'clientes/'+id)
        .map(res => res.json());
    }
    newUser(user){
      return this.authHttp.post(global.urlApi+'users',user)
        .map(res => res.json());
    }
    deleteUser(user){
      return this.authHttp.delete(global.urlApi+'users',user)
        .map(res => res.json());
    }
    updateUser(user){
      //console.log(user);
      return this.authHttp.put(global.urlApi+'users/'+user.id,user)
        .map(res => res.json());
    }
    currentUser() {
      return this.authHttp.get(global.urlApi+'currentUser')
        .map(res => {
          if (res.url==global.urlApi+'disabledUser') {
            this._auth.logOut();
          }
            let auth = this.extractData;

            return res.json();
          });
    }
    getAll(){
      return this.authHttp.get(global.urlApi + 'clientes?page=1&per_page=50')
        .map(res => res.json());
    }
    //falta el search
   search(currentPage,busquedaNombre,busquedaApellido,busquedaEmpresa,busquedaEmail,busquedaEstadoUsuario,sortby,sortbydesc){
     if (sortby!='false') {
       return this.authHttp.get(global.urlApi + 'users?page='+ currentPage+'&nombre='+busquedaNombre+'&apellido='+busquedaApellido+'&nombre_empresa='+busquedaEmpresa+'&correo='+busquedaEmail+'&habilitado='+busquedaEstadoUsuario+'&sort_by='+sortby).map((response: Response) => response.json());
   
     }else if (sortbydesc!='false' ){
      return this.authHttp.get(global.urlApi + 'users?page='+ currentPage+'&nombre='+busquedaNombre+'&apellido='+busquedaApellido+'&nombre_empresa='+busquedaEmpresa+'&correo='+busquedaEmail+'&habilitado='+busquedaEstadoUsuario+'&sort_by_desc='+sortbydesc).map((response: Response) => response.json());
     }else{
       return this.authHttp.get(global.urlApi + 'users?page='+ currentPage+'&nombre='+busquedaNombre+'&apellido='+busquedaApellido+'&nombre_empresa='+busquedaEmpresa+'&correo='+busquedaEmail+'&habilitado='+busquedaEstadoUsuario).map((response: Response) => response.json());
     }

    }

    private extractData(response: Response) {
            let body = response;
            if (this.auth.admin=="true") {
              this.isAdmin = true;
              //Variable LOGIN, si está logueado entonces !userService.isAdmin
            }else{
              //console.log("No tiene permisos");
            }
            return body || {};
        }
}
