import { Component } from '@angular/core';
import {DialogModule} from 'primeng/primeng';


@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html'
})
export class AppComponent {

	display: boolean = false;


    getLogin(event) {
    	console.log(event);
        //this.display = true;
    }


 }
