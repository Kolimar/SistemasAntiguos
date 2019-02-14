import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { AuthenticationService, UserService } from '../services/index';
import { AlertServer } from '../global/index';
import { ModalDirective } from 'ng2-bootstrap';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.html',
    providers: [AlertServer, UserService]
})

export class LoginComponent implements AfterViewInit {
    @ViewChild('modalEmail') public modalEmail:ModalDirective;
    returnUrl: string;
    formLogin: FormGroup;
    loader: boolean= false;
    formEmail: FormGroup;
    isSubmitEmail: boolean= false;

    constructor(
        private activate_route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder,
        private alert_server: AlertServer,
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
        private userService: UserService,
    ){
        this.createForm();
    }

    // CREACION DE FORMULARIO DE LOGIN
    createForm(){
      this.formLogin= this.fb.group({
          email_laboral: ['', Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
          ])],
          password: ['', Validators.compose([
              Validators.required,
          ])]
      })

      this.formEmail= this.fb.group({
          email_laboral: ['', Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
          ])],
      })
    }

    // CARGA AUTOMATICA
    ngAfterViewInit() {
        this.authenticationService.logout();
        this.returnUrl = 'tareas';
        // this.returnUrl = this.activate_route.snapshot.queryParams['returnUrl'] || '/';
    }

    // POST INICIO DE SESION
    login() {
        if(this.formLogin.valid) {
            this.loader= true;
            this.authenticationService.login(
              this.formLogin.get('email_laboral').value,
              this.formLogin.get('password').value
            )
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    this.loader= false;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                }
            );

        }else{
            // VALIDACION ANTES DE POST
            this.formLogin= this.fb.group({
                email_laboral: [this.formLogin.get('email_laboral').value, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
                ])],
                password: [this.formLogin.get('password').value, Validators.compose([
                    Validators.required,
                ])]
            })
        }

    }

    // ABRIR MODAL DE CAMBIO DE CONTRASEÑA
    showModal():void {
        this.modalEmail.show();
    }

    // CERRAR MODAL DE CAMBIO DE CONTRASEÑA
    hideModal():void {
        this.modalEmail.hide();
        this.formEmail.reset();
        this.isSubmitEmail= false;
    }

    // CAMBIAR CONTRASEÑA
    enviarEmail(){
      this.isSubmitEmail= true;
      if (this.formEmail.valid && this.isSubmitEmail) {

        let model: any = {
          email_laboral: this.formEmail.get('email_laboral').value,
        }
        this.loader= true;
        this.userService.enviarEmail(model)
        .subscribe(
            data => {
                this.hideModal();
                this.toastyService.success("Se envió un email con las instrucciones del cambio de contraseña");
                this.loader= false;
                this.isSubmitEmail= false;
                this.formEmail.reset();
            },
            error => {
                this.alert_server.messageError(error);
                this.loader= false;
                this.isSubmitEmail= false;
            }
        );

      }else{
        this.formEmail= this.fb.group({
            email_laboral: [this.formEmail.get('email').value, Validators.compose([
                Validators.required,
                Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
            ])],
        })
      }

    }
}
