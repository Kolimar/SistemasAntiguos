import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { CanalAdquisicion } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class CanalAdquisicionService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    create(create: CanalAdquisicion) {
        return this.http.post(ApiSettings.urlApi+'canales-adquisicion', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: CanalAdquisicion) {
        return this.http.put(ApiSettings.urlApi+'canales-adquisicion/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'canales-adquisicion/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(CanalAdquisicion: any){
        let params = new URLSearchParams();
        params.set('nombre', CanalAdquisicion.nombre);
        params.set('nombre_ord', CanalAdquisicion.nombre_ord);
        params.set('pagina', CanalAdquisicion.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'canales-adquisicion', options).map((response: Response) => response.json());
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
