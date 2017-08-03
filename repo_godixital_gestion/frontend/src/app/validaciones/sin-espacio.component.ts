import { AbstractControl } from '@angular/forms';

export class Validaciones{

	// VERIFICAR ESPACIOS EN BLANCO
	static verificarEspacios(c: AbstractControl){

		var valor= /^\s+/g;

		if(c.value == null || c.value == [] || c.value == "") {
			return null;
		}
		if(c.value.search(valor) >= 0) {
			return { sinEspacios: true }
		}
		return null;
	}

	// MAYORES A CERO
	static verificarMayorCero(c: AbstractControl){

		if(c.value == null || c.value == [] || c.value == "") {
			return null;
		}
		if(c.value == 0) {
			return { mayorCero: true }
		}
		return null;
	}

	// SI ESTA CHECQUEADO
	static isCheck(c: AbstractControl){

		if(c.value) {
			return null;
		}else{
			return { check: false }
		}

	}

}
