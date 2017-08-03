import { Component, OnInit,Output,EventEmitter,AfterViewInit,OnDestroy } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';


@Component({
  selector: 'app-lista-booking',
  templateUrl: './lista-booking.component.html',
  styleUrls: ['./lista-booking.component.scss']
})
export class ListaBookingComponent implements OnInit,OnDestroy {

 constructor(private router: Router,private _Bookingervice:BookingService) { }
  modal=false;
  loading:boolean;
  Booking:any;
  vistaLoad;
  peticionLista;
  @Output() CambioScreen = new EventEmitter();
  pagina:number = 1;
  viewMore='true';
  userData;

  /////////////////////////////////Logica filtro///////////////////////////////// 
  // variables
    busquedaCodigo:string='';
    busquedaCantidad=0;
    busquedaUtilizado=0;
    estadoFiltro:string='0';
    sort_by:string='false';
    sort_bydesc:string='false';
   //Reset Filtro
  resetFilter(){
    this.pagina=1;
    this.viewMore = 'true';
    this.busquedaCodigo='';
    this.busquedaCantidad=0;
    this.busquedaUtilizado=0;
    this.estadoFiltro='0';
    this.loadData(this.estadoFiltro);
  }
  //Cambio y activacion del filtro
  change(estado){
    this.viewMore = 'true';
    this.estadoFiltro='1';
    this.pagina=1;
    this.loadData( this.estadoFiltro);
  }
  //orden que recibe elemento String 
  sortby(elemento){
    this.viewMore = 'true';
    this.estadoFiltro='1';
    this.pagina=1;
    this.sort_bydesc = 'false';
    this.sort_by = elemento;
    this.loadData( this.estadoFiltro);
  }
  sortbydesc(elemento){
    this.viewMore = 'true';
    this.estadoFiltro='1';
    this.pagina=1;
    this.sort_by = 'false';
    this.sort_bydesc = elemento;
    this.loadData( this.estadoFiltro);
  }

 ///////////////////////////////// Fin Logica filtro///////////////////////////////// 
  loadData(estadoFiltro){
 
    if (sessionStorage.getItem("permanentStatement")) {
    //Hago la consulta si en la sesion no existe el objeto del usuario
    ////console.log("desde storage");
    this.userData = JSON.parse(sessionStorage.getItem("permanentStatement"));
      if (this.estadoFiltro=='1') {
       this.peticionLista = this._Bookingervice.search(
         this.pagina,
         this.busquedaCodigo,
      		this.busquedaCantidad,
      		this.busquedaUtilizado,		
         this.sort_by,
         this.sort_bydesc).subscribe(res => {

          if(this.pagina>1 ) {

          for ( var index=0; index<res.data.length; index++ ) {
              this.Booking.push( res.data[index] );
          }
          if(res.current_page===res.last_page) {
             this.viewMore = 'false';
            }
          }else{
            if (res.data.length>0) {
              this.Booking = res.data;
            if(this.Booking.length==res.total) {
             this.viewMore = 'false';
            }
              
            }else{
              this.Booking = res.data;
               this.viewMore = 'false';
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
        this.peticionLista = this._Bookingervice.getBooking(this.pagina).subscribe(res => {
          if(this.pagina>1) {
          for ( var index=0; index<res.data.length; index++ ) {
              this.Booking.push( res.data[index] );
          }
          console.log(this.Booking);
          }else{
            this.Booking = res.data;
            console.log(this.Booking);
          }
          if(res.current_page===res.last_page) {
           this.viewMore = 'false';
          }
          console.log(res);
          this.pagina++;
          
       },error=>{
         if (error.status == 401) {
           console.log("no autenticado");
       }
     });        

      }
    
    }
}
  ngOnInit() {
    this.loadData(this.estadoFiltro);
  }
  //cambio de pantalla de padre a hijo para los 3 elementos del abm
  cambioScreen(evento:string, data? ,status?:string, toasty?){
  // Usamos el método emit
      this.CambioScreen.emit({pantalla: evento, data:data, status: status, toasty: toasty});
  }



showDialog() {
    this.modal = true;
}

bookingActivo="";
logdeBooks;
cargarLog(itemID,itemNombre){
  this._Bookingervice.getlog(itemID).subscribe(res=>{
    this.bookingActivo = itemNombre;
    this.logdeBooks = res.logBook;
    this.showDialog();
    console.log(res.logBook);
  },error=>{
    console.log(error);
  });
}

  ngOnDestroy(){

  }

}