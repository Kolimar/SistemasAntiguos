//
// ===== Variables globales
//	Supongamos que declaramos la variable "version":
//	export const version: string="22.2.2";
////
//	Uso dentro del componente:
//
//	import * as Globales from '../../globals/globalesVar'; //<==== lo importamos
//
//	// dentro de la clase lo usamos:
//
//	version: Globales.version;
import {URLSearchParams} from '@angular/http';

export const patronEmail:string = "^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$";

export const urlApi:string = 'http://192.168.1.102/huxley/backend/public/';//entorno desarrollo

export const urlImagenes:string = '//192.168.1.102/huxley/backend/public/img/';// esta url es el redirect absoluto para las imagenes

//export const urlApi:string = '???'; //entorno produccion*


/**************************************************************************************/
/* Informacion de la aplicación en el entorno. Cambiar cuando se ponga en produccion. */
/**************************************************************************************/
export const data = new URLSearchParams();

data.append('grant_type', 'password');
data.append('client_id', '1');
data.append('client_secret', 'mAjzWK12fn5BBDmsq5Rm9B4ZKjL1w9Oizk1jSDbR');
data.append('scope', '');


/**************************************************************************************/
/**************************************************************************************/
/*  ***********************************/
