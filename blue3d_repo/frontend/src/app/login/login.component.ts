import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms'
import { AuthenticationService } from '../services/index';
import { AlertServer } from '../global/index';;

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.html',
    providers: [AlertServer]
})

export class LoginComponent {
  returnUrl: string;
  formLogin: FormGroup;
  loader: boolean= false;
  isSubmitLogin: boolean= false;

  constructor(
      private activate_route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private fb: FormBuilder,
      private alert_server: AlertServer,
  ){
      this.createForm();
  }

  // CREACION DE FORMULARIO DE LOGIN
  createForm(){
    this.formLogin= this.fb.group({
        email: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
        password: ['', Validators.compose([
            Validators.required,
        ])]
    })
  }

  // CARGA AUTOMATICA
  ngAfterViewInit() {
      this.authenticationService.logout();
      this.returnUrl = '/';
      // this.returnUrl = this.activate_route.snapshot.queryParams['returnUrl'] || '/';
  }

  // POST INICIO DE SESION
  login() {
      this.isSubmitLogin= true;
      if(this.formLogin.valid && this.isSubmitLogin) {
          this.loader= true;
          this.authenticationService.login(
            this.formLogin.get('email').value.trim(),
            this.formLogin.get('password').value.trim()
          )
          .subscribe(
              data => {
                  this.router.navigate([this.returnUrl]);
                  this.loader= false;
                  this.isSubmitLogin= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitLogin= false;
              }
          );

      }else{
          // VALIDACION ANTES DE POST
          this.formLogin= this.fb.group({
              email: [this.formLogin.get('email').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
              ])],
              password: [this.formLogin.get('password').value, Validators.compose([
                  Validators.required,
              ])]
          })
      }

  }
}
