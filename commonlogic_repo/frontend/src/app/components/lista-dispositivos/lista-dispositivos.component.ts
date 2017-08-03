import { Component, OnInit,Output,EventEmitter,AfterViewInit,OnDestroy } from '@angular/core';
import { IotService } from '../../services/iot.service';
import { User } from '../../interfaces/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule  } from '@angular/forms';
@Component({
  selector: 'lista-dispositivos',
  templateUrl: './lista-dispositivos.component.html',
  styleUrls: ['./lista-dispositivos.component.scss']
})

export class ListaDispositivosComponent implements OnInit, AfterViewInit,OnDestroy {
  loading:boolean;
  dispositivos:any;
  vistaLoad;
  peticionLista;
  @Output() CambioScreen = new EventEmitter();
  pagina:number = 1;
  viewMore:boolean=true;
  userData;
  verAdmin:boolean=false;
  constructor(private router: Router,private _iotservice:IotService) {
  }

  
  
  

 /////////////////////////////////Logica filtro///////////////////////////////// 
  // variables
    busquedaleyenda:string='';
    busquedanumero_de_serie:string='';
    busquedaubicacion_actual:string='';
    busquedaestado=9;
    estadoFiltro:string='0';
    sort_by:string='false';
    sort_bydesc:string='false';
   //Reset Filtro
  resetFilter(){
    this.pagina=1;
    this.viewMore = true;
    this.busquedaleyenda='';
    this.busquedanumero_de_serie='';
    this.busquedaubicacion_actual='';
    this.busquedaestado=9;
    this.estadoFiltro='0';
    this.loadData(this.estadoFiltro);
  }
  //Cambio y activacion del filtro
  change(estado){
    this.viewMore = true;
    this.estadoFiltro='1';
    this.pagina=1;
    this.loadData( this.estadoFiltro);
  }
  //orden que recibe elemento String 
  sortby(elemento){
    this.viewMore = true;
    this.estadoFiltro='1';
    this.pagina=1;
    this.sort_bydesc = 'false';
    this.sort_by = elemento;
    this.loadData( this.estadoFiltro);
  }
  sortbydesc(elemento){
    this.viewMore = true;
    this.estadoFiltro='1';
    this.pagina=1;
    this.sort_by = 'false';
    this.sort_bydesc = elemento;
    this.loadData( this.estadoFiltro);
  }

 ///////////////////////////////// Fin Logica filtro///////////////////////////////// 

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit(){
    this.loadData(this.estadoFiltro);
  }
  cambioScreen(evento:string, data? ,status?:string, toasty?){
  // Usamos el método emit
      this.CambioScreen.emit({pantalla: evento, data:data, status: status, toasty: toasty});
  }
  ngOnDestroy(){
    //console.log("onDestroy");
    this.peticionLista.unsubscribe();
  }
  
  loadData(estadoFiltro){
    if (sessionStorage.getItem("permanentStatement")) {
    //Hago la consulta si en la sesion no existe el objeto del usuario
    ////console.log("desde storage");
    this.userData = JSON.parse(sessionStorage.getItem("permanentStatement"));     
    
    if(this.userData.admin=="true"){
      this.verAdmin = true;
    }
       
    if (this.estadoFiltro=='1') {
       this.peticionLista = this._iotservice.searchIot(
         this.userData.id, 
         this.pagina,
          this.busquedaleyenda,
          this.busquedanumero_de_serie,
          this.busquedaubicacion_actual,
          this.busquedaestado,
          this.sort_by,
          this.sort_bydesc).subscribe(res => {
                    if(this.pagina>1) {
                          for ( var index=0; index<res.data.length; index++ ) {
                              this.dispositivos.push( res.data[index] );
                          }
                          if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
                             this.viewMore = false;
                            }
                    /*//console.log(this.dispositivos);
                    //console.log(res.meta);*/
                    }else{
                         if (res.data.length>0) {
                            this.dispositivos = res.data;
                          if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
                             this.viewMore = false;
                        }
                        }else{
                            this.dispositivos = res.data;
                            this.viewMore = false;
                          }
                    }
                     this.pagina++;
                    
                 }, 
       error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       });       
      }
      else{
       this.peticionLista = this._iotservice.getIot(this.userData.id, this.pagina).subscribe(res => {
                    if(this.pagina>1) {
                          for ( var index=0; index<res.data.length; index++ ) {
                              this.dispositivos.push( res.data[index] );
                          }
                          if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
                             this.viewMore = false;
                            }
                    /*//console.log(this.dispositivos);
                    //console.log(res.meta);*/
                    }else{
                         if (res.data.length>0) {
                      this.dispositivos = res.data;
                      if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
                       this.viewMore = false;
                        }
                        }else{
                            this.dispositivos = res.data;
                             this.viewMore = false;
                          }
                    }
                     this.pagina++;
                    
                 }, 
       error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       });


     }
    }
                
  }


}
