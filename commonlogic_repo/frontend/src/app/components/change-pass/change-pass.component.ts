import {Router, ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit, OnDestroy,OnChanges, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as Globals from '../../globals/globalesVar';
import { AuthenticationService } from '../../services/authentication.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styles: []
})
export class ChangePassComponent implements OnInit {

load:boolean;
token;
changePassForm:FormGroup;
  

  constructor(private activatedRoute: ActivatedRoute,private initForms: FormBuilder,
  private router: Router,
  private toastyService:ToastyService,
  private authenticationService: AuthenticationService,
   private toastyConfig: ToastyConfig  ) {
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";
     }

  ngOnInit() {
  	   this.load=false;
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
        this.token = params['token'];
        console.log(this.token);
      });

  this.changePassForm = this.initForms.group({
        email: ["", [Validators.required, Validators.pattern(Globals.patronEmail)]],
        password: ["", Validators.required]
      });
  }

    public changePassEvent(event) {
    this.load=true;
    //Desencadena el evento Login .-
    //Debug ->
    //sacar la recepcion del evento luego
    // //console.log(event);
    if(this.changePassForm.valid) {
            this.authenticationService.changePass(
              this.changePassForm.get('email').value,
              this.changePassForm.get('password').value,
              this.token
            )
            .subscribe(
                data => {
                  console.log(data);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.load=false;
                    if (error.status==433) {
                       this.toastyService.warning(
                          {
                            title: "Deshabilitado",
                            msg: "Su usuario ha sido deshabilitado, si cree que es un error contacte al administrador",
                            showClose: true,
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
                            showClose: true,
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
                            showClose: true,
                            timeout: 10000,
                            theme: "bootstrap"
                        }
                        )};

                    });}
        /*//console.log(this.loginForm.value);*/
    }
  

}
