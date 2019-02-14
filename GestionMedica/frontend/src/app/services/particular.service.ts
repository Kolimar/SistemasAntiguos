import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Particular } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class ParticularService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'particulares', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'particulares/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: Particular) {
        return this.http.post(ApiSettings.urlApi+'particulares', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: Particular) {
        return this.http.put(ApiSettings.urlApi+'particulares/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'particulares/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // PRECIOS POR OBRAS SOCIALES
    getAllPreciosParticulares(id: number){
        return this.http.get(ApiSettings.urlApi+'precios-particulares/'+ id, this.jwt()).map((response: Response) => response.json());
    }

    createPrecio(precio: any) {
        return this.http.post(ApiSettings.urlApi+'precios-particulares', precio, this.jwt()).map((response: Response) => response.json());
    }

    editPrecio(particular: Particular) {
        return this.http.put(ApiSettings.urlApi+'precios-particulares/' + particular.id, particular, this.jwt()).map((response: Response) => response.json());
    }

    deletePrecio(id: number) {
        return this.http.delete(ApiSettings.urlApi+'precios-particulares/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(Particular: any){
        let params = new URLSearchParams();
        params.set('nombre', Particular.nombre);
        params.set('nombre_ord', Particular.nombre_ord);
        params.set('pagina', Particular.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'particulares', options).map((response: Response) => response.json());
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
