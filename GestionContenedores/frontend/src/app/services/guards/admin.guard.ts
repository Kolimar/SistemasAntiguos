import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../users.service';


@Injectable()
export class AdminGuard implements CanActivate {
    exposeInfo:string;
    constructor(
      private router: Router,
      private _userservice:UserService

    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         if (localStorage.getItem('IdUser')&&localStorage.getItem('class')=="true"&&JSON.parse(sessionStorage.getItem("permanentStatement"))) {
           if(JSON.parse(sessionStorage.getItem("permanentStatement")).admin==localStorage.getItem('class'))
              {return true;}
            //Llegar aca solo se puede llegar si 
            //1) el navegador no es compatible con angular o por alguna razón está andando mal.
            //2) Se intento manipular agresivamente la informacion de la base de datos local.
            //En ambos casos es mejor borrar todo y mandarlo al login -> borro local y sesion por las dudas y redirijo
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/login']);
            alert("hubo un error en la lectura de la información");
              return false;    
          }else{
        this.router.navigate(['/dashboard'], { queryParams: { returnUrl: state.url }});
              return false;}
    }
   
}

