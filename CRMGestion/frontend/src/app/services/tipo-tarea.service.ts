import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { TipoTarea } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class TipoTareaService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    create(create: TipoTarea) {
        return this.http.post(ApiSettings.urlApi+'tipos-tareas', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: TipoTarea) {
        return this.http.put(ApiSettings.urlApi+'tipos-tareas/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'tipos-tareas/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(TipoTarea: any){
        let params = new URLSearchParams();
        params.set('nombre', TipoTarea.nombre);
        params.set('nombre_ord', TipoTarea.nombre_ord);
        params.set('pagina', TipoTarea.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'tipos-tareas', options).map((response: Response) => response.json());
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
