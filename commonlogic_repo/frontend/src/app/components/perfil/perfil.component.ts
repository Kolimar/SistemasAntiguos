import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/users.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
userData:User;
avatar:string;
loading:true;

constructor(private activatedRoute: ActivatedRoute, private _actualUser:UserService) { 
  }

  ngOnInit() {


    if (sessionStorage.getItem("permanentStatement")) {
    //Hago la consulta si en la sesion no existe el objeto del usuario
    ////console.log("desde storage");
    this.userData = JSON.parse(sessionStorage.getItem("permanentStatement"));
    
    }
    else{
    ////console.log("desde consulta");
    this._actualUser.currentUser()
    .subscribe(response => 
      {
        this.userData = response;
        this.avatar="//backend.dev/img/"+response.avatar;
       }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       });
    }

  }

}
