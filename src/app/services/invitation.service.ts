import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { catchError, combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { MemberService } from './member.service';
import { Member } from '../models/member.model';
import { Database, equalTo, get, listVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { Invitation } from '../models/invitation.model';
import { Group } from '../models/group.model';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private COLLECTION_NAME = "invitations"

  constructor(private database: Database, private memberService: MemberService,private groupService:GroupService) { }

  save(invitation: Invitation) {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let invitationRef = ref(this.database, `/${this.COLLECTION_NAME}/${invitation.id}`);

    if (invitation.id == "-1") {
      let newInvitationRef = ref(this.database, this.COLLECTION_NAME);
      let idRandom = push(newInvitationRef);

      //Modificamos el id, que es 0, a un id random
      invitationRef = idRandom;
      if (invitationRef.key != null) {
        invitation.id = invitationRef.key;
      }
    }
    //Crear nueva reserva
    return set(invitationRef, invitation) as Promise<void>
  }

  deleteInvitation(invitation: Invitation): Promise<void> {
      const invitationRef = ref(this.database, `/${this.COLLECTION_NAME}/${invitation.id}`);
  
      return remove(invitationRef);
    }

  existInvitationByUserAndGroupId(userId:string,groupId:string): Promise<boolean>{
     const invitationRef = ref(this.database, this.COLLECTION_NAME);
        const invitationQuery = query(
          invitationRef,
          orderByChild('invitedUserId'),
          equalTo(userId)
        );
    
        return get(invitationQuery).then(snapshot => {
          if (!snapshot.exists()) return false;
    
          const values = Object.values(snapshot.val() as Observable<Invitation>);
    
          const pendingInvitation = values.filter((invitation:Invitation)=>invitation.groupId === groupId);
    
          return pendingInvitation.length > 0;
        }).catch(err => {
          console.error('Error checking reports:', err);
          return false;
        });
  }

getReceivedInvitations(uid: string): Observable<{ invitation: Invitation; user: Member; group: Group }[]> {
  const reportRef = ref(this.database, this.COLLECTION_NAME);
  const reportQuery = query(
    reportRef,
    orderByChild('invitedUserId'),
    equalTo(uid)
  );

  return listVal(reportQuery).pipe(
    switchMap(rawVals => {
      const vals: Invitation[] = rawVals
        ? rawVals.map(v => Invitation.fromJson(v))
        : [];

      if (vals.length === 0) {
        return of([]);
      }

      const observables = vals.map(val =>
        combineLatest([
          this.memberService.getMemberByUid(val.inviterUserId),
          this.groupService.getGroupById(val.groupId)
        ]).pipe(
          map(([user, group]) => ({
            invitation: val,
            user: user,
            group: group
          }))
        )
      );

      return combineLatest(observables);
    })
  );
}

}
