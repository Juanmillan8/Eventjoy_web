import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { MemberService } from './member.service';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private memberService:MemberService) { 

  }
  register(data:{email:string,password:string}):Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.auth, data.email,data.password)
  }

  login(data:{email:string,password:string}):Promise<UserCredential>{
    return signInWithEmailAndPassword(this.auth, data.email,data.password)
  }
  
  loginGoogle():Promise<UserCredential>{
    return signInWithPopup(this.auth,new GoogleAuthProvider());
  }

  logout(){
    return signOut(this.auth)
  }

  getUserAuthenticated(): Observable<User|null> {
    return new Observable((observer) => {
      onAuthStateChanged(
        this.auth,
        (user) => {
          observer.next(user);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
 /*** 
   * Para trabajar de manera más eficiente con los observables en este ejemplo se está 
   * haciendo uso de la librería RXjs que nos permitirá gestionar de manera eficiente flujos
   * de datos. Concretamente, se están usando los siguientes métodos:
   * 
   *  - FROM ->  convierte algo (un array, una promesa, un conjunto de valores, etc.) en un observable.
   *  - PIPE -> es un encadenador de transformaciónes. Nos permitirá aplicar funciones de transformación
   *            a los valores emitidos por un observable. Es como si tuvieramos una cadena de operaciones.
   *            que se aplican una tras otra.
   *  - MAP -> transforma los valores que llegan de un observable. Recibe un valor, lo procesa y lo devuelve transformado.
   * 
   *  - SwitchMap -> es un operador más avanzado que Map. También transforma los valores, pero la diferencia es que si se
   *                 emiten nuevos valores antes de que termine la transformación anterior, cancela la transformación 
   *                 anterior y solo usa la nueva.
   */
 /**
  * Función que devuelve la información del usuario autenticado, así como los datos de su persona.
  * En caso de no existir o no estar autenticado devolverá null.
  * @returns 
  */
 getUserDataAuth(): Observable<{user:User|null,member:Member|null}>{
  return this.getUserAuthenticated().pipe(
    switchMap((usuario)=>{
      if(usuario && usuario.uid){
        return this.memberService.getMemberByUid(usuario.uid).pipe(
          map((member)=>{
            if(member){
              return {user:usuario,member:member}
            }else{
              return {user:null,member:null}
            }
          }),
          catchError(()=>{
            return of({user:null,member:null})
          })
        )
      }else{
        return of({user:null,member:null})
      }
    }),
    catchError(()=>{
      return of({user:null,member:null})
    })
  )
}

}
