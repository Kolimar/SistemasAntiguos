import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { TooltipModule, DropdownModule,SelectItem } from 'primeng/primeng';
import { IotService } from '../../services/iot.service';
import { UserService } from '../../services/users.service';

@Component({
 selector: 'editar-dispositivo',
  templateUrl: './editar-dispositivo.component.html',
  styleUrls: ['./editar-dispositivo.component.scss']
})
export class EditarDispositivoComponent implements OnInit,AfterViewInit {
@Output() CambioScreen = new EventEmitter();

@Input() dispositivo;
cambioScreen(evento:string, data? , status?:string, toasty?){
    this.CambioScreen.emit({pantalla: evento, data: data , status: status, toasty: toasty});
  }

constructor( private form_dispositivo: FormBuilder, private _iotService:IotService, private _userservice:UserService) { 

}
user;
id_cliente=15;
nombre;
nro_serie;
ubicacion;
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
idUser=0;
private disabled: boolean = false;

peticionLista;
peticionUser;
users;
vars=[];
/*// disable input box
disableInput(): void {
   this.disabled = true;
}


// enable input box
enableInput(): void {
   this.disabled = false;
}*/

formEditardispositivo:FormGroup;
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
  
     this._iotService.getVars(this.dispositivo.identificador).subscribe(res => {
                 for (var i = res.data.length - 1; i >= 0; i--) {
                   this.vars[res.data[i].code] = res.data[i];
                 //console.log(res.data[i]);
                 }
                   this.formEditardispositivo.setValue({

                  id_cliente: this.dispositivo.identificador_usuario,
                  nombre: this.dispositivo.leyenda, 
                  nro_serie: this.dispositivo.numero_de_serie,
                  ubicacion: this.dispositivo.ubicacion_actual,

                  identificador:this.dispositivo.identificador,  
                  
                  var1_id:this.vars['var1'].id,
                  var2_id:this.vars['var2'].id,
                  var3_id:this.vars['var3'].id,
                  var4_id:this.vars['var4'].id,
                  var5_id:this.vars['var5'].id,


                  var1_maximo: this.vars['var1'].maximo,
                  var1_minimo: this.vars['var1'].minimo, 
                  var1_nombre: this.vars['var1'].nombre,
                  var1_rango_max:this.vars['var1'].rango_maximo,
                  var1_rango_min:this.vars['var1'].rango_minimo,
                  var1_status:this.vars['var1'].status, 
                  

                  var2_maximo: this.vars['var2'].maximo,
                  var2_minimo: this.vars['var2'].minimo, 
                  var2_nombre: this.vars['var2'].nombre,
                  var2_rango_max:this.vars['var2'].rango_maximo,
                  var2_rango_min:this.vars['var2'].rango_minimo,
                  var2_status:this.vars['var2'].status, 

                  var3_maximo: this.vars['var3'].maximo,
                  var3_minimo: this.vars['var3'].minimo, 
                  var3_nombre: this.vars['var3'].nombre,
                  var3_rango_max:this.vars['var3'].rango_maximo,
                  var3_rango_min:this.vars['var3'].rango_minimo,
                  var3_status:this.vars['var3'].status,  

                  var4_maximo: this.vars['var4'].maximo,
                  var4_minimo: this.vars['var4'].minimo, 
                  var4_nombre: this.vars['var4'].nombre,
                  var4_rango_max:this.vars['var4'].rango_maximo,
                  var4_rango_min:this.vars['var4'].rango_minimo,
                  var4_status:this.vars['var4'].status, 

                  var5_maximo: this.vars['var5'].maximo,
                  var5_minimo: this.vars['var5'].minimo, 
                  var5_nombre: this.vars['var5'].nombre,
                  var5_rango_max:this.vars['var5'].rango_maximo,
                  var5_rango_min:this.vars['var5'].rango_minimo,
                  var5_status:this.vars['var5'].status,  
                 });
                   
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

     this.formEditardispositivo.setValue({
        id_cliente: this.dispositivo.identificador_usuario,
        nombre: this.dispositivo.leyenda, 
        nro_serie: this.dispositivo.numero_de_serie,
        ubicacion: this.dispositivo.ubicacion_actual,

        identificador:this.dispositivo.identificador,  
        
        var1_id:this.vars['var1'].id,
        var2_id:this.vars['var2'].id,
        var3_id:this.vars['var3'].id,
        var4_id:this.vars['var4'].id,
        var5_id:this.vars['var5'].id,


        var1_maximo: this.vars['var1'].maximo,
        var1_minimo: this.vars['var1'].minimo, 
        var1_nombre: this.vars['var1'].nombre,
        var1_rango_max:this.vars['var1'].rango_maximo,
        var1_rango_min:this.vars['var1'].rango_minimo,
        var1_status:this.vars['var1'].status, 
        

        var2_maximo: this.vars['var2'].maximo,
        var2_minimo: this.vars['var2'].minimo, 
        var2_nombre: this.vars['var2'].nombre,
        var2_rango_max:this.vars['var2'].rango_maximo,
        var2_rango_min:this.vars['var2'].rango_minimo,
        var2_status:this.vars['var2'].status, 

        var3_maximo: this.vars['var3'].maximo,
        var3_minimo: this.vars['var3'].minimo, 
        var3_nombre: this.vars['var3'].nombre,
        var3_rango_max:this.vars['var3'].rango_maximo,
        var3_rango_min:this.vars['var3'].rango_minimo,
        var3_status:this.vars['var3'].status,  

        var4_maximo: this.vars['var4'].maximo,
        var4_minimo: this.vars['var4'].minimo, 
        var4_nombre: this.vars['var4'].nombre,
        var4_rango_max:this.vars['var4'].rango_maximo,
        var4_rango_min:this.vars['var4'].rango_minimo,
        var4_status:this.vars['var4'].status, 

        var5_maximo: this.vars['var5'].maximo,
        var5_minimo: this.vars['var5'].minimo, 
        var5_nombre: this.vars['var5'].nombre,
        var5_rango_max:this.vars['var5'].rango_maximo,
        var5_rango_min:this.vars['var5'].rango_minimo,
        var5_status:this.vars['var5'].status,  
       });
}*/

ngOnInit() {
this.peticionUser = this.listarUsuarios();
//@Input :

this.formEditardispositivo = this.form_dispositivo.group({
        id_cliente: '',
        nombre: [this.nombre, [Validators.required]],
        nro_serie: [this.nro_serie, Validators.required],
        ubicacion: [this.ubicacion, Validators.required],

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
        var1_id:'',
        var2_id:'',
        var3_id:'',
        var4_id:'',
        var5_id:'',
        identificador:''
 
       });



}

ngAfterViewInit(){

}
  editDispositivo(event, formulario){
    //console.log(formulario);
    //console.log(event);
     

        this._iotService.updateIot(formulario)
        .subscribe(
            data => {
              this.cambioScreen("lista","","success",{
                    title: "",
                    msg: "Dispositivo editado correctamente",
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
                    timeout: 3000,
                    theme: "bootstrap"
                });

            }
        );

        
      ////console.log(formulario);
  }
}
