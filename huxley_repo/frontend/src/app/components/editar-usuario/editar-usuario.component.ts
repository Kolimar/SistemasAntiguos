import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { TooltipModule, DropdownModule,SelectItem } from 'primeng/primeng';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html'
})
export class EditarUsuarioComponent implements OnInit,AfterViewInit {
  editPerfilForm: FormGroup;
  @Output() CambioScreen = new EventEmitter();
  @Input() user;
  cambioScreen(evento:string, data? , status?:string, toasty?){
    this.CambioScreen.emit({pantalla: evento, data: data , status: status, toasty: toasty});
  }

  constructor( private formEditUser:FormBuilder, private _actualUser:UserService) {
   }

userStatus:boolean;
perfiles : SelectItem [];
ngOnInit() {

  this.perfiles = [
    {label:'Administrador', value:'true'},
    {label:'Operador', value:'false'}
  ];
 this.editPerfilForm = this.formEditUser.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      verified:[true, Validators.required],
      empresa: '',
      id:'',
    })


if(this.user!=undefined){
  if(this.user.habilitado)
  {this.user.habilitado==true}
  else
  {this.user.habilitado==false}
  this.editPerfilForm.setValue({
    name:this.user.nombre,
    last_name:this.user.apellido,
    email:this.user.correo,
    empresa:this.user.nombre_empresa,
    id:this.user.identificador,
    verified:this.user.habilitado,
  });

}

}

ngAfterViewInit(){
    }

editUsuario($event){
    if(this.editPerfilForm.valid) {
            this._actualUser.updateUser(
              this.editPerfilForm.value
            )
            .subscribe(
                data => {
                  if (data.code=="201") {
                    this.cambioScreen("cuentas","","success",{
                          title: "Usuario sin cambios",
                          msg: "Los datos ingresados son identicos a los originales",
                          showClose: false,
                          timeout: 5000,
                          theme: "bootstrap"
                      });

                  }
                  else{
                    this.cambioScreen("cuentas","","success",{
                          title: "Usuario editado",
                          msg: "",
                          showClose: false,
                          timeout: 5000,
                          theme: "bootstrap"
                      });
                  }
                },
                error => {
                  this.cambioScreen("","","error",{
                        title: "",
                        msg: "Algo salió mal intente mas tarde",
                        showClose: false,
                        timeout: 10000,
                        theme: "bootstrap"
                    });

                }
            );

        }
  }
}
