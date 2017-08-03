import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Paciente } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class PacienteService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'pacientes', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'pacientes/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: Paciente) {
        return this.http.post(ApiSettings.urlApi+'pacientes', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: Paciente) {
        return this.http.put(ApiSettings.urlApi+'pacientes/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'pacientes/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getObrasSociales(){
        return this.http.get(ApiSettings.urlApi+'listado-obras-sociales', this.jwt()).map((response: Response) => response.json());
    }

    getParticulares(){
        return this.http.get(ApiSettings.urlApi+'listado-particulares', this.jwt()).map((response: Response) => response.json());
    }

    getCmbPacientes(){
      return this.http.get(ApiSettings.urlApi+'cmb-pacientes', this.jwt()).map((response: Response) => response.json());
    }

    search(Paciente: any){
        let params = new URLSearchParams();
        params.set('dni', Paciente.dni);
        params.set('fecha_nacimiento', Paciente.fecha_nacimiento);
        params.set('nombres', Paciente.nombres);
        params.set('apellidos', Paciente.apellidos);
        params.set('afiliado', Paciente.afiliado);
        params.set('domicilio', Paciente.domicilio);
        params.set('departamento', Paciente.departamento);
        params.set('barrio', Paciente.barrio);
        params.set('telefono', Paciente.telefono);
        params.set('celular', Paciente.celular);
        params.set('email', Paciente.email);
        params.set('observaciones', Paciente.observaciones);
        params.set('obra_social', Paciente.obra_social);
        params.set('plan_os', Paciente.plan_os);
        params.set('particular', Paciente.particular);
        params.set('nombres_ord', Paciente.nombres_ord);
        params.set('pagina', Paciente.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'pacientes', options).map((response: Response) => response.json());
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
