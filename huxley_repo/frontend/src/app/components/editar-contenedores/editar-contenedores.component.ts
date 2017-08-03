import { Component, OnInit,OnDestroy, Input, Output, EventEmitter,AfterViewInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { TooltipModule, DropdownModule,SelectItem } from 'primeng/primeng';
import { ContenedorService } from '../../services/contenedor.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import {contenedores} from '../../interfaces/contenedores';

@Component({
  selector: 'app-editar-contenedores',
  templateUrl: './editar-contenedores.component.html',
  styleUrls: ['./editar-contenedores.component.scss']
})
export class EditarContenedoresComponent implements OnInit,OnDestroy {
  @Output() CambioScreen = new EventEmitter();
  @Input() contenedor;
private ngUnsubscribe: Subject<void> = new Subject<void>();

  cambioScreen(evento:string, data? , status?:string, toasty?){
    this.CambioScreen.emit({pantalla: evento, data: data , status: status, toasty: toasty});
  }


constructor( private _contenedorService:ContenedorService) { }

sizeFijo=true;
inputTipos;
filteredInputSizes=[];
filteredInputTipos = [];
created_at;
deposito_id;
fecha_ultimo_movimiento;

nombreDeposito;
contenedorEdit:contenedores = {
    "id":"",
    "codigo":"",
    "size":"",
    "tipo":"",
    "estado":"",
    "bloqueado":""

}


reqTipos(event) {
	this.filteredInputTipos = this.inputTipos[event.target.value];


}

public getListaAutocomplete() {

		this._contenedorService.getContenedoresLista().takeUntil(this.ngUnsubscribe).subscribe(res => {
			
			this.inputTipos = res.Tipos;
			var i = 0;
			for (var k in this.inputTipos) {

				this.filteredInputSizes[i] = k;
				i++;
			}
			//console.log(this.inputTipos);
			if (this.contenedor!=undefined){
				this.contenedorEdit.size = this.contenedor.size.toString();
				this.contenedorEdit.bloqueado = this.contenedor.bloqueado;
				this.contenedorEdit.codigo = this.contenedor.codigo;
				this.created_at = this.contenedor.created_at;
				this.deposito_id = this.contenedor.deposito_id;
				console.log(this.contenedor.estado);
				this.contenedorEdit.estado = this.contenedor.estado;
				this.fecha_ultimo_movimiento = this.contenedor.fecha_ultimo_movimiento;
				this.contenedorEdit.id = this.contenedor.id;
				this.nombreDeposito = this.contenedor.nombreDeposito;

				this.filteredInputTipos = this.inputTipos[this.contenedorEdit.size];
				this.contenedorEdit.tipo = this.contenedor.tipo.toString();
			
			}
		}, error => {
			console.error(error);
		});

	}

  submitContenedor(){
  	//console.log(this.contenedorEdit);
    this._contenedorService.editContenedor(
             this.contenedorEdit
            ).takeUntil(this.ngUnsubscribe)
            .subscribe(
                data => {
                    this.cambioScreen("cuentas","","success",{
                          title: "Contenedor editado",
                          msg: "",
                          showClose: false,
                          timeout: 5000,
                          theme: "bootstrap"
                      });
                  
                },
                error => {
                  this.cambioScreen("","","error",{
                        title: "",
                        msg: "Algo salió mal, intente mas tarde",
                        showClose: false,
                        timeout: 10000,
                        theme: "bootstrap"
                    });

                }
            );
  	
  }


ngOnDestroy(){
	this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
}
  ngOnInit() {
  	this.getListaAutocomplete();
		  	
  }

}
