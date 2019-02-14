import { Component, OnInit }         from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User }                      from '../models/index';
import { UserService, AuthenticationService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ApiSettings } from '../global/index';

@Component({
    moduleId: module.id,
    selector: 'page-header',
    templateUrl: './page-header.html',
})

export class PageHeaderComponent implements OnInit{
  currentUser: User;
  returnUrl: string;

	constructor(
        private userService: UserService,
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
    ){
        // OPCIONES PREDETERMINADAS TASTY
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.showClose = true;
    }

    // INICIO AUTOMATICO
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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

}
