import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { UserService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Validaciones } from '../validaciones/index';
import { AlertServer } from '../global/index';

interface Puesto {
    id: number;
    nombre: string;
}

@Component({
    moduleId: module.id,
    selector: 'register-user',
    templateUrl: './register-user.html',
    providers: [AlertServer],
})

export class RegisterComponent implements AfterViewInit{
    formUser: FormGroup;
    puestos: Puesto[] = [];
    loader: boolean= false;

    constructor(
        private router: Router,
        private userService: UserService,
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

        this.createForm();
    }

    // CREACION DE FORMULARIO DE REGISTRO DE USUARIOS
    createForm(){
      this.formUser= this.fb.group({
          nombres: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          apellidos: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          email_laboral: ['', Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          email_personal: ['', Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          celular_laboral: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          celular_personal: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          telefono_laboral: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          telefono_personal: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          password: ['', Validators.compose([
              Validators.required,
          ])],
          id_puesto: ['', Validators.compose([
              Validators.required,
          ])],
      })
    }

    // CARGA AUTOMATICA
    ngAfterViewInit() {
        this.loadPuestos();
    }

    // CARGAR LISTADO DE PUESTOS
    loadPuestos() {
        this.userService.getPuestos().subscribe(puestos => { this.puestos = puestos; });
    }

    // POST USUARIOS
    register() {
        if(this.formUser.valid) {
            var model: any = {
                nombres: this.formUser.get('nombres').value,
                apellidos: this.formUser.get('apellidos').value,
                id_puesto: this.formUser.get('id_puesto').value,
                telefono_laboral: this.formUser.get('telefono_laboral').value,
                celular_laboral: this.formUser.get('celular_laboral').value,
                email_laboral: this.formUser.get('email_laboral').value,
                telefono_personal: this.formUser.get('telefono_personal').value,
                celular_personal: this.formUser.get('celular_personal').value,
                email_personal: this.formUser.get('email_personal').value,
                password: this.formUser.get('password').value,
            }
            this.loader= true;
            this.userService.create(model)
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
                    Validaciones.verificarEspacios,
                ])],
                apellidos: [this.formUser.get('apellidos').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                email_laboral: [this.formUser.get('email_laboral').value, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
                ])],
                email_personal: [this.formUser.get('email_personal').value, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
                ])],
                celular_laboral: [this.formUser.get('celular_laboral').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                celular_personal: [this.formUser.get('celular_personal').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                telefono_laboral: [this.formUser.get('telefono_laboral').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                telefono_personal: [this.formUser.get('telefono_personal').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                password: [this.formUser.get('password').value, Validators.compose([
                    Validators.required,
                ])],
                id_puesto: [this.formUser.get('id_puesto').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }
    }
}
