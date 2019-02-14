import { Component, OnInit } from '@angular/core';
import { User } from '../models/index';

@Component({
    moduleId: module.id,
    selector: 'page-sidebar',
    templateUrl: './page-sidebar.html',
    providers: [PageSidebarComponent]
})

export class PageSidebarComponent implements OnInit{
  currentUser: User;

  constructor()
  {

  }

  // INICIO AUTOMATICO
  ngOnInit(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
