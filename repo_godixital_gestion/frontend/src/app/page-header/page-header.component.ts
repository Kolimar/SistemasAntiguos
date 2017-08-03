import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/index';
import { UserService, AuthenticationService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ApiSettings } from '../global/index';
import { ModalDirective } from 'ng2-bootstrap';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { AlertServer } from '../global/index';

@Component({
    moduleId: module.id,
    selector: 'page-header',
    templateUrl: './page-header.html',
    providers: [UserService, AlertServer]
})

export class PageHeaderComponent implements OnInit{
  @ViewChild('modalCambiarContrasena') public modalCambiarContrasena:ModalDirective;
	currentUser: User;
  users: User[] = [];
  returnUrl: string;
  loader: boolean= false;
  formCambiarContrasena: FormGroup;
  isSubmitCambiar: boolean= false;

	constructor(
        private userService: UserService,
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private alert_server: AlertServer,
    ){

        // OPCIONES PREDETERMINADAS TASTY
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.showClose = true;
    }

    // INICIO AUTOMATICO
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.createForm();
    }

    // CERRAR SESION E INVALIDAR TOKEN
    logout(){
      $.ajax({
          url: ApiSettings.urlApi+'logout',
          headers: { 'Authorization': 'Bearer ' + this.currentUser.token},
          type: 'GET',
          success: this.router.navigate(['/login'])
      });
    }

    // CREAR FORMULARIO
    createForm(){
      this.formCambiarContrasena= this.fb.group({
          contrasena_actual: ['', Validators.compose([
              Validators.required,
          ])],
          nueva_contrasena: ['', Validators.compose([
              Validators.required,
          ])],
          confirmar_contrasena: ['', Validators.compose([
              Validators.required,
          ])],
      })
    }

    // ABRIR MODAL DE CAMBIO DE CONTRASEÑA
    showModal():void {
        this.modalCambiarContrasena.show();
    }

    // CERRAR MODAL DE CAMBIO DE CONTRASEÑA
    hideModal():void {
        this.modalCambiarContrasena.hide();
        this.formCambiarContrasena.reset();
        this.isSubmitCambiar= false;
    }

    // CAMBIAR CONTRASEÑA
    cambiarContrasena(){
      this.isSubmitCambiar= true;
      if (this.formCambiarContrasena.valid && this.isSubmitCambiar) {

        if (this.formCambiarContrasena.get('nueva_contrasena').value != this.formCambiarContrasena.get('confirmar_contrasena').value) {
          this.toastyService.error("Las contraseñas no coinciden, por favor verifique");
        }else{

          let model: any = {
            contrasena_actual: this.formCambiarContrasena.get('contrasena_actual').value,
            nueva_contrasena: this.formCambiarContrasena.get('nueva_contrasena').value,
            confirmar_contrasena: this.formCambiarContrasena.get('confirmar_contrasena').value,
          }
          this.loader= true;
          this.userService.cambiarContrasena(model)
          .subscribe(
              data => {
                  this.hideModal();
                  this.toastyService.success("La contraseña fue cambiada exitosamente, inicie sesión nuevamente");
                  this.loader= false;
                  this.isSubmitCambiar= false;
                  this.formCambiarContrasena.reset();
                  this.logout();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitCambiar= false;
              }
          );

        }

      }else{
        this.formCambiarContrasena= this.fb.group({
            contrasena_actual: [this.formCambiarContrasena.get('contrasena_actual').value, Validators.compose([
                Validators.required,
            ])],
            nueva_contrasena: [this.formCambiarContrasena.get('nueva_contrasena').value, Validators.compose([
                Validators.required,
            ])],
            confirmar_contrasena: [this.formCambiarContrasena.get('confirmar_contrasena').value, Validators.compose([
                Validators.required,
            ])],
        })
      }

    }

}
