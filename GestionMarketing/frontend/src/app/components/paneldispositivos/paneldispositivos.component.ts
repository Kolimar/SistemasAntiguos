import { Component, OnInit } from '@angular/core';
import { CrearDispositivoComponent } from '../crear-dispositivo/crear-dispositivo.component';
import { EditarDispositivoComponent } from '../editar-dispositivo/editar-dispositivo.component';
import { ListaDispositivosComponent } from '../lista-dispositivos/lista-dispositivos.component';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';


@Component({
  selector: 'app-paneldispositivos',
  templateUrl: './paneldispositivos.component.html',
  styleUrls: ['./paneldispositivos.component.scss']
})
export class PaneldispositivosComponent implements OnInit {
  lista:boolean = true;
  nuevo:boolean = false;
  editar:boolean = false;
  public iot;
  
  constructor(
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig  ) {
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";
     }

  ngOnInit() {
  }


 turnview(event){
    this.iot = event.data;
    if(event.pantalla=="editar"){
      //console.log(event.data);
      //console.log(event);
      this.lista = false;
      this.nuevo = false;
      this.editar = true;
    }else if (event.pantalla=="nuevo"){
      this.lista = false;
      this.nuevo = true;
      this.editar = false;
    }else if (event.pantalla=="lista"){
      this.lista = true;
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
