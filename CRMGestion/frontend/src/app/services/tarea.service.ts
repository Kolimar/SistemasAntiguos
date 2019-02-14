import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Tarea, Subtarea } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class TareaService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getAll() {
        return this.http.get(ApiSettings.urlApi+'tareas', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'tareas-actualizar/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: Tarea) {
        return this.http.post(ApiSettings.urlApi+'tareas', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: Tarea) {
        return this.http.put(ApiSettings.urlApi+'tareas/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'tareas/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getTareasTemplates(){
        return this.http.get(ApiSettings.urlApi+'listado-tareas-templates', this.jwt()).map((response: Response) => response.json());
    }

    getTareasTemplatesDetalle(id: number){
        return this.http.get(ApiSettings.urlApi+'tareas-templates-detalle/' +id, this.jwt()).map((response: Response) => response.json());
    }

    getClientes(){
        return this.http.get(ApiSettings.urlApi+'listado-clientes', this.jwt()).map((response: Response) => response.json());
    }

    getClientesActivos(){
        return this.http.get(ApiSettings.urlApi+'listado-clientes-activos', this.jwt()).map((response: Response) => response.json());
    }

    getUsers(){
        return this.http.get(ApiSettings.urlApi+'listado-users', this.jwt()).map((response: Response) => response.json());
    }

    getPmCliente(id: number){
        return this.http.get(ApiSettings.urlApi+'pm-cliente/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getClientesServicios(id: number){
        return this.http.get(ApiSettings.urlApi+'listado-clientes-servicios/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getTiposTareas(){
        return this.http.get(ApiSettings.urlApi+'listado-tipos-tareas', this.jwt()).map((response: Response) => response.json());
    }

    // SUBTAREAS

    getSubtareas(id: number){
        return this.http.get(ApiSettings.urlApi+'listado-subtareas/' + id, this.jwt()).map((response: Response) => response.json());
    }

    createSubtareas(create: Subtarea) {
        return this.http.post(ApiSettings.urlApi+'subtareas', create, this.jwt()).map((response: Response) => response.json());
    }

    editSubtarea(edit: Subtarea) {
        return this.http.post(ApiSettings.urlApi+'subtareas-edit', edit, this.jwt()).map((response: Response) => response.json());
    }

    deleteSubtarea(deletee: Subtarea) {
        return this.http.post(ApiSettings.urlApi+'subtareas-destroy', deletee, this.jwt()).map((response: Response) => response.json());
    }

    getCantidadSubtareas(id: number){
        return this.http.get(ApiSettings.urlApi+'verificar-subtareas/' +id, this.jwt()).map((response: Response) => response.json());
    }

    search(Tarea: any){
        let params = new URLSearchParams();
        params.set('es_critica', Tarea.es_critica);
        params.set('ultimo_milestone', Tarea.ultimo_milestone);
        params.set('titulo', Tarea.titulo);
        params.set('descripcion', Tarea.descripcion);
        params.set('fecha_limite', Tarea.fecha_limite);
        params.set('fecha_ejecucion', Tarea.fecha_ejecucion);
        params.set('urgente', Tarea.urgente);
        params.set('falta_info', Tarea.falta_info);
        params.set('prioridad', Tarea.prioridad);
        params.set('tipo_tarea', Tarea.tipo_tarea);
        params.set('cliente', Tarea.cliente);
        params.set('nombre_servicio', Tarea.nombre_servicio);
        params.set('asignado', Tarea.asignado);
        params.set('estado', Tarea.estado);
        params.set('titulo_ord', Tarea.titulo_ord);
        params.set('fecha_ejecucion_ord', Tarea.fecha_ejecucion_ord);
        params.set('fecha_limite_ord', Tarea.fecha_limite_ord);
        params.set('prioridad_ord', Tarea.prioridad_ord);
        params.set('pagina', Tarea.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'tareas', options).map((response: Response) => response.json());
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
