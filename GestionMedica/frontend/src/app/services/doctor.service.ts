import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Doctor } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class DoctorService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'doctores', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'doctores/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(object: Doctor) {
        return this.http.post(ApiSettings.urlApi+'doctores', object, this.jwt()).map((response: Response) => response.json());
    }

    update(object: Doctor) {
        return this.http.put(ApiSettings.urlApi+'doctores/' + object.id, object, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'doctores/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getCmbDoctores(){
      return this.http.get(ApiSettings.urlApi+'cmb-doctores', this.jwt()).map((response: Response) => response.json());
    }

    search(doctor: any){
        let params = new URLSearchParams();
        params.set('matricula', doctor.matricula);
        params.set('nombres', doctor.nombres);
        params.set('apellidos', doctor.apellidos);
        params.set('especialidad', doctor.especialidad);
        params.set('domicilio', doctor.domicilio);
        params.set('departamento', doctor.departamento);
        params.set('telefono', doctor.telefono);
        params.set('celular', doctor.celular);
        params.set('email', doctor.email);
        params.set('observaciones', doctor.observaciones);
        params.set('nombres_ord', doctor.nombres_ord);
        params.set('pagina', doctor.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'doctores', options).map((response: Response) => response.json());
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
