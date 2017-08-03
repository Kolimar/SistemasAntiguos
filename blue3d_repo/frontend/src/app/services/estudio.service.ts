import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Estudio } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class EstudioService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'estudios', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'estudios/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(request: Estudio) {
        return this.http.post(ApiSettings.urlApi+'estudios', request, this.jwt()).map((response: Response) => response.json());
    }

    update(request: Estudio) {
        return this.http.put(ApiSettings.urlApi+'estudios/' + request.id, request, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'estudios/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getPacientes(){
        return this.http.get(ApiSettings.urlApi+'listado-pacientes', this.jwt()).map((response: Response) => response.json());
    }

    getDoctores(){
        return this.http.get(ApiSettings.urlApi+'listado-doctores', this.jwt()).map((response: Response) => response.json());
    }

    getPagosEstudios(id: number){
      return this.http.get(ApiSettings.urlApi+'pagos-estudios/' + id, this.jwt()).map((response: Response) => response.json());
    }

    addPago(request: any){
      return this.http.post(ApiSettings.urlApi+'add-pago', request, this.jwt()).map((response: Response) => response.json());
    }

    editPago(request: any){
      return this.http.put(ApiSettings.urlApi+'edit-pago/' + request.id, request, this.jwt()).map((response: Response) => response.json());
    }

    deletePago(request: any){
      return this.http.put(ApiSettings.urlApi+'delete-pago/' + request.id, request, this.jwt()).map((response: Response) => response.json());
    }

    search(Estudio: any){
        let params = new URLSearchParams();
        params.set('fecha_inicio', Estudio.fecha_inicio);
        params.set('fecha_final', Estudio.fecha_final);
        params.set('hora', Estudio.hora);
        params.set('paciente', Estudio.paciente);
        params.set('doctor', Estudio.doctor);
        params.set('prestacion', Estudio.prestacion);
        params.set('observaciones', Estudio.observaciones);
        params.set('factura', Estudio.factura);
        params.set('fecha_ord', Estudio.fecha_ord);
        params.set('pagina', Estudio.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'estudios', options).map((response: Response) => response.json());
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
