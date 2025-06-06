import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { combineLatest, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Member } from '../models/member.model';
import { Group, Visibility } from '../models/group.model';
import { UserGroupService } from './usergroup.service';
import { UserGroup } from '../models/usergroup.model';
import { user, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private COLLECTION_NAME = "groups"

  constructor(private database: Database, private userGroupService: UserGroupService) { }


  editGroup(group: Group) {

    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let groupRef = ref(this.database, `/${this.COLLECTION_NAME}/${group.id}`);
    return set(groupRef, group) as Promise<void>
  }


  createGroup(group: Group): Promise<Group> {

    let groupRef = ref(this.database, `/${this.COLLECTION_NAME}/${group.id}`);

    if (group.id == "-1") {
      let newGroupRef = ref(this.database, this.COLLECTION_NAME);

      let idRandom = push(newGroupRef);

      groupRef = idRandom;
      if (groupRef.key != null) {
        group.id = groupRef.key;
      }

    }
    //Crear un nuevo grupo
    return set(groupRef, group).then(() => group).catch((error) => { return Promise.reject(error); });
  }


  getGroupById(gid: string): Observable<Group> {

    const groupsRef = ref(this.database, this.COLLECTION_NAME);
    const groupRef = child(groupsRef, gid);

    return objectVal(groupRef) as Observable<Group>
  }


  deleteGroup(group: Group): Promise<void> {
    const groupsRef = ref(this.database, `/${this.COLLECTION_NAME}/${group.id}`);

    return this.userGroupService.removeByGroup(group.id) // Elimina los UserGroups relacionados
      .then(() => {
        // Cuando termine, elimina el grupo
        return remove(groupsRef);
      })
      .catch((error) => {
        console.error('Error eliminando grupo y sus userGroups:', error);
        // Re-lanzamos el error para que quien llame pueda manejarlo también
        return Promise.reject(error);
      });
  }

  getAllPublicGroups(): Observable<Group[]> {
    const groupsRef = ref(this.database, this.COLLECTION_NAME);
    const groupQuery = query(groupsRef, orderByChild('visibility'), equalTo(Visibility.PUBLIC));

    return listVal(groupQuery) as Observable<Group[]>
  }

  getPublicGroupsNoBelogTo(uid: string): Observable<Group[]> {

    const publicGroups = this.getAllPublicGroups();
    const groupsBelogTo = this.userGroupService.getByUser(uid);

    return combineLatest([publicGroups, groupsBelogTo]).pipe(
      map(([publicGroups, groupsBelogTo]) => {
        const joinedGroupIds = new Set(groupsBelogTo.map(ug => ug.groupId));

        return publicGroups.filter(group =>
          group.visibility === Visibility.PUBLIC && !joinedGroupIds.has(group.id)
        );
      })
    );
  }

  getGroupByUser(uid: string): Observable<Group[]> {
    return this.userGroupService.getByUser(uid).pipe(
      switchMap((userGroups: UserGroup[]) => {
        let groupRequests: Observable<Group> = new Observable();
        userGroups.map((userGroup: UserGroup) => {
          return this.getGroupById(userGroup.groupId).pipe(
            map((group: Group) => {
              return group;
            })
          ) // devuelve Observable<Group>

        }
        );
        return forkJoin(groupRequests); // combina todos en un solo Observable<Group[]>
      })
    );
  }

  getGroupsByAdminStatus(uid: string): Observable<{ adminGroups: Group[]; memberGroups: Group[] }> {
    return this.userGroupService.getByUser(uid).pipe(
      switchMap((userGroups: UserGroup[]) => {
        if (!userGroups || userGroups.length === 0) {
          return of({ adminGroups: [], memberGroups: [] });
        }

        const adminUGs = userGroups.filter(ug => ug.admin);
        const memberUGs = userGroups.filter(ug => !ug.admin);

        // Observable que devuelve todos los grupos donde es admin, o array vacío si no hay
        const adminGroups$ = adminUGs.length
          ? combineLatest(adminUGs.map(ug => this.getGroupById(ug.groupId)))
          : of([]);

        // Observable que devuelve todos los grupos donde NO es admin, o array vacío si no hay
        const memberGroups$ = memberUGs.length
          ? combineLatest(memberUGs.map(ug => this.getGroupById(ug.groupId)))
          : of([]);

        // Combinar ambos resultados en un solo observable
        return combineLatest([adminGroups$, memberGroups$]).pipe(
          map(([adminGroups, memberGroups]) => ({ adminGroups, memberGroups }))
        );
      })
    );
  }



}
