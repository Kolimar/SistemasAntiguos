import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ListaContenedoresComponent } from '../lista-contenedores/lista-contenedores.component';
import { EditarContenedoresComponent } from '../editar-contenedores/editar-contenedores.component';


@Component({
  selector: 'app-panel-contenedores',
  templateUrl: './panel-contenedores.component.html',
  styleUrls: ['./panel-contenedores.component.scss']
})
export class PanelContenedoresComponent implements OnInit {
  cuentas:boolean = true;
  nuevo:boolean = false;
  editar:boolean = false;
  constructor( private toastyService:ToastyService,
    private toastyConfig: ToastyConfig ) {   
    this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";}

  ngOnInit() {
  }
  public contenedor;
  turnview(event){
    this.contenedor = event.data;
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
