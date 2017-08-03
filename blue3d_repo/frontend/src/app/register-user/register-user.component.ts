import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { UserService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { AlertServer } from '../global/index';

interface Rol {
  id: number;
  nombre: string;
}

@Component({
    moduleId: module.id,
    selector: 'register-user',
    templateUrl: './register-user.html',
    providers: [AlertServer],
})

export class RegisterComponent implements OnInit{
    formUser: FormGroup;
    loader: boolean= false;
    isSubmitUser: boolean= false;
    listRoles: Rol[]= [];

    constructor(
        private router: Router,
        private servicio: UserService,
        private fb: FormBuilder,
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
        private alert_server: AlertServer,
        )
    {

        // OPCIONES PREDETERMINADAS TASTY
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.showClose = true;

    }

    // CREACION DE FORMULARIO DE REGISTRO DE USUARIOS
    createForm(){
      this.formUser= this.fb.group({
          nombres: ['', Validators.compose([
              Validators.required,
          ])],
          apellidos: ['', Validators.compose([
              Validators.required,
          ])],
          email: ['', Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          password: ['', Validators.compose([
              Validators.required,
          ])],
          id_rol: ['', Validators.compose([
              Validators.required,
          ])],
      })
    }

    // CARGA AUTOMATICA
    ngOnInit() {
        this.loadRoles();
        this.createForm();
    }

    // CARGAR LISTADO DE OBRAS SOCIALES
    loadRoles(){
        this.servicio.getRoles().subscribe(data => { this.listRoles = data; });
    }

    // POST USUARIOS
    register() {
        this.isSubmitUser= true;
        if(this.formUser.valid && this.isSubmitUser) {
            var model: any = {
                nombres: this.formUser.get('nombres').value.trim(),
                apellidos: this.formUser.get('apellidos').value.trim(),
                email: this.formUser.get('email').value.trim(),
                password: this.formUser.get('password').value.trim(),
                id_rol: this.formUser.get('id_rol').value,
            }
            this.loader= true;
            this.servicio.create(model)
                .subscribe(
                    data => {
                        this.toastyService.success("Registro exitoso");
                        this.router.navigate(['/login']);
                        this.loader= false;
                    },
                    error => {
                        this.alert_server.messageError(error);
                        this.loader= false;
                    }
                );
        }else{
            // VALIDACION ANTES DE POST
            this.formUser= this.fb.group({
                nombres: [this.formUser.get('nombres').value, Validators.compose([
                    Validators.required,
                ])],
                apellidos: [this.formUser.get('apellidos').value, Validators.compose([
                    Validators.required,
                ])],
                email: [this.formUser.get('email').value, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
                ])],
                password: [this.formUser.get('password').value, Validators.compose([
                    Validators.required,
                ])],
                id_rol: [this.formUser.get('id_rol').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }
    }
}
