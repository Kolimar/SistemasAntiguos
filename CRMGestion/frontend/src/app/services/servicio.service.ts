import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Servicio } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class ServicioService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getAll() {
        return this.http.get(ApiSettings.urlApi+'servicios', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'servicios/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: Servicio) {
        return this.http.post(ApiSettings.urlApi+'servicios', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: Servicio) {
        return this.http.put(ApiSettings.urlApi+'servicios/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'servicios/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getListado() {
        return this.http.get(ApiSettings.urlApi+'listado-servicios', this.jwt()).map((response: Response) => response.json());
    }

    search(Servicio: any){
        let params = new URLSearchParams();
        params.set('nombre', Servicio.nombre);
        params.set('descripcion', Servicio.descripcion);
        params.set('es_recurrente', Servicio.es_recurrente);
        params.set('monto_sugerido', Servicio.monto_sugerido);
        params.set('habilitado', Servicio.habilitado);
        params.set('nombre_ord', Servicio.nombre_ord);
        params.set('pagina', Servicio.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'servicios', options).map((response: Response) => response.json());
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
