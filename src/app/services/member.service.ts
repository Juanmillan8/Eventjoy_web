import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, set } from '@angular/fire/database';
import { Person } from '../models/person.model';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { Member } from '../models/member.model';
import { GroupService } from './group.service';
import { UserGroupService } from './usergroup.service';
import { UserGroup } from '../models/usergroup.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private COLLECTION_NAME = "members"

  constructor(private database: Database, private userGroupService: UserGroupService) { }

  /**
    * Crea una nueva persona
    * @param person reserva a guardar o editar
    */
  saveMember(member: Member) {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let memberRef = ref(this.database, `/${this.COLLECTION_NAME}/${member.userAccountId}`);

    //Crear nueva reserva
    return set(memberRef, member) as Promise<void>
  }

  getMemberByUid(uid: string): Observable<Member> {

    const membersRef = ref(this.database, this.COLLECTION_NAME);
    const memberRef = child(membersRef, uid);

    return objectVal(memberRef) as Observable<Member>
  }

  getMemberByEmail(email: string): Observable<Member[]> {

    const membersRef = ref(this.database, this.COLLECTION_NAME);
    const memberQuery = query(membersRef, orderByChild('email'), equalTo(email));

    return listVal(memberQuery) as Observable<Member[]>
  }

  getAllMembers(): Observable<Member[]> {

    const membersRef = ref(this.database, this.COLLECTION_NAME);
    return listVal(membersRef) as Observable<Member[]>
  }

  getMembersByGroup(gid: string): Observable<Member[]> {
    const usersGroup$ = this.userGroupService.getByGroup(gid); // Observable<UserGroup[]>
    const users$ = this.getAllMembers(); // Observable<Member[]>

    return combineLatest([usersGroup$, users$]).pipe(
      map(([usersGroup, users]) => {
        const userIdsInGroup = usersGroup.map(ug => ug.userId);
        return users.filter(user => userIdsInGroup.includes(user.id));
      })
    );
  }
  getAdminByGroup(gid: string): Observable<Member[]> {
    const usersGroup$ = this.userGroupService.getByGroup(gid); // Observable<UserGroup[]>
    const users$ = this.getAllMembers(); // Observable<Member[]>

    return combineLatest([usersGroup$, users$]).pipe(
      map(([usersGroup, users]) => {
        // Filtrar los UserGroup que son administradores
        const adminUserIds = usersGroup
          .filter(ug => ug.admin)
          .map(ug => ug.userId);

        // Filtrar los usuarios que están en la lista de administradores
        return users.filter(user => adminUserIds.includes(user.id));
      })
    );
  }




  getMemberByUidPromise(uid: string): Promise<Member> {
    return firstValueFrom(this.getMemberByUid(uid))
  }
}
