import { Component, OnInit,Output,EventEmitter,AfterViewInit,OnDestroy } from '@angular/core';
import { MovimientosService } from '../../services/movimientos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';


@Component({
  selector: 'app-lista-movimientos',
  templateUrl: './lista-movimientos.component.html',
  styleUrls: ['./lista-movimientos.component.scss']
})
export class ListaMovimientosComponent implements OnInit,OnDestroy {

 constructor(private router: Router,private _Movimientoservice:MovimientosService) { }

  loading:boolean;
  Movimientos:any;
  vistaLoad;
  peticionLista;
  @Output() CambioScreen = new EventEmitter();
  pagina:number = 1;
  viewMore:boolean=true;
  userData;

  /////////////////////////////////Logica filtro///////////////////////////////// 
  // variables

	busquedaFecha:string='';
	busquedaMovimiento:string='';
  busquedaCodigo:string='';
  busquedaSize:string='';
  busquedaTipo:string='';
  busquedaEstado:string='';
  busquedaDeposito:string='';
  busquedaCliente:string='';
  busquedaBloqueado=9;  
  estadoFiltro:string='0';
  sort_by:string='false';
  sort_bydesc:string='false';

   //Reset Filtro
  resetFilter(){
    this.pagina=1;
    this.viewMore = true;
    this.busquedaFecha = '';
	this.busquedaMovimiento = '';
    this.busquedaCodigo='';
    this.busquedaSize='';
    this.busquedaTipo='';
    this.busquedaEstado='';
    this.busquedaDeposito='';
    this.busquedaCliente='';
    this.busquedaBloqueado=9;
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
  loadData(estadoFiltro){
    if (sessionStorage.getItem("permanentStatement")) {
    //Hago la consulta si en la sesion no existe el objeto del usuario
    ////console.log("desde storage");
    this.userData = JSON.parse(sessionStorage.getItem("permanentStatement"));
      if (this.estadoFiltro=='1') {
       this.peticionLista = this._Movimientoservice.search(
         this.pagina,
         this.busquedaFecha,
		     this.busquedaMovimiento,
         this.busquedaCodigo,
    		this.busquedaSize,
    		this.busquedaTipo,
    		this.busquedaEstado,
    		this.busquedaDeposito,
    		this.busquedaCliente,
    		this.busquedaBloqueado,
         this.sort_by,
         this.sort_bydesc).subscribe(res => {

          if(this.pagina>1 ) {

          for ( var index=0; index<res.data.length; index++ ) {
              this.Movimientos.push( res.data[index] );
          }
          if(res.current_page===res.last_page) {
             this.viewMore = false;
            }
          }else{
            if (res.data.length>0) {
              this.Movimientos = res.data;
            if(res.current_page===res.last_page) {
             this.viewMore = false;
            }
              
            }else{
              this.Movimientos = res.data;
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
        this.peticionLista = this._Movimientoservice.getMovimientos(this.pagina).subscribe(res => {
          if(this.pagina>1) {
          for ( var index=0; index<res.data.length; index++ ) {
              this.Movimientos.push( res.data[index] );
          }
          //console.log(this.Movimientos);
          }else{
            this.Movimientos = res.data;
            //console.log(this.Movimientos);
          }
          if(res.current_page===res.last_page) {
           this.viewMore = false;
          }
          console.log(res);
          this.pagina++;
          
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

  ngOnDestroy(){
    //console.log("onDestroy");
    this.peticionLista.unsubscribe();
  }
}
