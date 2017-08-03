import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Brief, Contacto } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class ClienteService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getListadoClientes() {
        return this.http.get(ApiSettings.urlApi+'cliente', this.jwt()).map((response: Response) => response.json());
    }

    getCliente(id: number) {
        return this.http.get(ApiSettings.urlApi+'detail-cliente/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: Object) {
        return this.http.post(ApiSettings.urlApi+'cliente', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: Object, id: number) {
        return this.http.put(ApiSettings.urlApi+'cliente/' + id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(deleteData: Object, id: number) {
        return this.http.put(ApiSettings.urlApi+'delete-cliente/' + id, deleteData, this.jwt()).map((response: Response) => response.json());
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

    getListadoFormasPago(){
        return this.http.get(ApiSettings.urlApi+'formas-pago', this.jwt()).map((response: Response) => response.json());
    }

    addContacto(create: Object){
        return this.http.post(ApiSettings.urlApi+'add-contacto-cliente', create, this.jwt()).map((response: Response) => response.json());
    }

    editContacto(update: Object, id: number){
        return this.http.put(ApiSettings.urlApi+'edit-contacto-cliente/' + id, update, this.jwt()).map((response: Response) => response.json());
    }

    deleteContacto(id: number) {
        return this.http.get(ApiSettings.urlApi+'delete-contacto-cliente/' + id, this.jwt()).map((response: Response) => response.json());
    }

    addServicio(create: Object){
        return this.http.post(ApiSettings.urlApi+'add-servicio-cliente', create, this.jwt()).map((response: Response) => response.json());
    }

    editServicio(update: Object, id: number){
        return this.http.put(ApiSettings.urlApi+'edit-servicio-cliente/' + id, update, this.jwt()).map((response: Response) => response.json());
    }

    deleteServicio(id: number) {
        return this.http.get(ApiSettings.urlApi+'delete-servicio-cliente/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // PETICION GET PARA LISTADO DE LANDING, INTEGRACION CON SISTEMA DE GODIXITAL
    getListadoLandings(data: any){
      let params = new URLSearchParams();
      params.set('hash', data.hash);
      params.set('timestamp', data.timestamp);
      params.set('adwords_id', data.adwords_id);

      let options = new RequestOptions({ search: params });

      return this.http.get(ApiSettings.urlClientsSecure+'clients_secure.php', options).map((response: Response) => response.json());
    }

    searchPanel(Cliente: any){
        let params = new URLSearchParams();
        params.set('cliente', Cliente.cliente);
        params.set('cliente_ord', Cliente.cliente_ord);
        params.set('pagina', Cliente.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'panel-cliente', options).map((response: Response) => response.json());
    }

    search(Cliente: any){
        let params = new URLSearchParams();
        params.set('nombre', Cliente.nombre);
        params.set('fecha_comienzo', Cliente.fecha_comienzo);
        params.set('pm_asignado', Cliente.pm_asignado);
        params.set('estado', Cliente.estado);
        params.set('nombre_ord', Cliente.nombre_ord);
        params.set('fecha_ord', Cliente.fecha_ord);
        params.set('pagina', Cliente.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'cliente', options).map((response: Response) => response.json());
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
