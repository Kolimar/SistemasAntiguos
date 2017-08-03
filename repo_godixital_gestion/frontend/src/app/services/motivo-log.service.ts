import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { MotivoLog } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class MotivoLogService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    create(create: MotivoLog) {
        return this.http.post(ApiSettings.urlApi+'motivos-logs', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: MotivoLog) {
        return this.http.put(ApiSettings.urlApi+'motivos-logs/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'motivos-logs/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(MotivoLog: any){
        let params = new URLSearchParams();
        params.set('nombre', MotivoLog.nombre);
        params.set('milestone', MotivoLog.milestone);
        params.set('interes', MotivoLog.interes);
        params.set('nombre_ord', MotivoLog.nombre_ord);
        params.set('pagina', MotivoLog.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'motivos-logs', options).map((response: Response) => response.json());
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
