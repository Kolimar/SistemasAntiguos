import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { TooltipModule, DropdownModule,SelectItem } from 'primeng/primeng';
import { IotService } from '../../services/iot.service';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'crear-dispositivo',
  templateUrl: './crear-dispositivo.component.html',
  styleUrls: ['./crear-dispositivo.component.scss']
})
export class CrearDispositivoComponent implements OnInit {
@Output() CambioScreen = new EventEmitter();
cambioScreen(evento:string, data? , status?:string, toasty?){
    this.CambioScreen.emit({pantalla: evento, data: data , status: status, toasty: toasty});
  }
formNuevodispositivo:FormGroup;
constructor( private form_dispositivo: FormBuilder, private _iotService:IotService, private _userservice:UserService) { 

}

var1_maximo:number = 0;
var1_minimo:number = 0;
var1_nombre:string = '';
var1_rango_max:number = 0;
var1_rango_min:number = 0;
var2_maximo:number = 0;
var2_minimo:number = 0;
var2_nombre:string = '';
var2_rango_max:number = 0;
var2_rango_min:number = 0;
var3_maximo:number = 0;
var3_minimo:number = 0;
var3_nombre:string = '';
var3_rango_max:number = 0;
var3_rango_min:number = 0;
var4_maximo:number = 0;
var4_minimo:number = 0;
var4_nombre:string = '';
var4_rango_max:number = 0;
var4_rango_min:number = 0;
var5_maximo:number = 0;
var5_minimo:number = 0;
var5_nombre:string = '';
var5_rango_max:number = 0;
var5_rango_min:number = 0;
var1_status:boolean=false;
var2_status:boolean=false;
var3_status:boolean=false;
var4_status:boolean=false;
var5_status:boolean=false;

private disabled: boolean = false;

peticionLista;
users;

/*// disable input box
disableInput(): void {
   this.disabled = true;
}


// enable input box
enableInput(): void {
   this.disabled = false;
}*/

listarUsuarios(){
  this.peticionLista = this._userservice.getAll().subscribe(res => {
            this.users = res.data;          
       }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       });
}
/*
capturar eventos del input:

(input)="onSearchChange($event.target.value)"
onSearchChange(searchValue) {  


}*/

ngOnInit() {

  this.listarUsuarios();
   this.formNuevodispositivo = this.form_dispositivo.group({
        id_cliente: ["", Validators.required],
        nombre: ["", [Validators.required]],
        nro_serie: ["", Validators.required],
        ubicacion: ["", Validators.required],

        var1_maximo: [this.var1_maximo, [Validators.required]],
        var1_minimo: [this.var1_minimo, [Validators.required]],
        var1_nombre: this.var1_nombre,
        var1_rango_max: [this.var1_rango_max, [Validators.required]],
        var1_rango_min: [this.var1_rango_min, [Validators.required]],
        var1_status:[this.var1_status,[Validators.required]],  
        

        var2_maximo: [this.var2_maximo, [Validators.required]],
        var2_minimo: [this.var2_minimo, [Validators.required]],
        var2_nombre: this.var2_nombre,
        var2_rango_max: [this.var2_rango_max, [Validators.required]],
        var2_rango_min: [this.var2_rango_min, [Validators.required]],
        var2_status:[this.var2_status,[Validators.required]],

        var3_maximo: [this.var3_maximo, [Validators.required]],
        var3_minimo: [this.var3_minimo, [Validators.required]],
        var3_nombre: this.var3_nombre,
        var3_rango_max: [this.var3_rango_max, [Validators.required]],
        var3_rango_min: [this.var3_rango_min, [Validators.required]],
        var3_status:[this.var3_status,[Validators.required]], 

        var4_maximo: [this.var4_maximo, [Validators.required]],
        var4_minimo: [this.var4_minimo, [Validators.required]],
        var4_nombre: this.var4_nombre,
        var4_rango_max: [this.var4_rango_max, [Validators.required]],
        var4_rango_min: [this.var4_rango_min, [Validators.required]],
        var4_status:[this.var4_status,[Validators.required]],  

        var5_maximo: [this.var5_maximo, [Validators.required]],
        var5_minimo: [this.var5_minimo, [Validators.required]],
        var5_nombre: this.var5_nombre,
        var5_rango_max: [this.var5_rango_max, [Validators.required]],
        var5_rango_min: [this.var5_rango_min, [Validators.required]],
        var5_status:[this.var5_status,[Validators.required]],   
  });


}

  createDispositivo(formulario){
	    if(this.formNuevodispositivo.valid) {

            this._iotService.newIot(
              this.formNuevodispositivo.value
            )
            .subscribe(
                data => {
                  this.cambioScreen("lista","","success",{
                        title: "",
                        msg: "Dispositivo creado correctamente",
                        showClose: false,
                        timeout: 3000,
                        theme: "bootstrap"
                    });
                  },
                error => {
                  this.cambioScreen("lista","","error",{
                        title: "",
                        msg: 'Algo salio mal intente más tarde',
                        showClose: false,
                        timeout: 10000,
                        theme: "bootstrap"
                    });

                }
            );

        }
      //console.log(formulario);
  }
}
