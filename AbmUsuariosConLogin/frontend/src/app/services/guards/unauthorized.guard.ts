import { Injectable } from '@angular/core';
import { Router,Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../users.service';


@Injectable()
export class unAuthGuard implements CanActivate{
    constructor(
      private router: Router,
      private _userservice:UserService
    ) {}
    currentUser:any;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let perfilActual = this._userservice.currentUser()
        .subscribe(
                data =>{
                  if (data.verified=='0'){
                  //console.log("No tiene permisos suficientes");
                  localStorage.clear();
                  this.router.navigate(['login']);
                  return false;                  
                    }
                this.currentUser = "Verificado";
                return true;
                },
                error =>{
                    localStorage.clear();
                    this.router.navigate(['login']);
                    return false;
                }); 
      return true; 
    }
 }    








