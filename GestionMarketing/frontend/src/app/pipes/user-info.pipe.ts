import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userInfo'
})
export class UserInfoPipe implements PipeTransform {

  transform(value: any): any {
    let user=[];

    for(let info in value){
    	user.push(info);
    }
    return user;
  }

}
