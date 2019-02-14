import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ContenedorService } from '../../services/contenedor.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/primeng';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Observable } from "rxjs/Observable";
import { remision } from "../../interfaces/movimientoR";
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'app-registrar-remision',
	templateUrl: './registrar-remision.component.html',
	styleUrls: ['./registrar-remision.component.scss']
})
export class RegistrarRemisionComponent implements OnInit, OnDestroy {

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	peticionLista;

	tipoAccion: string = "REMISION";
	
	condition: boolean = false;

	contenedor;

	formRemision: remision = {

		"inputOperador": "",
		"InputSizes": "",
		"inputTipo": "",

		"InputContenedor": "",
		"inputTerminal": "",
		"InputPatente": "",
		"inputDocumento": "",
		"inputNombre": "",
		"inputEmpresa": "",
		"inputPatente_semi": "",
		"inputObs": ""
	};

	respuestaLista;
	//DECLARACIONES AUTOCOMPLETE

	public dataServiceContenedores: CompleterData;
	public listaContenedores;
	public dataServiceSizes: CompleterData;
	public listaSizes;
	public dataServiceTransportista: CompleterData;
	public listaTransportista;
	public dataServicebuque: CompleterData;
	public listabuques;


	//DECLARACIONES DE INPUTS

	public filteredInputSizes = [];
	public inputTipos = [];
	public filteredInputTipos = [];
	public inputTerminales = [];
	public inputOperadores = [];
	public inputDepositos = [];

	//FIN DECLARACIONES DE INPUTS


	contenedorSeleccionado = false;

	constructor(private completerService: CompleterService, private router: Router, private _ListarCosasService: ContenedorService, private toastyService: ToastyService,
		private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
		this.toastyConfig.position = "top-right";
	}
	evalForm(){
		if (this.formRemision.InputContenedor.trim() != "" &&
		 this.formRemision.InputPatente.trim() != "" )
		{
			this.formvalid = true;
		}else{
			this.formvalid = false;
		}
	}
	ngOnInit() {
		this.evalForm();
		this.getListaAutocomplete();

	}
	/***********************************************************************************************************/
	/***********************************************************************************************************/
	//eventos change
	/***********************************************************************************************************/
	/***********************************************************************************************************/

	reqTipos(event) {
		this.filteredInputTipos = this.inputTipos[event.target.value];
	}


	/***********************************************************************************************************/
	/***********************************************************************************************************/
	//eventos SELECT
	/***********************************************************************************************************/
	/***********************************************************************************************************/

	public seleccionadoContenedor(item: CompleterItem) {
		this.evalForm();

		var x = document.getElementsByClassName("contenedoresAC");
		if (item) {
			this.contenedorSeleccionado = true;
			this.formRemision.InputContenedor = item ? item.title : "";
			if (item.originalObject) {
				if (item.originalObject.bloqueado == "Bloqueado" || item.originalObject.nombreDeposito == null) {
					x["0"].style.borderColor = "red";
				} else {
					x["0"].style.borderColor = "green";
				}
				//console.log(item.originalObject);
				this.formRemision.InputSizes = item.originalObject.size;

				this.filteredInputTipos = this.inputTipos[item.originalObject.size];

				/*this.formRemision.inputEstado = item.originalObject.estado;*/

				this.formRemision.inputTipo = item.originalObject.tipo;
				//console.log(this.formRemision.filteredInputTipos);

				this.condition = true;
			} else {
				console.log("no original");
				/*this.formRemision.InputSizes = 20;*/

			}
		} else {
			this.contenedorSeleccionado = false;
			x["0"].style.borderColor = "inherit";
			this.condition = false;
			this.formRemision.InputSizes = "";
			this.formRemision.inputTipo = "";
		}
		//console.log(this.InputContenedor);

	}

	public seleccionadoTransportista(item: CompleterItem) {
		this.evalForm();
		if (item) {
			if (item.originalObject) {
				//console.log(item.originalObject);
				this.formRemision.inputDocumento = item.originalObject.documento;
				this.formRemision.inputNombre = item.originalObject.nombre;
				this.formRemision.inputPatente_semi = item.originalObject.patente_semi;
				this.formRemision.inputEmpresa = item.originalObject.empresa;
			} else {
				console.log("no");
			}
		}

	}




	/***********************************************************************************************************/
	/***********************************************************************************************************/
	//eventos NO FOCUS
	/***********************************************************************************************************/
	/***********************************************************************************************************/
	public noFocusTransportista(){
		this.evalForm();

	}
	public noFocusContenedor(item: CompleterItem) {
		this.evalForm();
		
	}
	submitForm(formulario) {
		//console.log(this.contenedorSeleccionado);

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
			if (this.formRemision.InputContenedor.trim() != "" && this.formRemision.InputPatente.trim() != "") {
			this._ListarCosasService.submitFormularioIngreso(
				this.tipoAccion, this.formRemision).takeUntil(this.ngUnsubscribe).subscribe(
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
			if (this.formRemision.InputContenedor.trim() == "") {
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
			if (this.formRemision.InputPatente.trim() == "") {
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
	public getListaAutocomplete() {

		this.peticionLista = this._ListarCosasService.getContenedoresLista().takeUntil(this.ngUnsubscribe).subscribe(res => {
			console.log(res);
			this.respuestaLista = res;
			this.listaContenedores = res.Contenedor;
			this.listabuques = res.buques;
			this.dataServiceContenedores = this.completerService.local(this.listaContenedores, 'codigo', 'codigo').descriptionField("bloqueado");
			this.inputTipos = res.Tipos;
			this.inputTerminales = res.Terminales;
			this.inputOperadores = res.Operadores;
			this.inputDepositos = res.Depositos;
			this.listaTransportista = res.Transportista;
			this.dataServiceTransportista = this.completerService.local(this.listaTransportista, 'patente', 'patente');
			this.formRemision.inputOperador = "MAERSK";
			var i = 0;
			for (var k in this.inputTipos) {
				this.filteredInputSizes[i] = k;
				i++;
			}
			//console.log(this.inputTipos);

		}, error => {
			console.log('algo salio mal');
		});

	}
	formvalid=false;
	formValido(form){
			if (!form) {
				return true;
			}else if(!this.formvalid){
				return true;
			}else{
				return false; 
			}
		}
	//
	//MAYUSCULEAR
	//
	cancelForm(){
		
		this.router.navigate(['/movimientos']);
	}
	mayusContenedor(evento) {
	this.formRemision.InputContenedor = this.formRemision.InputContenedor.toUpperCase();
	}
	mayusPatente(evento){
		this.formRemision.InputPatente = this.formRemision.InputPatente.toUpperCase();
	}
	ngOnDestroy() {
		//console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    //console.log(this.ngUnsubscribe);
	}

}
