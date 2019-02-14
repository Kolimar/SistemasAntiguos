import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { BriefPrimeraReunion } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class BriefPrimeraReunionService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }

    getAll() {
        return this.http.get(ApiSettings.urlApi+'briefs-primera-reunion', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'briefs-primera-reunion/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(create: BriefPrimeraReunion) {
        return this.http.post(ApiSettings.urlApi+'briefs-primera-reunion', create, this.jwt()).map((response: Response) => response.json());
    }

    update(update: BriefPrimeraReunion) {
        return this.http.put(ApiSettings.urlApi+'briefs-primera-reunion/' + update.id, update, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'briefs-primera-reunion/' + id, this.jwt()).map((response: Response) => response.json());
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
