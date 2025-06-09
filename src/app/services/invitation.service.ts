import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { MemberService } from './member.service';
import { Member } from '../models/member.model';
import { Database, equalTo, get, orderByChild, push, query, ref, set } from '@angular/fire/database';
import { Invitation } from '../models/invitation.model';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private COLLECTION_NAME = "invitations"

  constructor(private database: Database) { }

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
}
