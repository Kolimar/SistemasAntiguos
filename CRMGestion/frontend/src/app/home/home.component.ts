import { Component, OnInit }         from '@angular/core';

import { User }                      from '../models/index';
import { UserService }               from '../services/index';

@Component({
    moduleId: module.id,
    templateUrl: './home.component.html',
})

export class HomeComponent {
  currentDate: Date;

  constructor()
  {
    this.currentDate= new Date();
  }

}
