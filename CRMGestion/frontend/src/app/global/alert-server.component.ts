import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { AuthenticationService } from '../services/index'

@Injectable()
export class AlertServer{

  loading = false;
  constructor(
      private toastyService:ToastyService,
      private toastyConfig: ToastyConfig,
      private auth: AuthenticationService,
      private router: Router,
  ){
      // OPCIONES PREDETERMINADAS TASTY
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.timeout = 5000;
      this.toastyConfig.showClose = true;
  }

  messageError(error: any){
      if(error.status == 500) {
          this.toastyService.error("Error interno del sistema, intente de nuevo más tarde");
      }else if(error.status == 401){
          this.toastyService.error("el usuario está deshabilitado");
          this.auth.logout();
          this.router.navigate(['/login']);
      }else{
          this.toastyService.error(JSON.parse(error._body));
      }
  }

}
