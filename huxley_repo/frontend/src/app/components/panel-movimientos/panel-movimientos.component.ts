import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ListaMovimientosComponent } from '../lista-movimientos/lista-movimientos.component';


@Component({
  selector: 'app-panel-movimientos',
  templateUrl: './panel-movimientos.component.html',
  styleUrls: ['./panel-movimientos.component.scss']
})
export class PanelMovimientosComponent implements OnInit {
cuentas:boolean = true;
  nuevo:boolean = false;
  editar:boolean = false;
  constructor( private toastyService:ToastyService,
    private toastyConfig: ToastyConfig ) {   
    this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";}

  ngOnInit() {
  }
  public user;
  turnview(event){
    this.user = event.data;
    if(event.pantalla=="editar"){
      //console.log(event.data);
      //console.log(event);
      this.cuentas = false;
      this.nuevo = false;
      this.editar = true;
    }else if (event.pantalla=="nuevo"){
      this.cuentas = false;
      this.nuevo = true;
      this.editar = false;
    }else if (event.pantalla=="cuentas"){
      this.cuentas = true;
      this.nuevo = false;
      this.editar = false;
    }
    if(event.status == "success"){
        this.toastyService.success(
          event.toasty
        );
    }else if (event.status == "error"){
      this.toastyService.error(
        event.toasty
      );
    }
  }

}
