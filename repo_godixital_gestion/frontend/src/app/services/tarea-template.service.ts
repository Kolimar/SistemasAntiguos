import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { TareaTemplate } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class TareaTemplateService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getAll() {
        return this.http.get(ApiSettings.urlApi+'tareas-templates', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'tareas-templates-actualizar/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: TareaTemplate) {
        return this.http.post(ApiSettings.urlApi+'tareas-templates', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: TareaTemplate) {
        return this.http.put(ApiSettings.urlApi+'tareas-templates/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'tareas-templates/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getListado() {
        return this.http.get(ApiSettings.urlApi+'listado-tareas-templates', this.jwt()).map((response: Response) => response.json());
    }

    search(TareaTemplate: any){
        let params = new URLSearchParams();
        params.set('titulo', TareaTemplate.titulo);
        params.set('descripcion', TareaTemplate.descripcion);
        params.set('tipo_tarea', TareaTemplate.tipo_tarea);
        params.set('es_critica', TareaTemplate.es_critica);
        params.set('ultimo_milestone', TareaTemplate.ultimo_milestone);
        params.set('dias_sugeridos', TareaTemplate.dias_sugeridos);
        params.set('asigna_pm_automatico', TareaTemplate.asigna_pm_automatico);
        params.set('titulo_ord', TareaTemplate.titulo_ord);
        params.set('pagina', TareaTemplate.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'tareas-templates', options).map((response: Response) => response.json());
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
