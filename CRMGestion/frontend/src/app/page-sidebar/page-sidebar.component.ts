import { Component, OnInit }         from '@angular/core';
import { User }                      from '../models/index';
import { UserService }               from '../services/index';

@Component({
    moduleId: module.id,
    selector: 'page-sidebar',
    templateUrl: './page-sidebar.html',
    providers: [PageSidebarComponent]
})

export class PageSidebarComponent{
  isMenuAbm: boolean= false;
  menuAbmActive: boolean= false;

  constructor(){
    this.onMenuAbm();
  }

  onMenuAbm(){
    if (this.isMenuAbm == true) {
        $('#sub-menu-abm').show('fast');
        this.isMenuAbm= false;
        this.menuAbmActive= true;
    }else{
      $('#sub-menu-abm').hide('fast');
      this.isMenuAbm= true;
      this.menuAbmActive= false;
    }
  }

}
