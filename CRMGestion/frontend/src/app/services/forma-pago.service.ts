import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { FormaPago } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class FormaPagoService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    create(create: FormaPago) {
        return this.http.post(ApiSettings.urlApi+'formas-pago', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: FormaPago) {
        return this.http.put(ApiSettings.urlApi+'formas-pago/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'formas-pago/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(FormaPago: any){
        let params = new URLSearchParams();
        params.set('nombre', FormaPago.nombre);
        params.set('descripcion', FormaPago.descripcion);
        params.set('nombre_ord', FormaPago.nombre_ord);
        params.set('pagina', FormaPago.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'formas-pago', options).map((response: Response) => response.json());
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
