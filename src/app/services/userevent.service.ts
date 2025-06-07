import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { combineLatest, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { UserEvent } from '../models/userevent.model';

@Injectable({
  providedIn: 'root'
})
export class UserEventService {

  private COLLECTION_NAME = "userEvents"


  constructor(private database: Database) { }


  getByUser(uid: string): Observable<UserEvent[]> {

    //Creamos la referencia de la persona que deseamos guardar en firebase database
    const userEventRef = ref(this.database, this.COLLECTION_NAME);
    const userEventsQuery = query(userEventRef, orderByChild('userId'), equalTo(uid));

    return listVal(userEventsQuery) as Observable<UserEvent[]>;
  }



  getByEvent(eventId: string): Observable<UserEvent[]> {

    //Creamos la referencia de la persona que deseamos guardar en firebase database
    const userEventRef = ref(this.database, this.COLLECTION_NAME);
    const userEventsQuery = query(userEventRef, orderByChild('eventId'), equalTo(eventId));

    return listVal(userEventsQuery) as Observable<UserEvent[]>;
  }

  createUserEvent(userEvent: UserEvent) {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let userEventRef = ref(this.database, `/${this.COLLECTION_NAME}/${userEvent.id}`);

    if(userEvent.id == "-1"){
        let newUserEventRef = ref(this.database,this.COLLECTION_NAME);
        let idRandom = push(newUserEventRef);
      
        //Modificamos el id, que es 0, a un id random
        userEventRef = idRandom;
        if(userEventRef.key !=null){
          userEvent.id = userEventRef.key;
        }
    }
    //Crear nueva reserva
    return set(userEventRef, userEvent) as Promise<void>
  }

  deleteUserEvent(ue: UserEvent): Promise<void> {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let userGroupRef = ref(this.database, `/${this.COLLECTION_NAME}/${ue.id}`);
    return remove(userGroupRef);
  }

}
