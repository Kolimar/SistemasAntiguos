import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Prestacion } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class PrestacionService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'prestaciones', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'prestaciones/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: Prestacion) {
        return this.http.post(ApiSettings.urlApi+'prestaciones', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: Prestacion) {
        return this.http.put(ApiSettings.urlApi+'prestaciones/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'prestaciones/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getCmbPrestaciones(){
      return this.http.get(ApiSettings.urlApi+'cmb-prestaciones', this.jwt()).map((response: Response) => response.json());
    }

    search(Prestacion: any){
        let params = new URLSearchParams();
        params.set('nombre', Prestacion.nombre);
        params.set('nombre_ord', Prestacion.nombre_ord);
        params.set('pagina', Prestacion.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'prestaciones', options).map((response: Response) => response.json());
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
