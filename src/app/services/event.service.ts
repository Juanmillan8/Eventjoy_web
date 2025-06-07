import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { combineLatest, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Member } from '../models/member.model';
import { Group } from '../models/group.model';
import { UserGroupService } from './usergroup.service';
import { UserGroup } from '../models/usergroup.model';
import { user, User } from '@angular/fire/auth';
import { Event } from '../models/event.model';
import { UserEventService } from './userevent.service';
import { UserEvent } from '../models/userevent.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private COLLECTION_NAME = "events"


  constructor(private database: Database, private userEventService: UserEventService) { }


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

  deleteEvent(event: Event): Promise<void> {
    const eventRef = ref(this.database, `/${this.COLLECTION_NAME}/${event.id}`);

    return remove(eventRef);
  }

  editEvent(event: Event) {

    let eventRef = ref(this.database, `/${this.COLLECTION_NAME}/${event.id}`);
    return set(eventRef, event) as Promise<void>
  }


  createEvent(event: Event): Promise<Event> {

    let eventRef = ref(this.database, `/${this.COLLECTION_NAME}/${event.id}`);

    if (event.id == "-1") {
      let newEventRef = ref(this.database, this.COLLECTION_NAME);

      let idRandom = push(newEventRef);

      eventRef = idRandom;
      if (eventRef.key != null) {
        event.id = eventRef.key;
      }

    }
    //Crear un nuevo grupo
    return set(eventRef, event).then(() => event).catch((error) => { return Promise.reject(error); });
  }


loadEventsWithUsersByGroup(groupId: string): Observable<{ event: Event; users: UserEvent[] }[]> {
  return this.getEventsByGroup(groupId).pipe(
    switchMap((events: Event[]) => {
      const observables = events.map(event =>
        this.userEventService.getByEvent(event.id).pipe(
          map((userEvents: UserEvent[]) => ({
            event: event,
            users: userEvents
          }))
        )
      );
      return combineLatest(observables);
    })
  );
}
}
