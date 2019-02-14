import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'refreshLog',
  templateUrl: './refreshlogin.component.html',
  styleUrls: ['./refreshlogin.component.scss']
})
export class RefreshloginComponent implements OnInit {

formIdentificacion: any = {
  "username":"",
  "password":""
};

@Input() modalActivated;

mostrar(){
  this.refreshLogin(this.formIdentificacion.username,this.formIdentificacion.password);
  console.log(this.formIdentificacion);
}

public consola(){
  console.log("refresh");
}
/*  console.log(this.lista);
 this.lista.style.display = "none";
     localStorage.clear();
     sessionStorage.clear();*/
constructor( private authenticationService: AuthenticationService,
	 private router: Router,
  private toastyService:ToastyService,
   private toastyConfig: ToastyConfig  ) {
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "top-right";
     }

lista = document.getElementsByTagName("header")[0];
public refreshLogin(email,password) {
	this.authenticationService.login(
              email,
              password
            )
            .subscribe(
                data => {
                  this.lista.style.display = "inherit";
                	console.log(data);
                    this.modalActivated = false;
                },
                error => {
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

                    });
        /*//console.log(this.loginForm.value);*/
    }


  ngOnInit() {
     
  }

}
