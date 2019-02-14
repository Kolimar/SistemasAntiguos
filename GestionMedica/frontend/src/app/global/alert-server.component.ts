import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertServer{

  loading = false;
  constructor(
      private toastyService:ToastyService,
      private toastyConfig: ToastyConfig,
  ){
      // OPCIONES PREDETERMINADAS TASTY
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.timeout = 5000;
      this.toastyConfig.showClose = true;
  }

  messageError(error: any){
      if(error.status == 500) {
          this.toastyService.error("Error interno del sistema, intente de nuevo más tarde");
      }else{
          this.toastyService.error(JSON.parse(error._body));
      }
  }

}
