import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { combineLatest, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Member } from '../models/member.model';
import { Group } from '../models/group.model';
import { UserGroupService } from './usergroup.service';
import { UserGroup } from '../models/usergroup.model';
import { user, User } from '@angular/fire/auth';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private COLLECTION_NAME = "events"


  constructor(private database: Database) { }


  getEventsByGroup(gid: string): Observable<Event[]> {

    //Creamos la referencia de la persona que deseamos guardar en firebase database
    const eventsRef = ref(this.database, this.COLLECTION_NAME);
    const eventsQuery = query(eventsRef, orderByChild('groupId'), equalTo(gid));

    return listVal(eventsQuery).pipe(
      map(rawEvents => rawEvents.map(e => Event.fromJson(e)))
    );
  }

  getEventsById(eid: string): Observable<Event> {

    //Creamos la referencia de la persona que deseamos guardar en firebase database
    const eventsRef = ref(this.database, this.COLLECTION_NAME);
    const eventsQuery = query(eventsRef, orderByChild('id'), equalTo(eid));

    return listVal(eventsQuery).pipe(
      map(rawEvents => {
        if (!rawEvents || rawEvents.length === 0) {
          throw new Error(`Event with id ${eid} not found`);
        }
        return Event.fromJson(rawEvents[0]);
      })
    );
  }

}
