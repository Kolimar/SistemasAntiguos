import { Component, OnInit,OnChanges,Output,EventEmitter } from '@angular/core';
import { UserService } from '../../services/users.service';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule, DropdownModule,SelectItem,FileUploadModule } from 'primeng/primeng';
import { PasswordValidation } from '../../globals/passwordValidator';
import { Router, ActivatedRoute } from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html'
})
export class NuevoUsuarioComponent {
  load:boolean;
  perfiles : SelectItem [];
  @Output() CambioScreen = new EventEmitter();

  cambioScreen(evento:string, data? ,status?:string, toasty?){
    this.CambioScreen.emit({pantalla: evento, status: status, toasty: toasty});
  }

  public nuevoUsuarioForm = this.formNewUser.group({
      name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      empresa: [""],
     // admin: ["", Validators.required], // (de habilitar la creacion de administradores se tiene que descomentar en el back)
      password: ["", [Validators.required,Validators.minLength(6)]],
      password_confirmation: ["", [Validators.required,Validators.minLength(6)]],
      verified:[true, Validators.required]
    },{
      validator: PasswordValidation.MatchPassword
    })

  constructor(
      private toastyService:ToastyService,
      private toastyConfig: ToastyConfig,
      public formNewUser: FormBuilder,
      private activate_route: ActivatedRoute,
      private router: Router,
      private UserService: UserService,
    ) {

    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = "bottom-right";

   /* this.perfiles = [
      {label:'Ninguno', value:null},
      {label:'Administrador', value:'true'},
      {label:'Operador', value:'false'}
    ];*/

  }

  crearUsuario(event) {
    //Debug, sacar la recepcion del evento luego
      ////console.log(event);
      ////console.log(event.file);
      
      if(this.nuevoUsuarioForm.valid) {
            this.UserService.newUser(
              this.nuevoUsuarioForm.value
            )
            .subscribe(
                data => {
                  this.load=true;
                  this.cambioScreen("cuentas","","success",{
                        title: "",
                        msg: "Usuario creado correctamente",
                        showClose: false,
                        timeout: 3000,
                        theme: "bootstrap"
                    });
                  },
                error => {
                  this.cambioScreen("cuentas","","error",{
                        title: "",
                        msg: error,
                        showClose: false,
                        timeout: 3000,
                        theme: "bootstrap"
                    });

                }
            );

        }
    }
}
