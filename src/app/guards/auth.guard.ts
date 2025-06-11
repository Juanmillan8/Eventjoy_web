import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ROLE } from '../models/person.model';

export const authGuard: CanActivateFn = (route, state):Observable<boolean> => {

  let authService = inject(AuthService);
  let routerService = inject(Router);
  let role = route.data['role'];

  return authService.getUserDataAuth().pipe(
    map(({user,member})=>{
      if(user){
        if(member){
          if(member.role && (member.role == role || role =="*")){
            
            if(member.role == ROLE.MEMBER && (member.name.trim() == "" || member.surname.trim() == ""  || member.birthdate.trim() == ""|| member.dni.trim() == "" || member.phone.trim() == "")){
              
              routerService.navigate(["/showprofile",member.userAccountId])
            }
            return true
          }else{
            routerService.navigate(["/home"])
            return false
          }
        }else{
          routerService.navigate(["/login"])
          return false
        }
      }else{
        routerService.navigate(["/login"])
        return false
      }
    }),
    catchError((error,caught)=>{
      routerService.navigate(["/login"])
      return of(false)
    })
  );

};

