import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { User } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class UserService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(ApiSettings.urlApi+'register', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(ApiSettings.urlApi+'users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getPuestos() {
        return this.http.get(ApiSettings.urlApi+'listado-puestos', this.jwt()).map((response: Response) => response.json());
    }

    cambiarContrasena(user: User){
        return this.http.post(ApiSettings.urlApi+'cambio-contrasena', user, this.jwt()).map((response: Response) => response.json());
    }

    enviarEmail(user: User){
        return this.http.post(ApiSettings.urlApi+'envio-email-cambio-contrasena', user).map((response: Response) => response.json());
    }

    search(User: any){
        let params = new URLSearchParams();
        params.set('nombres', User.nombres);
        params.set('apellidos', User.apellidos);
        params.set('puesto', User.puesto);
        params.set('telefono_laboral', User.telefono_laboral);
        params.set('celular_laboral', User.celular_laboral);
        params.set('email_laboral', User.email_laboral);
        params.set('telefono_personal', User.telefono_personal);
        params.set('celular_personal', User.celular_personal);
        params.set('email_personal', User.email_personal);
        params.set('habilitado', User.habilitado);
        params.set('nombres_ord', User.nombres_ord);
        params.set('pagina', User.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'users', options).map((response: Response) => response.json());
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            this.headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: this.headers });
        }
    }
}
