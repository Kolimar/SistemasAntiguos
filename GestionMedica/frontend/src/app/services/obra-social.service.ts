import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { ObraSocial } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class ObraSocialService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'obras-sociales', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'obras-sociales/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(obraSocial: ObraSocial) {
        return this.http.post(ApiSettings.urlApi+'obras-sociales', obraSocial, this.jwt()).map((response: Response) => response.json());
    }

    update(obraSocial: ObraSocial) {
        return this.http.put(ApiSettings.urlApi+'obras-sociales/' + obraSocial.id, obraSocial, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'obras-sociales/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // PRECIOS POR OBRAS SOCIALES
    getAllPreciosObrasSociales(id: number){
        return this.http.get(ApiSettings.urlApi+'precios-obras-sociales/'+ id, this.jwt()).map((response: Response) => response.json());
    }

    createPrecio(precio: any) {
        return this.http.post(ApiSettings.urlApi+'precios-obras-sociales', precio, this.jwt()).map((response: Response) => response.json());
    }

    editPrecio(obraSocial: ObraSocial) {
        return this.http.put(ApiSettings.urlApi+'precios-obras-sociales/' + obraSocial.id, obraSocial, this.jwt()).map((response: Response) => response.json());
    }

    deletePrecio(id: number) {
        return this.http.delete(ApiSettings.urlApi+'precios-obras-sociales/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(ObraSocial: any){
        let params = new URLSearchParams();
        params.set('nombre', ObraSocial.nombre);
        params.set('nombre_ord', ObraSocial.nombre_ord);
        params.set('pagina', ObraSocial.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'obras-sociales', options).map((response: Response) => response.json());
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
