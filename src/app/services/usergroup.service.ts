import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { firstValueFrom, map, Observable, take } from 'rxjs';
import { Member } from '../models/member.model';
import { Group } from '../models/group.model';
import { UserGroup } from '../models/usergroup.model';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  private COLLECTION_NAME = "userGroups"

  constructor(private database: Database) { }


  saveUserGroup(usergroup: UserGroup) {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let usergroupsRef = ref(this.database, `/${this.COLLECTION_NAME}/${usergroup.id}`);

    //Crear nueva reserva
    return set(usergroupsRef, usergroup) as Promise<void>
  }

  getGroupById(ugid: string): Observable<Group> {

    const usersgroupsRef = ref(this.database, this.COLLECTION_NAME);
    const usergroupRef = child(usersgroupsRef, ugid);

    return objectVal(usergroupRef) as Observable<Group>
  }

  deleteUserGroup(ugid: string): Promise<void> {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let userGroupRef = ref(this.database, `/${this.COLLECTION_NAME}/${ugid}`);
    return remove(userGroupRef);
  }

  getByUser(uid: string): Observable<UserGroup[]> {

    const usersgroupsRef = ref(this.database, this.COLLECTION_NAME);
    const userGroupQuery = query(usersgroupsRef, orderByChild('userId'), equalTo(uid));

    return listVal(userGroupQuery) as Observable<UserGroup[]>
  }

  removeByGroup(gid: string): Promise<void> {
    const usersgroupsRef = ref(this.database, this.COLLECTION_NAME);
    const userGroupQuery = query(usersgroupsRef, orderByChild('groupId'), equalTo(gid));
    let listUserGroup = listVal(userGroupQuery) as Observable<UserGroup[]>;

    return firstValueFrom(listUserGroup).then((userGroups: UserGroup[]) => {
      const deletePromises = userGroups.map(ug => this.deleteUserGroup(ug.id)); 
      return Promise.all(deletePromises).then(() => { });
    });
  }

}
