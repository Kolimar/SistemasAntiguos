import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Visita } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class VisitaService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'visitas', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'visitas/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(object: Visita) {
        return this.http.post(ApiSettings.urlApi+'visitas', object, this.jwt()).map((response: Response) => response.json());
    }

    update(object: Visita) {
        return this.http.put(ApiSettings.urlApi+'visitas/' + object.id, object, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'visitas/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(Visita: any, id_doctor: any){
        let params = new URLSearchParams();
        params.set('id_doctor', id_doctor);
        params.set('fecha', Visita.fecha);
        params.set('fecha_ord', Visita.fecha_ord);
        params.set('descripcion', Visita.descripcion);
        params.set('pagina', Visita.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'visitas', options).map((response: Response) => response.json());
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
