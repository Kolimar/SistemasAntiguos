import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { User } from '../models/index';
import { ApiSettings } from '../global/index';

@Injectable()
export class UserService {
    headers: Headers;
    constructor(private http: Http) {
      this.jwt();
    }
    getAll() {
        return this.http.get(ApiSettings.urlApi+'users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(ApiSettings.urlApi+'users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(ApiSettings.urlApi+'register', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(ApiSettings.urlApi+'users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(ApiSettings.urlApi+'users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getRoles() {
        return this.http.get(ApiSettings.urlApi+'listado-roles', this.jwt()).map((response: Response) => response.json());
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
