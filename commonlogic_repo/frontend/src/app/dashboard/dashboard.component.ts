import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as global from '../globals/globalesVar';
import { DetalleDispositivoService } from '../services/detalle-dispositivo.service';
import { UserService } from '../services/users.service';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit{
  loading:boolean;
  dispositivos:any;
  encendidos:number;
  apagados:number;
  correctos:number;
  incorrectos:number;
  vistaLoad;
  peticionLista;
  admin:boolean=false;
  uidAdmin;
 pagina:number = 1;
  viewMore:boolean=true;
  users;
  userData;
  estaEnRango=[];
  RangoMinimo:number;
  RangoMaximo:number;
  Maximo:number;
  Minimo:number;
  medicion:number;
  nombreVariable:string;
  variableID:string;
  constructor(private router:Router, private _iotservice:DetalleDispositivoService,private _actualUser:UserService, private confirmationService: ConfirmationService) { }

ngOnInit(){

  this.loading=true;
  this.loadData();
  this.loading=false;
}
ngAfterViewInit(){
this.listarUsuarios();
}


realtimeDispositivo(Dispositivo){

  localStorage.setItem("dispositivo",JSON.stringify(Dispositivo));
  this.router.navigate(['/realtime']);
}

historicoDispositivo(Dispositivo){

  localStorage.setItem("dispositivo",JSON.stringify(Dispositivo));
  this.router.navigate(['/historico']);
}

listarUsuarios(){
  this.peticionLista = this._actualUser.getAll().subscribe(res => {
            this.users = res.data;          
       }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }
       });
}
disableDispositivo(identificador){
  this.loading=true;
 let callUpdate = this._iotservice.updateIot(identificador).subscribe(res=>{
  if (this.admin) {
    this.loadDispositivos(this.uidAdmin);
  }else{
   this.loadDispositivos();

    }
  
  // console.log(res);
   this.loading=false;
 });

}
apagaDispositivo(identificador){
  this.loading=true;
 let callUpdate = this._iotservice.apagarIOT(identificador).subscribe(res=>{
  if (this.admin) {
    this.loadDispositivos(this.uidAdmin);
  }else{
    this.loadDispositivos();

    }
  
  // console.log(res);
   this.loading=false;
 });

}
confirm(dispositivo,estado,tipo) {
    if (tipo=='relee') {
      this.confirmationService.confirm({
            message: 'Desea '+estado + ' el dispositivo?',
            accept: () => {
               this.apagaDispositivo(dispositivo) //Actual logic to perform a confirmation
            }
        });

    }else if(tipo=='medicion'){
        this.confirmationService.confirm({
            message: 'Desea '+estado + ' la medicion del dispositivo?',
            accept: () => {
               this.disableDispositivo(dispositivo) //Actual logic to perform a confirmation
            }
        });

    }
    }
loadDispositivos(uid?){
  if (!uid) {
   uid = this.userData.id;
  }else{
  this.uidAdmin = uid;
  }
  this.peticionLista = this._iotservice.getIot(uid).subscribe(res => {

         // console.log(res);
          this.dispositivos = res.data;
          console.log(res.data);
          this.encendidos = res.data.length - res.contador;
          this.apagados = res.contador;

          this.correctos = res.variablesCorrectas;
         // console.log(this.correctos);
          this.incorrectos = res.variablesTotales - res.variablesCorrectas;

         for (var i = res.data.length - 1; i >= 0; i--) {
      
            for (var vars = res.data[i]['variables'].length - 1; vars >= 0; vars--) {
              //console.log(res.data[i]['variables'][vars]);
              
              this.variableID = res.data[i]['variables'][vars].id;
              this.RangoMinimo =  res.data[i]['variables'][vars].rango_minimo;
              this.RangoMaximo =  res.data[i]['variables'][vars].rango_maximo;
              this.Maximo =  res.data[i]['variables'][vars].maximo;
              this.Minimo =  res.data[i]['variables'][vars].minimo;

              //antes aca habia una validacion(?) testear que no haya sido por algo
              this.medicion = res.data[i]['variables'][vars].ultima_medicion;
              
              
              //la medicion tiene que ser mayor o igual al minimo y menor o igual al maximo, y no null
              if (this.medicion>=this.RangoMinimo && this.medicion<=this.RangoMaximo && this.medicion!=null) {
                this.estaEnRango[this.variableID] = 'true';
              }
              else if(this.medicion==null)
              {
                this.estaEnRango[this.variableID] = 'null';
              }
              else{
                this.estaEnRango[this.variableID] = 'false';
              }

            }
          
          }

}, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       });

  return this.peticionLista;
}

  loadData(adminParameter?){
      this._actualUser.currentUser().subscribe(
       response => {
          this.userData = response;

          if (this.userData.admin == "true") {
            this.admin=true;
            this.users = this.listarUsuarios();
        }
          this.loadDispositivos();
       }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }
       });
    }
    
                
  }

