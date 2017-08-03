import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Log } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class LogService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    create(create: Log) {
        return this.http.post(ApiSettings.urlApi+'logs', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: Log) {
        return this.http.put(ApiSettings.urlApi+'logs/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'logs/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getMotivosLogs() {
        return this.http.get(ApiSettings.urlApi+'listado-motivos-logs', this.jwt()).map((response: Response) => response.json());
    }

    getMotivosLogsManuales() {
        return this.http.get(ApiSettings.urlApi+'listado-motivos-logs-manuales', this.jwt()).map((response: Response) => response.json());
    }

    search(Log: any){
        let params = new URLSearchParams();
        params.set('fecha', Log.fecha);
        params.set('creador', Log.creador);
        params.set('cliente', Log.cliente);
        params.set('motivo', Log.motivo);
        params.set('descripcion', Log.descripcion);
        params.set('fecha_ord', Log.fecha_ord);
        params.set('pagina', Log.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'logs', options).map((response: Response) => response.json());
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
