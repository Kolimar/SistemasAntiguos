import { Component, OnInit,AfterViewInit,EventEmitter,Output,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as global from '../globals/globalesVar';
import { UserService } from '../services/users.service';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
/*REFRESH LOGIN*/  
import { RefreshloginComponent } from '../components/refreshlogin/refreshlogin.component';
/* FIN REFRESH LOGIN*/

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit,OnDestroy{
  loading:boolean;
  admin:boolean=false;
  userData;

/*REFRESH LOGIN*/  
  
 modal=false;

/* FIN REFRESH LOGIN*/

constructor(private router:Router, private _actualUser:UserService, private confirmationService: ConfirmationService) { }


private ngUnsubscribe: Subject<void> = new Subject<void>();


ngOnInit(){

  this.loading=true;
  this.loadData();
  this.loading=false;

}

ngAfterViewInit(){}

ngOnDestroy(){
   this.ngUnsubscribe.next();
   this.ngUnsubscribe.complete();
}

loadData(adminParameter?){
      this._actualUser.currentUser().takeUntil(this.ngUnsubscribe).subscribe(
       response => {
          this.userData = response;

          if (this.userData.admin == "true") {
            this.admin=true;
        }
         
       }, error => {
         if (error.status == 433 || error.status == 500) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }
         if (error.status == 403 || error.status == 401) {
           this.modal = true;
         }
       });
    }          
}

