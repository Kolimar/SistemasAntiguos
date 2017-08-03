import { Component, OnInit,OnDestroy,Output,EventEmitter } from '@angular/core';
import { ContenedorService } from '../../services/contenedor.service';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule} from 'primeng/primeng';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router, ActivatedRoute } from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { Observable } from "rxjs/Observable";
import { egreso } from "../../interfaces/movimientoE";
//take until y subject son la respuesta oficial de angular al 2017/04/09 para desuscribirse a observables.-
//https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
//private ngUnsubscribe: Subject<void> = new Subject<void>();
//
/*
this.myThingService.getThings()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(things => console.log(things));
 ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
*/

@Component({
  selector: 'app-registrar-egreso',
  templateUrl: './registrar-egreso.component.html',
  styleUrls: ['./registrar-egreso.component.scss']
})
export class RegistrarEgresoComponent implements OnInit,OnDestroy {

private ngUnsubscribe: Subject<void> = new Subject<void>();

formvalid=false;
peticionLista;
tipoAccion:string="EGRESO";
condition:boolean=false;
bookingActual="0";
editarLimite:boolean=true;
contenedor;
formEgreso: egreso = {

		"inputOperador":  "",
		"InputContenedor":  "",
		"InputSizes":  "",							
		"inputTipo": "",
		"InputCliente" :  "",
		"inputDireccion":  "",
		"Inputbuque": "",
		"inputTerminal": "",
		"inputBooking" :  "",
		"InputPatente" :  "",		
		"inputDocumento": "",
		"inputNombre": "",
		"inputEmpresa" :  "",
		"inputPatente_semi" :  "",
		"inputObs" :  "",
		"inputLimite" : "1"
	};
respuestaLista;

//DECLARACIONES AUTOCOMPLETE

public dataServiceClientes: CompleterData;
public listaClientes;

public dataServiceContenedores: CompleterData;
public listaContenedores;


public dataServiceSizes: CompleterData;
public listaSizes;

public filteredInputSizes = [];

public dataServiceTransportista: CompleterData;
public listaTransportista;

public dataServiceBookings: CompleterData;
public listaBookings;

public dataServicebuque: CompleterData;
public listabuques;


//DECLARACIONES DE INPUTS

public inputTipos = [];
public filteredInputTipos = [];
public inputTerminales = [];
public inputOperadores = [];
public inputDepositos = [];

//FIN DECLARACIONES DE INPUTS

contenedorSeleccionado = false;


constructor(private completerService: CompleterService,private router: Router, private _ListarCosasService:ContenedorService,private toastyService:ToastyService,
 private toastyConfig: ToastyConfig  ) {
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";
     }

  ngOnInit() {

	this.getListaAutocomplete();


  }
/***********************************************************************************************************/
/***********************************************************************************************************/
//eventos change
/***********************************************************************************************************/
/***********************************************************************************************************/

reqTipos(event){
	this.filteredInputTipos = this.inputTipos[event.target.value];	
}


/***********************************************************************************************************/
/***********************************************************************************************************/
//eventos SELECT
/***********************************************************************************************************/
/***********************************************************************************************************/

public seleccionadoCliente(item: CompleterItem){
	this.evalForm();
	if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
	if (item) {
		this.formEgreso.InputCliente = item? item.title: "";
		if (item.originalObject) {
			this.formEgreso.inputDireccion= item.originalObject.direccion;
		}else{
			console.log("no original");
		}	
	}else{
		this.formEgreso.inputDireccion="";
	}

}

public seleccionadoBuque(item: CompleterItem){
	this.evalForm();
	if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
	if (item) {
		this.formEgreso.Inputbuque = item? item.title: "";	
	}
	
}



	public seleccionadoContenedor(item: CompleterItem) {
		this.evalForm();
		if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
		var x = document.getElementsByClassName("contenedoresAC");
		if (item) {
			this.contenedorSeleccionado = true;
			this.formEgreso.InputContenedor = item ? item.title : "";
			if (item.originalObject) {
				if (item.originalObject.bloqueado == "Bloqueado" || item.originalObject.nombreDeposito == null) {
					x["0"].style.borderColor = "red";
				} else {
					x["0"].style.borderColor = "green";
				}
				//console.log(item.originalObject);
				this.formEgreso.InputSizes = item.originalObject.size;

				this.filteredInputTipos = this.inputTipos[item.originalObject.size];

				/*this.formEgreso.inputEstado = item.originalObject.estado;*/

				this.formEgreso.inputTipo = item.originalObject.tipo;
				//console.log(this.formEgreso.filteredInputTipos);

				this.condition = true;
			} else {
				console.log("no original");
				/*this.formEgreso.InputSizes = 20;*/

			}
		} else {
			this.contenedorSeleccionado = false;
			x["0"].style.borderColor = "inherit";
			this.condition = false;
			this.formEgreso.InputSizes = "";
			this.formEgreso.inputTipo = "";
		}
		//console.log(this.InputContenedor);

	}

	public seleccionadoTransportista(item: CompleterItem) {
		this.evalForm();
		if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
		if (item) {
			if (item.originalObject) {
				//console.log(item.originalObject);
				this.formEgreso.inputDocumento = item.originalObject.documento;
				this.formEgreso.inputNombre = item.originalObject.nombre;
				this.formEgreso.inputPatente_semi = item.originalObject.patente_semi;
				this.formEgreso.inputEmpresa = item.originalObject.empresa;
			} else {
				console.log("no");
			}
		}

	}
	public seleccionadoBooking(item: CompleterItem) {
		this.evalForm();
		if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
		if (item) {
			this.formEgreso.inputBooking = item? item.title: "";
		if (item.originalObject) {
			this.editarLimite=true;
			this.formEgreso.inputLimite= item.originalObject.limite_contenedores.toString();
			this.bookingActual=item.originalObject.cantidad_egresos.toString();
		}else{
			console.log("no original");
		}	
			}else{
				this.formEgreso.inputLimite="1";
				this.bookingActual="0";
				this.editarLimite=false;
			}

	}



/***********************************************************************************************************/
/***********************************************************************************************************/
//eventos NO FOCUS
/***********************************************************************************************************/
/***********************************************************************************************************/

public noFocusCliente(){
	this.evalForm();
	if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
	console.log(this.formvalid);
}
public noFocusTransportista(){
	this.evalForm();
	 if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
}
public noFocusBuque(){
	this.evalForm();
	 if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
}
public noFocusContenedor(item: CompleterItem){
	this.evalForm();
if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" )
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
	/*if (item) {
		this.InputContenedor = item? item.title: "";
		var x = document.getElementsByClassName("contenedoresAC");
		if (item.originalObject) {
			if(item.originalObject.bloqueado=="Bloqueado"){
				x["0"].style.borderColor = "red";
			}else{
				x["0"].style.borderColor = "green";
			}
			this.InputSizes = item.originalObject.size;
			this.filteredInputTipos = this.inputTipos[item.originalObject.size];
			this.inputEstado = item.originalObject.estado;
			this.inputTipo = item.originalObject.tipo;
			//console.log(this.filteredInputTipos);

		}else{
			console.log("no original");
		}	
	}else{
		this.InputSizes= 0;
		this.inputTipo= "";
	}*/
}


	submitForm(formulario) {
		this.evalForm();
		console.log(this.contenedorSeleccionado);
		console.log( this.formEgreso);
		if (!this.contenedorSeleccionado) {
			this.toastyService.info(
					{
						title: "Faltan completar campos",
						msg: "Por Favor ingrese un CONTENEDOR válido",
						showClose: true,
						timeout: 10000,
						theme: "bootstrap"
					}
				);

		}else{
			if (this.formEgreso.InputContenedor.trim() != "" && this.formEgreso.InputPatente.trim() != "" && this.formEgreso.InputCliente.trim() != "" && this.formEgreso.inputBooking.trim() != "" && Number(this.bookingActual) < Number(this.formEgreso.inputLimite)) {
			this._ListarCosasService.submitFormularioIngreso(
				this.tipoAccion, this.formEgreso).takeUntil(this.ngUnsubscribe).subscribe(
				res => {
					this.router.navigate(['/movimientos']);
				}, error => {
					if (error.status != 500) {
						this.toastyService.info(
							{
								title: "Hubo un problema",
								msg: error._body,
								showClose: true,
								timeout: 10000,
								theme: "bootstrap"
							}
						);
					} else {
						this.toastyService.error(
							{
								title: "Hubo un error inesperado",
								msg: "Por favor intente en unos momentos o recargue el navegador",
								showClose: true,
								timeout: 10000,
								theme: "bootstrap"
							}
						);
					}

				}

				);

		} else {
			if (this.formEgreso.InputContenedor.trim() == "") {
				this.toastyService.info(
					{
						title: "Faltan completar campos",
						msg: "Por Favor ingrese correctamente el CONTENEDOR",
						showClose: true,
						timeout: 10000,
						theme: "bootstrap"
					}
				);
			}
			if (this.formEgreso.InputCliente.trim() == "") {
				this.toastyService.info(
					{
						title: "Faltan completar campos",
						msg: "Por Favor ingrese correctamente el CLIENTE",
						showClose: true,
						timeout: 10000,
						theme: "bootstrap"
					}
				);
			}
			if (Number(this.bookingActual) >= Number(this.formEgreso.inputLimite)) {
				this.toastyService.info(
					{
						title: "Booking sin límite o inválido",
						msg: "Por Favor ingrese un booking con más cantidad o aumente la actual.",
						showClose: true,
						timeout: 10000,
						theme: "bootstrap"
					}
				);
			}
			if (this.formEgreso.inputBooking.trim() == "") {
				this.toastyService.info(
					{
						title: "Faltan completar campos",
						msg: "Por Favor ingrese un booking",
						showClose: true,
						timeout: 10000,
						theme: "bootstrap"
					}
				);
			}
			if (this.formEgreso.InputPatente.trim() == "") {
				this.toastyService.info(
					{
						title: "Faltan completar campos",
						msg: "Por Favor ingrese correctamente la PATENTE DEL TRACTOR",
						showClose: true,
						timeout: 10000,
						theme: "bootstrap"
					}
				);
			}

		}
	}

	}

//eventos GET DE LISTA
public getListaAutocomplete(){

 	this.peticionLista = this._ListarCosasService.getContenedoresLista().takeUntil(this.ngUnsubscribe).subscribe(res=>{
 		console.log(res);
 		this.respuestaLista = res;
 		this.listaClientes = res.Cliente;
 		this.listaContenedores = res.Contenedor;
 		this.listabuques = res.buques;
 		this.dataServiceClientes = this.completerService.local(this.listaClientes, 'nombre','nombre');
 		this.dataServiceContenedores = this.completerService.local(this.listaContenedores, 'codigo','codigo').descriptionField("bloqueado");
 		
 		this.listaBookings = res.Bookings;
 		this.dataServiceBookings = this.completerService.local(this.listaBookings, 'codigo','codigo');
 		this.dataServicebuque = this.completerService.local(this.listabuques, 'nombre','nombre');
 		this.inputTipos = res.Tipos;
 		this.inputTerminales = res.Terminales;
 		this.inputOperadores = res.Operadores;
 		this.inputDepositos = res.Depositos;
 		this.listaTransportista = res.Transportista;
 		this.dataServiceTransportista = this.completerService.local(this.listaTransportista, 'patente','patente');
 		this.formEgreso.inputOperador = "MAERSK";
 		var i=0;
 		for(var k in this.inputTipos){
 			this.filteredInputSizes[i] = k;
 			i++;
 		}
 		//console.log(this.inputTipos);
 		
 	},error=>{
 		console.log('algo salio mal');
 	});

 }

cancelForm(){
	
	this.router.navigate(['/movimientos']);
}
mayusContenedor(evento) {
	this.formEgreso.InputContenedor = this.formEgreso.InputContenedor.toUpperCase();
}
mayusCliente(evento){
	this.formEgreso.InputCliente = this.formEgreso.InputCliente.toUpperCase();
}
mayusBuque(evento){
	this.formEgreso.Inputbuque = this.formEgreso.Inputbuque.toUpperCase();
}
mayusBooking(evento){
	this.formEgreso.inputBooking = this.formEgreso.inputBooking.toUpperCase();
}
mayusPatente(evento){
	this.formEgreso.InputPatente = this.formEgreso.InputPatente.toUpperCase();
}
evalForm(){
	if (this.formEgreso.InputContenedor.trim() != "" &&
	 this.formEgreso.InputPatente.trim() != "" &&
	  this.formEgreso.InputCliente.trim() != "")
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
}
 ngOnDestroy(){
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }




		formValido(form){
			if (!form) {
				return true;
			}else if(!this.formvalid){
				return true;
			}else{
				return false; 
			}
		}


}
