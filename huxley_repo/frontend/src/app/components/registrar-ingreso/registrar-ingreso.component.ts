import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ContenedorService } from '../../services/contenedor.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/primeng';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Observable } from "rxjs/Observable";
import { ingreso } from "../../interfaces/movimiento";
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { RefreshloginComponent } from '../refreshlogin/refreshlogin.component';

@Component({
	selector: 'app-registrar-ingreso',
	templateUrl: './registrar-ingreso.component.html',
	styleUrls: ['./registrar-ingreso.component.scss']
})
export class RegistrarIngresoComponent implements OnInit, OnDestroy {
	private ngUnsubscribe: Subject<void> = new Subject<void>();

/*REFRESH LOGIN*/  
  
  modal=false;

/* FIN REFRESH LOGIN*/
	peticionLista;
	tipoAccion: string = "INGRESO";
	condition: boolean = false;

	contenedor;
	formIngreso: ingreso = {

		"InputCliente": "",
		"InputContenedor": "",
		"InputSizes": "",
		"InputPatente": "",
		"inputTipo": "",
		"inputEstado": "",
		"inputTerminal": "",
		"inputOperador": "",
		"inputDeposito": "",

		"inputDocumento": "",
		"inputNombre": "",
		"inputPatente_semi": "",
		"inputEmpresa": "",

		"inputObs": ""
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

	//DECLARACIONES DE INPUTS

	public inputTipos = [];
	public filteredInputTipos = [];
	public inputTerminales = [];
	public inputOperadores = [];
	public inputDepositos = [];

	//FIN DECLARACIONES DE INPUTS




	constructor(private completerService: CompleterService, private router: Router, private _ListarCosasService: ContenedorService,
		private toastyService: ToastyService,
		private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
		this.toastyConfig.position = "top-right";

	}
formvalid=false;
	ngOnInit() {

		this.getListaAutocomplete();


	}
	/***********************************************************************************************************/
	/***********************************************************************************************************/
	//eventos change
	/***********************************************************************************************************/
	/***********************************************************************************************************/

	reqTipos(event) {
		this.filteredInputTipos = this.inputTipos[event.target.value];
		console.log(typeof this.formIngreso.inputTipo);
			console.log(typeof this.formIngreso.InputSizes);
	}

evalForm(){
	if (this.formIngreso.InputContenedor.trim() != "" &&
	 this.formIngreso.InputPatente.trim() != "" &&
	  this.formIngreso.InputCliente.trim() != "")
	{
		this.formvalid = true;
	}else{
		this.formvalid = false;
	}
}
	/***********************************************************************************************************/
	/***********************************************************************************************************/
	//eventos SELECT
	/***********************************************************************************************************/
	/***********************************************************************************************************/

	public seleccionadoCliente(item: CompleterItem) {
		this.evalForm();
		//console.log(item);
		this.formIngreso.InputCliente = item ? item.title : "";
		//console.log(this.InputCliente);

	}
	public seleccionadoContenedor(item: CompleterItem) {
		this.evalForm();
		var x = document.getElementsByClassName("contenedoresAC");
		if (item) {
			this.formIngreso.InputContenedor = item ? item.title : "";
			if (item.originalObject) {
				if (item.originalObject.bloqueado == "Bloqueado" || item.originalObject.nombreDeposito != null) {
					x["0"].style.borderColor = "red";
				} else {
					x["0"].style.borderColor = "green";
				}
				//console.log(item.originalObject);
				this.formIngreso.InputSizes = item.originalObject.size;

				this.filteredInputTipos = this.inputTipos[item.originalObject.size];

				this.formIngreso.inputEstado = item.originalObject.estado;

				this.formIngreso.inputTipo = item.originalObject.tipo;
				//console.log(this.formIngreso.filteredInputTipos);

				this.condition = true;
			} else {
				console.log("no original");
				/*this.formIngreso.InputSizes = 20;*/

			}
		} else {
			x["0"].style.borderColor = "inherit";
			this.condition = false;
			this.formIngreso.InputSizes = "";
			this.formIngreso.inputTipo = "";
		}
		//console.log(this.InputContenedor);

	}

	public seleccionadoTransportista(item: CompleterItem) {
		this.evalForm();
		if (item) {
			if (item.originalObject) {
				//console.log(item.originalObject);
				this.formIngreso.inputDocumento = item.originalObject.documento;
				this.formIngreso.inputNombre = item.originalObject.nombre;
				this.formIngreso.inputPatente_semi = item.originalObject.patente_semi;
				this.formIngreso.inputEmpresa = item.originalObject.empresa;
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
	public noFocusCliente() {
		this.evalForm();
		//console.log(this.InputCliente);
	}

	public noFocusTransportista() {
		this.evalForm();
		//console.log(this.InputTransportista);
	}

	public noFocusContenedor(item: CompleterItem) {
		this.evalForm();
		/*
		console.log(item);
		this.InputSizes = -1;
		if (this.inputTipo == "") {
			// code...
		}
		this.inputTipo = "";
		this.inputEstado  = "OK";*/
		//console.log(this.InputContenedor);
	}


	submitForm(formulario) {
		this.evalForm();

		if (this.formIngreso.InputCliente.trim() != "" && this.formIngreso.InputContenedor.trim() != "" && this.formIngreso.InputPatente.trim() != "") {
			this._ListarCosasService.submitFormularioIngreso(
				this.tipoAccion, this.formIngreso).takeUntil(this.ngUnsubscribe).subscribe(
				res => {
					this.printEval=true;
					this.print();
					this.router.navigate(['/movimientos']);
				}, error => {
					 if (error.status == 403 || error.status == 401) {
				           this.modal = true;
				         }
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
			if (this.formIngreso.InputCliente.trim() == "") {
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
			if (this.formIngreso.InputContenedor.trim() == "") {
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
			if (this.formIngreso.InputPatente.trim() == "") {
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
		/**/



	}
	//eventos GET DE LISTA
	public getListaAutocomplete() {

		this.peticionLista = this._ListarCosasService.getContenedoresLista().takeUntil(this.ngUnsubscribe).subscribe(res => {
			console.log(res);
			this.respuestaLista = res;
			this.listaClientes = res.Cliente;
			this.listaContenedores = res.Contenedor;
			this.dataServiceClientes = this.completerService.local(this.listaClientes, 'nombre', 'nombre');
			this.dataServiceContenedores = this.completerService.local(this.listaContenedores, 'codigo', 'codigo').descriptionField("nombreDeposito");
			this.inputTipos = res.Tipos;
			this.inputTerminales = res.Terminales;
			this.inputOperadores = res.Operadores;
			this.formIngreso.inputOperador = "MAERSK";
			this.inputDepositos = res.Depositos;
			this.listaTransportista = res.Transportista;
			this.dataServiceTransportista = this.completerService.local(this.listaTransportista, 'patente', 'patente');
			var i = 0;
			for (var k in this.inputTipos) {
				this.filteredInputSizes[i] = k;
				i++;
			}

			//console.log(this.inputTipos);

		}, error => {
			if (error.status == 403 || error.status == 401) {
				           this.modal = true;
				         }
			console.log('algo salio mal');
		});

	}

	cancelForm(){
		
		this.router.navigate(['/movimientos']);
	}
	//
	//MAYUSCULEAR
	//
mayusContenedor(evento) {
	this.formIngreso.InputContenedor = this.formIngreso.InputContenedor.toUpperCase();
}
mayusCliente(evento){
	this.formIngreso.InputCliente = this.formIngreso.InputCliente.toUpperCase();
}
mayusPatente(evento){
	this.formIngreso.InputPatente = this.formIngreso.InputPatente.toUpperCase();
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

/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
printEval=false;
print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printSection').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto,toolbar=0');
    popupWin.document.open();

	

    popupWin.document.write(`      
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
        <title>Recibo</title>
        <style>
        @page { margin: 0; }
        </style>
    </head>
    <body onload="window.print();window.close()" style="width: 345px;margin:0 auto;border:solid 1px black;text-align: center;font-family: calibri">
        <h1>HUXLEY S.A.</h1>
        <h3>Constancia de ingreso</h3>
        <div class="row">
            <div style="float: left;padding: 15px;">xx/xx/xxxx xx:xx:xx</div>
            <div style="float: right;padding: 15px;">Nro. xxxxxxxxxx</div>
        </div>
        <div style="clear:both;"><hr/></div>
        <div class="row">
            <div style="float: left;padding: 15px;text-align: left;">
                <table>
                    <tr><td>Contenedor nro.</td><td>${this.formIngreso.InputContenedor}	</td></tr>
                    <tr><td>Size:</td><td>${this.formIngreso.InputSizes}	</td></tr>
                    <tr><td>Tipo:</td><td>${this.formIngreso.inputTipo}	</td></tr>
                    <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
                    <tr><td><b>Cliente:</b></td><td><b>${this.formIngreso.InputCliente}</b></td></tr>
                    <tr><td>Domicilio:</b></td><td>-</td></tr>
                </table>
            </div>
        </div>
        <div style="clear:both;"><hr/></div>
        <div class="row">
            <div style="float: left;padding: 15px;text-align: left;">
                <table>
                    <tr><td>Buque:</td><td>------------</td></tr>
                    <tr><td>Terminal:</td><td>${this.formIngreso.inputTerminal}</td></tr>
                    <tr><td>Deposito:</td><td>${this.formIngreso.inputDeposito}	</td></tr>
                </table>
            </div>
            <div style="float: right;padding: 15px;">&nbsp;</div>
        </div>
        <div style="clear:both;"><hr/></div>
        <div class="row">
            <div style="float: left;padding: 15px;text-align: left;">
                <table>
                    <tr><td>Chofer:</td><td>${this.formIngreso.inputNombre}	</td></tr>
                    <tr><td>Documento:</td><td>${this.formIngreso.inputDocumento}	</td></tr>
                    <tr><td>Patente Tractor:</td><td>${this.formIngreso.InputPatente}</td></tr>
                    <tr><td>Patente Semi:</td><td>${this.formIngreso.inputPatente_semi}	</td></tr>
                </table>
            </div>
            <div style="float: right;padding: 15px;">&nbsp;</div>
        </div>
        <div style="clear:both;"><hr/></div>
        <div class="row">
            <div style="float: left;padding: 15px;text-align: left;">
                <table>
                    <tr><td>Observaciones:</td><td>${this.formIngreso.inputObs}</td></tr>
                </table>
            </div>
            <div style="float: right;padding: 15px;">&nbsp;</div>
        </div>
        <div style="clear:both;"><hr/></div>
        <br/><br/>
        <div class="row">
            <div style="float: left;padding: 29px;text-align: left;">
                <hr/>
                Operador ${this.formIngreso.inputOperador}
                
            </div>
            <div style="float: right;padding: 29px;">
                <hr/>
                Chofer Transporte ${this.formIngreso.inputEmpresa}	

            </div>
        </div>
        <div style="clear:both;"></div>
    </body>
</html>`);
    popupWin.document.close();
}
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
	///////////////////////////////

	ngOnDestroy() {
		console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
	}
}
