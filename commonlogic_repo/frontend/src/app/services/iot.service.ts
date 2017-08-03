import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import * as global from '../globals/globalesVar';
import { AuthHttp } from 'ng2-bearer';

@Injectable()
export class IotService {
isAdmin: boolean = false;
    auth;
    iots: any;
    constructor(public authHttp: AuthHttp) {
	 
    }
    getIot(uid,pagina) {
      //console.log(uid);
      return this.authHttp.get(global.urlApi+'dispositivos?uid='+uid+'&page=' + pagina+'&per_page=15&sort_by=identificador')
        .map(res => res.json());
    }
    searchIot(uid,
      pagina,
      busquedaleyenda,
      busquedanumero_de_serie,
      busquedaubicacion_actual,
      busquedaestado,
      sort_by,
      sort_bydesc) {
      //console.log(uid);
       if (sort_by!='false') {
       return this.authHttp.get(global.urlApi+'dispositivos?uid='+uid+'&page=' + pagina+'&per_page=15&sort_by_desc=identificador&leyenda='+busquedaleyenda+'&numero_de_serie='+busquedanumero_de_serie+'&ubicacion_actual='+busquedaubicacion_actual+'&estado='+busquedaestado+'&sort_by='+sort_by)
        .map(res => res.json());
         }else if (sort_bydesc!='false' ){
          return this.authHttp.get(global.urlApi+'dispositivos?uid='+uid+'&page=' + pagina+'&per_page=15&sort_by_desc=identificador&leyenda='+busquedaleyenda+'&numero_de_serie='+busquedanumero_de_serie+'&ubicacion_actual='+busquedaubicacion_actual+'&estado='+busquedaestado+'&sort_by_desc='+sort_bydesc)
        .map(res => res.json());
          }else{
           return this.authHttp.get(global.urlApi+'dispositivos?uid='+uid+'&page=' + pagina+'&per_page=15&sort_by_desc=identificador&leyenda='+busquedaleyenda+'&numero_de_serie='+busquedanumero_de_serie+'&ubicacion_actual='+busquedaubicacion_actual+'&estado='+busquedaestado+'&sort_by=identificador')
        .map(res => res.json());
        }
      
    }
    getVars(idDispositivo) {
      
      return this.authHttp.get(global.urlApi+'variables/'+idDispositivo)
        .map(res => res.json());
    }
    newIot(iot){
      //console.log(iot);
      return this.authHttp.post(global.urlApi+'dispositivos',iot)
        .map(res => res.json());
    }
    getHistorico(dispositivo, inicio, fin){

      return this.authHttp.get(global.urlApi+'historico'+'?iotID='+dispositivo+'&inicio='+inicio+'&fin='+fin)
        .map(res => res.json());
    }
    deleteIot(iot){
      return this.authHttp.delete(global.urlApi+'dispositivos',iot)
        .map(res => res.json());
    }
    updateIot(dispositivo){

      //console.log(dispositivo);
      return this.authHttp.put(global.urlApi+'updateDispositivos',dispositivo)
        .map(res => res.json());
    }
    currentIot(iot) {
      return this.authHttp.get(global.urlApi+'statusiot')
        .map(res => {
            return res.json();});
    }


}
