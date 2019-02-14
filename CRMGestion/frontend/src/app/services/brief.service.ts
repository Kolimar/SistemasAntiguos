import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Brief, Contacto } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class BriefService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getListadoBriefs() {
        return this.http.get(ApiSettings.urlApi+'brief', this.jwt()).map((response: Response) => response.json());
    }

    getBrief(id: number) {
        return this.http.get(ApiSettings.urlApi+'detail-brief/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: Object) {
        return this.http.post(ApiSettings.urlApi+'brief', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: Object, id: number) {
        return this.http.put(ApiSettings.urlApi+'brief/' + id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'brief/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getListadoRolesContactos() {
        return this.http.get(ApiSettings.urlApi+'listado-roles-contactos', this.jwt()).map((response: Response) => response.json());
    }

    getListadoTiposTelefonos() {
        return this.http.get(ApiSettings.urlApi+'listado-tipos-telefonos', this.jwt()).map((response: Response) => response.json());
    }

    getListadoServicios(){
        return this.http.get(ApiSettings.urlApi+'listado-servicios', this.jwt()).map((response: Response) => response.json());
    }

    getListadoTiposEmpresas(){
        return this.http.get(ApiSettings.urlApi+'listado-tipos-empresas', this.jwt()).map((response: Response) => response.json());
    }

    getListadoMetodosFacturacion(){
        return this.http.get(ApiSettings.urlApi+'listado-metodos-facturacion', this.jwt()).map((response: Response) => response.json());
    }

    getListadoTiposVentas(){
        return this.http.get(ApiSettings.urlApi+'listado-tipos-ventas', this.jwt()).map((response: Response) => response.json());
    }

    getListadoCanalesAdquisicion(){
        return this.http.get(ApiSettings.urlApi+'listado-canales-adquisicion', this.jwt()).map((response: Response) => response.json());
    }

    getListadoPms(){
        return this.http.get(ApiSettings.urlApi+'listado-users', this.jwt()).map((response: Response) => response.json());
    }

    addContacto(create: Object){
        return this.http.post(ApiSettings.urlApi+'add-contacto-brief', create, this.jwt()).map((response: Response) => response.json());
    }

    editContacto(update: Object, id: number){
        return this.http.put(ApiSettings.urlApi+'edit-contacto-brief/' + id, update, this.jwt()).map((response: Response) => response.json());
    }

    deleteContacto(id: number) {
        return this.http.get(ApiSettings.urlApi+'delete-contacto-brief/' + id, this.jwt()).map((response: Response) => response.json());
    }

    addServicio(create: Object){
        return this.http.post(ApiSettings.urlApi+'add-servicio-brief', create, this.jwt()).map((response: Response) => response.json());
    }

    editServicio(update: Object, id: number){
        return this.http.put(ApiSettings.urlApi+'edit-servicio-brief/' + id, update, this.jwt()).map((response: Response) => response.json());
    }

    deleteServicio(id: number) {
        return this.http.get(ApiSettings.urlApi+'delete-servicio-brief/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(Brief: any){
        let params = new URLSearchParams();
        params.set('nombre', Brief.nombre);
        params.set('fecha_comienzo', Brief.fecha_comienzo);
        params.set('pm_asignado', Brief.pm_asignado);
        params.set('estado', Brief.estado);
        params.set('nombre_ord', Brief.nombre_ord);
        params.set('fecha_ord', Brief.fecha_ord);
        params.set('pagina', Brief.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'brief', options).map((response: Response) => response.json());
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
