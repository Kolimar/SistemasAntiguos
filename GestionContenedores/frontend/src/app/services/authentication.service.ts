import { Injectable} from '@angular/core';
import { Http, Headers,Response,URLSearchParams} from '@angular/http';
import { Router} from '@angular/router';
import * as global from '../globals/globalesVar';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
 
isAuthenticated: boolean = false;

    constructor(private http: Http,  private router: Router) {

    }

auth;

private extractData(response: Response) {
        let body = response;
        if (this.auth.access_token!=undefined) {
          this.isAuthenticated = true; 
          //Variable LOGIN, si está logueado entonces !authenticationService.isAuthenticated
        }else{
          //console.log("No autenticado");
        }
        return body || {};
    }

login(email: string, password: string) {
       global.data.append('username', email);
       global.data.append('password', password);
       let respuesta = this.http.post(global.urlApi+'oauth/token',global.data)
                        .map((response: Response) => {
                                let auth = this.extractData;
                                let body = JSON.parse(response.text());
                                localStorage.setItem('IdUser',body.access_token);
                                response.json()
                            });
        return respuesta;
    }
requestPass(email) {
       let respuesta = this.http.post(global.urlApi+'contrasenia?requestEmail=' + email,email)
                        .map((response: Response) => {
                                response.json()
                            });
        return respuesta;
    }

    logOut(){
           this.isAuthenticated= false;
           localStorage.clear();
           sessionStorage.clear();
           this.router.navigate(['/login']);
    }
}
