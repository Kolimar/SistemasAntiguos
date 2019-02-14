import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/users.service';

export class AdminValidator {
  static thisGuyAdmin(_userservice:UserService,router: Router) {
      let perfilActual = _userservice.currentUser()
          .subscribe(
                  data => {
                    if (data.admin=='true'){
                      //console.log('admin');
                    }
                    else{
                      //console.log("No tiene permisos suficientes");
                      localStorage.clear();
                      router.navigate(['login']);
                    }
                  },
                  error => {
                      localStorage.clear();
                      router.navigate(['login']);
                  });
    }
}
