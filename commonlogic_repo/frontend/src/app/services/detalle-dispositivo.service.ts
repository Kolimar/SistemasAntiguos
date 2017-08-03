import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import * as global from '../globals/globalesVar';
import { AuthHttp } from 'ng2-bearer';

@Injectable()
export class DetalleDispositivoService {
isAdmin: boolean = false;
    auth;
    iots: any;
    constructor(public authHttp: AuthHttp) {
	 
    }
    getIot(uid) {
      //console.log(uid);
      return this.authHttp.get(global.urlApi+'statusiot?uid='+uid)
        .map(res => res.json());
    }    
    updateIot(iot){
      //console.log(iot);
      return this.authHttp.put(global.urlApi+'statusiot/'+iot.id,iot)
        .map(res => res.json());
    }
    currentIot(iot) {
      return this.authHttp.get(global.urlApi+'statusiot')
        .map(res => {
            return res.json();});
    }
    apagarIOT(iot){
       return this.authHttp.put(global.urlApi+'apagaiot/'+iot.id,iot)
        .map(res => res.json());
    }

}
