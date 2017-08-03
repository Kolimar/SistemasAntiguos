import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { ServicioTareaTemplate } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class ServicioTareaTemplateService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getAll(id: number) {
        return this.http.get(ApiSettings.urlApi+'servicios-tareas-templates/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: ServicioTareaTemplate) {
        return this.http.post(ApiSettings.urlApi+'servicios-tareas-templates', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: ServicioTareaTemplate) {
        return this.http.put(ApiSettings.urlApi+'servicios-tareas-templates/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'servicios-tareas-templates/' + id, this.jwt()).map((response: Response) => response.json());
    }

    search(ServicioTareaTemplate: any, id_servicio: any){
        let params = new URLSearchParams();
        params.set('id_servicio', id_servicio);
        params.set('titulo', ServicioTareaTemplate.titulo);
        params.set('descripcion', ServicioTareaTemplate.descripcion);
        params.set('tipo_tarea', ServicioTareaTemplate.tipo_tarea);
        params.set('es_critica', ServicioTareaTemplate.es_critica);
        params.set('ultimo_milestone', ServicioTareaTemplate.ultimo_milestone);
        params.set('dias_sugeridos', ServicioTareaTemplate.dias_sugeridos);
        params.set('asigna_pm_automatico', ServicioTareaTemplate.asigna_pm_automatico);
        params.set('titulo_ord', ServicioTareaTemplate.titulo_ord);
        params.set('pagina', ServicioTareaTemplate.pagina);
        params.set('action', 'search');
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        let options = new RequestOptions({ headers: this.headers, search: params });

        return this.http.get(ApiSettings.urlApi+'servicios-tareas-templates', options).map((response: Response) => response.json());
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
