import { Component, OnInit,Output,
EventEmitter} from '@angular/core';
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
  
router.events.subscribe((val) => {
        if (this.userData&&localStorage.getItem('IdUser')) {
 			localStorage.setItem('class',this.userData.admin); 
 			sessionStorage.setItem('permanentStatement',JSON.stringify(this.userData));
        }
    });

}
ngOnInit(){
  //Cada vez que se inicializa el entorno se vuelven a setear valores. 
this._actualUser.currentUser().subscribe(
 	response => {
     
 		//console.log(response);
 		this.userData = response;
 		this.avatar=global.urlImagenes+response.avatar;});
}
endSession(){
   this.authenticationService.logOut();}}

