import { Component, OnInit} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/users.service';
import { User } from '../interfaces/user';
import {Router,NavigationEnd} from '@angular/router';
import * as global from '../globals/globalesVar'; 
@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
userData:any;
avatar:string;
constructor(
  private authenticationService: AuthenticationService,
  private _actualUser:UserService,
  private router: Router
 ) {
  // Anotacion para recordar el funcionamiento de esto:
  // Me suscribo a cada cambio en la ruta para no hacer 99999 veces la misma consulta. 
  // esto funciona asi: si la ruta de la aplicacion cambia se setea en local si el usuario es administrador,
  // ademas se setea el objeto del usuario actual almacenado en memoria en un string 
  // esto es para que solo se realicen consultas si la sesion del navegador no tiene "sesion iniciada" coincidente con la informacion 
  // en memoria,
  // de esta manera no hay manera posible de que manualmente se seteen valores y se ingrese con credenciales robadas de 
  // otro navegador. Para colmo el guard de admin compara valores y te impide acceder por ruta a sectores protegidos.
  /////////
  // Ale.//
  ////////
	router.events.subscribe((val) => {
        if (this.userData&&localStorage.getItem('IdUser')) {
 			localStorage.setItem('class',this.userData.admin); 
 			sessionStorage.setItem('permanentStatement',JSON.stringify(this.userData));
        }
    });

}
ngOnInit(){
  //Ademas cada vez que se inicializa el entorno se vuelven a setear valores. Esta es una idea que me dio Teamwork y su plataforma
this._actualUser.currentUser().subscribe(
 	response => {
     
 		//console.log(response);
 		this.userData = response;
 		this.avatar=global.urlImagenes+response.avatar;});
}
endSession(){
   this.authenticationService.logOut();}}

