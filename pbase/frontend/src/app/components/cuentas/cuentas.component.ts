import { Component, OnInit,Output,EventEmitter,AfterViewInit,OnDestroy } from '@angular/core';
import { UserService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html'
})
export class CuentasComponent implements OnInit, AfterViewInit,OnDestroy {
 

  constructor(private router: Router,private _userservice:UserService) {
  }
 
  loading:boolean;
  users:any;
  vistaLoad;
  peticionLista;
  @Output() CambioScreen = new EventEmitter();
  pagina:number = 1;
  viewMore:boolean=true;
  userData;

  /////////////////////////////////Logica filtro///////////////////////////////// 
  // variables
    busquedaNombre:string='';
    busquedaApellido:string='';
    busquedaEmpresa:string='';
    busquedaEmail:string='';
    busquedaEstado=9;  
    estadoFiltro:string='0';
    sort_by:string='false';
    sort_bydesc:string='false';
   //Reset Filtro
  resetFilter(){
    this.pagina=1;
    this.viewMore = true;
    this.busquedaNombre='';
    this.busquedaApellido='';
    this.busquedaEmpresa='';
    this.busquedaEmail='';
    this.busquedaEstado=9;
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
///////////////////////////////// Load de la data enviando el filtro///////////////////////////////// 
  loadData(estadoFiltro){
    if (sessionStorage.getItem("permanentStatement")) {
    //Hago la consulta si en la sesion no existe el objeto del usuario
    ////console.log("desde storage");
    this.userData = JSON.parse(sessionStorage.getItem("permanentStatement"));
      if (this.estadoFiltro=='1') {
       this.peticionLista = this._userservice.search(
         this.pagina,
         this.busquedaNombre,
         this.busquedaApellido,
         this.busquedaEmpresa,
         this.busquedaEmail,
         this.busquedaEstado,
         this.sort_by,
         this.sort_bydesc).subscribe(res => {

          if(this.pagina>1 ) {

          for ( var index=0; index<res.data.length; index++ ) {
              this.users.push( res.data[index] );
          }
          if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
             this.viewMore = false;
            }
          }else{
            if (res.data.length>0) {
              this.users = res.data;
            if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
             this.viewMore = false;
            }
              
            }else{
              this.users = res.data;
               this.viewMore = false;
            }
          }
          this.pagina++;
          
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

      else{
        this.peticionLista = this._userservice.getUsers(this.pagina).subscribe(res => {
          if(this.pagina>1) {
          for ( var index=0; index<res.data.length; index++ ) {
              this.users.push( res.data[index] );
          }
          console.log(this.users);
          }else{
            this.users = res.data;
            console.log(this.users);
          }
          if(res.meta.pagination.current_page===res.meta.pagination.total_pages) {
           this.viewMore = false;
          }
          //console.log(res);
          this.pagina++;
          
       });        

      }
    
    }
                
  }

///////////////////////////////// Fin de Load de la data enviando el filtro///////////////////////////////// 
  ngOnInit() {
    this.loadData(this.estadoFiltro);
  }

  ngAfterViewInit(){
  }
  
  //cambio de pantalla de padre a hijo para los 3 elementos del abm
  cambioScreen(evento:string, data? ,status?:string, toasty?){
  // Usamos el método emit
      this.CambioScreen.emit({pantalla: evento, data:data, status: status, toasty: toasty});
  }

  ngOnDestroy(){
    //console.log("onDestroy");
    this.peticionLista.unsubscribe();
  }




}
