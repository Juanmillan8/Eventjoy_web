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
import { MemberService } from './member.service';

import { Valoration } from '../models/valoration.model';

export interface ValorationWithUsername extends Valoration {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValorationService {

  private COLLECTION_NAME = "valorations"


  constructor(private database: Database, private memberService: MemberService) { }


  getReceivedValorationsWithRaters(uid: string): Observable<{ valoration: Valoration; rater: Member }[]> {
    // 1) Primero recuperamos las valoraciones hechas por uid
    const valorationsRef = ref(this.database, this.COLLECTION_NAME);
    const valorationsQuery = query(
      valorationsRef,
      orderByChild('ratedUserId'),
      equalTo(uid)
    );

    return listVal(valorationsQuery).pipe(
      switchMap(rawVals => {
        const vals: Valoration[] = rawVals
          ? rawVals.map(v => Valoration.fromJson(v))
          : [];

        // Si no hay ninguna valoración, devolvemos array vacío
        if (vals.length === 0) {
          return of([]);
        }

        // 2) Para cada valoracion, creamos un Observable que devuelve { valoration, rater }
        const observables = vals.map(val =>
          this.memberService.getMemberByUid(val.raterUserId).pipe(
            map((m: Member) => ({
              valoration: val,
              rater: m
            }))
          )
        );

        // 3) Combinamos todos con combineLatest para obtener un array con resultados
        return combineLatest(observables);
      })
    );
  }

  getMadeValorationsWithRaters(uid: string): Observable<{ valoration: Valoration; rater: Member }[]> {
    // 1) Primero recuperamos las valoraciones hechas por uid
    const valorationsRef = ref(this.database, this.COLLECTION_NAME);
    const valorationsQuery = query(
      valorationsRef,
      orderByChild('raterUserId'),
      equalTo(uid)
    );

    return listVal(valorationsQuery).pipe(
      switchMap(rawVals => {
        const vals: Valoration[] = rawVals
          ? rawVals.map(v => Valoration.fromJson(v))
          : [];

        // Si no hay ninguna valoración, devolvemos array vacío
        if (vals.length === 0) {
          return of([]);
        }

        // 2) Para cada valoracion, creamos un Observable que devuelve { valoration, rater }
        const observables = vals.map(val =>
          this.memberService.getMemberByUid(val.ratedUserId).pipe(
            map((m: Member) => ({
              valoration: val,
              rater: m
            }))
          )
        );

        // 3) Combinamos todos con combineLatest para obtener un array con resultados
        return combineLatest(observables);
      })
    );
  }

  save(valoration: Valoration) {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let valorationRef = ref(this.database, `/${this.COLLECTION_NAME}/${valoration.id}`);

    if (valoration.id == "-1") {
      let newValorationRef = ref(this.database, this.COLLECTION_NAME);
      let idRandom = push(newValorationRef);

      //Modificamos el id, que es 0, a un id random
      valorationRef = idRandom;
      if (valorationRef.key != null) {
        valoration.id = valorationRef.key;
      }
    }
    //Crear nueva reserva
    return set(valorationRef, valoration) as Promise<void>
  }

  delete(vid: string): Promise<void> {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let valorationRef = ref(this.database, `/${this.COLLECTION_NAME}/${vid}`);
    return remove(valorationRef);
  }

  async hasBeenUserRated(userRater: string, userRated: string): Promise<boolean> {
    const valorationsRef = ref(this.database, this.COLLECTION_NAME);
    const valorationsQuery = query(
      valorationsRef,
      orderByChild('raterUserId'),
      equalTo(userRater) // Buscamos valoraciones realizadas por userRated
    );


      const rawVals = await firstValueFrom(listVal(valorationsQuery));
      const vals: Valoration[] = rawVals
        ? rawVals.map(v => Valoration.fromJson(v))
        : [];

        // Comprobamos si alguna valoración tiene como rated el userRater y el mismo groupId
        return vals.some(v => v.ratedUserId === userRated);
      
  }
}
