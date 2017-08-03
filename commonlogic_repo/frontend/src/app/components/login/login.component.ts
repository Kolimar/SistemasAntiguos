import { Component, OnInit, OnDestroy,OnChanges, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import * as Globals from '../../globals/globalesVar';
import { AuthenticationService } from '../../services/authentication.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnChanges, OnInit, OnDestroy{
load:boolean;
constructor(
  private initForms: FormBuilder,
  private activate_route: ActivatedRoute,
  private router: Router,
  private toastyService:ToastyService,
  private authenticationService: AuthenticationService,
   private toastyConfig: ToastyConfig  ) {
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";
     }

/******************************************
*******************************************
               ngOnInit
*******************************************
*******************************************/
 ngOnInit(){

   this.load=false;
 //formulario "recuperar contraseña"
  this.PassRequestForm = this.initForms.group({
        requestEmail: ["", [Validators.required, Validators.pattern(Globals.patronEmail)]]
      });
//formulario "login"
  this.loginForm = this.initForms.group({
        email: ["", [Validators.required, Validators.pattern(Globals.patronEmail)]],
        password: ["", Validators.required]
      });
  }
/******************************************
*******************************************
               ngOnDestroy
*******************************************
*******************************************/
ngOnChanges() {
  //console.log("cambio detectado");
}

ngOnDestroy(){


}



/******************************************
*******************************************
          Private methods
*******************************************
*******************************************/
  // variable que switchea vistas
  requestPass = false;

  //formularios
  loginForm:FormGroup;
  PassRequestForm:FormGroup;

  returnUrl: string;
  
  private cambiaClave(){
    //Esta funcion Switchea entre la vista de "login" y la de "cambiar pass"
    this.requestPass = !this.requestPass;
    this.load=false;
    ////console.log(this.requestPass);
  }

  private doLogin(event) {
    this.load=true;
    //Desencadena el evento Login .-
    //Debug ->
    //sacar la recepcion del evento luego
    // //console.log(event);
    if(this.loginForm.valid) {
            this.authenticationService.login(
              this.loginForm.get('email').value,
              this.loginForm.get('password').value
            )
            .subscribe(
                data => {
                  console.log(data);
                    this.router.navigate(['/dashboard']);
                },
                error => {
                    this.load=false;
                    if (error.status==433) {
                       this.toastyService.warning(
                          {
                            title: "Deshabilitado",
                            msg: "Su usuario ha sido deshabilitado, si cree que es un error contacte al administrador",
                            showClose: false,
                            timeout: 10000,
                            theme: "bootstrap"
                        }
                       );
                      }
                      else if (error.status==404){
                        
                      this.toastyService.error(
                          {
                            title: "No Autorizado",
                            msg: "Credenciales inválidas",
                            showClose: false,
                            timeout: 10000,
                            theme: "bootstrap"
                        }
                       );
                      }
                      else{
                        this.toastyService.error(
                          {
                            title: "Error",
                            msg: "Hubo un problema con su solicitud, intente en unos momentos",
                            showClose: false,
                            timeout: 10000,
                            theme: "bootstrap"
                        }
                        )};

                    });}
        /*//console.log(this.loginForm.value);*/
    }

  private doRequestPass(event) {
    this.load=true;
     this.authenticationService.requestPass(
              this.PassRequestForm.value
            )
            .subscribe(
                data => {
                   this.load=true;
                   this.toastyService.success(
                        {
                          title: "Mail Enviado",
                          msg: "Revisa tu correo, se ha enviado el restablecimiento",
                          showClose: false,
                          timeout: 10000,
                          theme: "bootstrap"
                      }
                     )
                },
                error => {
                  this.load=false;
                    console.error(error);
                    this.toastyService.error(
                        {
                          title: "",
                          msg: "No se pudo procesar la solicitud",
                          showClose: false,
                          timeout: 3000,
                          theme: "bootstrap"
                      }
                     );
                    }
            );
    //Desencadena el evento "Cambiar contraseña "
    //Debug ->
    //sacar la recepcion del evento luego
      // //console.log(event);
      //console.log(this.PassRequestForm.value);
   }
}
