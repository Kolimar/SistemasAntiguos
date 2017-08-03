import { Injectable } from '@angular/core';
import { Router,Route, CanActivate,CanLoad , ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service';


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
      private router: Router,
      private _auth:AuthenticationService
    ) {
}
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('IdUser')) {
        if (!this._auth.isAuthenticated) {
            return true;
            // code...
        } 
        //Si esta autenticado y ademas tiene el token almacenado en memoria pasa.
    }else{
        // si no está autenticado o no tiene token tonces para ajuera
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;    
        }

}}
