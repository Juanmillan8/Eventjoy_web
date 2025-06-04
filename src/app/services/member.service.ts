import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, get, objectVal, push, ref, set } from '@angular/fire/database';
import { Person } from '../models/person.model';
import { firstValueFrom, Observable } from 'rxjs';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  
  private COLLECTION_NAME="members"

  constructor(private database: Database) { }

  /**
    * Crea una nueva persona
    * @param person reserva a guardar o editar
    */
  saveMember(member:Member){
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let memberRef = ref(this.database,`/${this.COLLECTION_NAME}/${member.uid}`);

    //Crear nueva reserva
    return set(memberRef,member) as Promise<void>
  }
  
  getMemberByUid(uid:string):Observable<Member>{
  
      const membersRef = ref(this.database,this.COLLECTION_NAME);
      const memberRef = child(membersRef,uid);
  
      return objectVal(memberRef) as Observable<Member>
  }


  getMemberByUidPromise(uid:string):Promise<Member>{
    return firstValueFrom(this.getMemberByUid(uid))
  }
}
