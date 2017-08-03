import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { IngresoGasto } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class IngresoGastoService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'ingresos-gastos', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'ingresos-gastos/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(object: IngresoGasto) {
        return this.http.post(ApiSettings.urlApi+'ingresos-gastos', object, this.jwt()).map((response: Response) => response.json());
    }

    update(object: IngresoGasto) {
        return this.http.put(ApiSettings.urlApi+'ingresos-gastos/' + object.id, object, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'ingresos-gastos/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(IngresoGasto: any){
        let params = new URLSearchParams();
        params.set('fecha_inicio', IngresoGasto.fecha_inicio);
        params.set('fecha_final', IngresoGasto.fecha_final);
        params.set('motivo', IngresoGasto.motivo);
        params.set('monto', IngresoGasto.monto);
        params.set('descripcion', IngresoGasto.descripcion);
        params.set('tipo_caja', IngresoGasto.tipo_caja);
        params.set('fecha_ord', IngresoGasto.fecha_ord);
        params.set('pagina', IngresoGasto.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'ingresos-gastos', options).map((response: Response) => response.json());
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
