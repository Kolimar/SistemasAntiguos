import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { RolContacto } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class RolContactoService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    create(create: RolContacto) {
        return this.http.post(ApiSettings.urlApi+'roles-contactos', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: RolContacto) {
        return this.http.put(ApiSettings.urlApi+'roles-contactos/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'roles-contactos/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(RolContacto: any){
        let params = new URLSearchParams();
        params.set('nombre', RolContacto.nombre);
        params.set('nombre_ord', RolContacto.nombre_ord);
        params.set('pagina', RolContacto.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'roles-contactos', options).map((response: Response) => response.json());
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
