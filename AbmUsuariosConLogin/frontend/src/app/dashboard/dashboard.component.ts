import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as global from '../globals/globalesVar';
import { UserService } from '../services/users.service';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit{
  loading:boolean;
  admin:boolean=false;
  userData;
  constructor(private router:Router, private _actualUser:UserService, private confirmationService: ConfirmationService) { }

ngOnInit(){
  this.loading=true;
  this.loadData();
  this.loading=false;
}

ngAfterViewInit(){


}

  loadData(adminParameter?){
      this._actualUser.currentUser().subscribe(
       response => {
          this.userData = response;

          if (this.userData.admin == "true") {
            this.admin=true;
        }
         
       }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }
       });
    }
    
                
  }

