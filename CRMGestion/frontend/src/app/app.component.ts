import { Component } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
    ){

        // OPCIONES PREDETERMINADAS TASTY
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.showClose = true;
    }

}
