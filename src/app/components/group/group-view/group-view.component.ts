import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Group } from '../../../models/group.model';
import { Member } from '../../../models/member.model';
import { UserGroupService } from '../../../services/usergroup.service';
import { GroupService } from '../../../services/group.service';
import { MemberService } from '../../../services/member.service';
import { EventListComponent } from "../../event/event-list/event-list.component";
import { AuthService } from '../../../services/auth.service';
import { UserEvent } from '../../../models/userevent.model';
import { UserEventService } from '../../../services/userevent.service';
import { FormsModule } from '@angular/forms';
import { UserGroup } from '../../../models/usergroup.model';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [CommonModule, EventListComponent, FormsModule, RouterLink],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.css'
})
export class GroupViewComponent implements OnInit {

  groupId: string | null = null;
  group: Group | null = null;
  members: Member[] | null = null;
  admins: Member[] | null = null;
  authMember: Member | null = null;
  filterTermMembers: string = '';
  usersGroup: UserGroup[] = [];
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  toastTimeout: any = null;

  constructor(private route: ActivatedRoute, private memberService: MemberService, private groupService: GroupService, private authService: AuthService, private userGroupService: UserGroupService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      this.groupId = params.get('id');
      console.log(this.groupId);

      if (this.groupId) {
        this.groupService.getGroupById(this.groupId).subscribe((group: Group) => {
          this.group = group;
        })
        this.memberService.getMembersByGroup(this.groupId).subscribe((members: Member[]) => {
          this.members = members;
        });
        this.memberService.getAdminByGroup(this.groupId).subscribe((admins: Member[]) => {
          this.admins = admins;
        });
        this.userGroupService.getByGroup(this.groupId).subscribe((usersGroup: UserGroup[]) => {
          this.usersGroup = usersGroup;
        })

      }

      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        this.authMember = member;

      });
    });
  }

  isAdmin(userId: string): boolean {
    return this.admins?.some(admin => admin.id === userId) ?? false;
  }

  isAuthUserAdmin() {
    if (this.authMember) {
      return this.isAdmin(this.authMember.userAccountId);
    } else {
      return false;
    }
  }
  makeAdmin(user: Member) {
    let findUg = this.usersGroup.find((ug: UserGroup) => { return ug.groupId == this.groupId && ug.userId == user.id });
    if (findUg) {
      findUg.admin = true;
      this.userGroupService.saveUserGroup(findUg).then(()=>{
          this.showToast(`${user.name} is now an admin.`, 'success');
      });
    }
  }
  removeAdmin(user: Member) {
    let findUg = this.usersGroup.find((ug: UserGroup) => { return ug.groupId == this.groupId && ug.userId == user.id });
    let numberOfAdmins = this.usersGroup.filter((ug: UserGroup) => { return ug.groupId == this.groupId && ug.admin == true });


    if (findUg && numberOfAdmins.length > 1) {
      findUg.admin = false;
      this.userGroupService.saveUserGroup(findUg).then(()=>{
          this.showToast(`${user.name}  has been removed as an administrator.`, 'success');
      });;
    } else if (numberOfAdmins.length == 1) {
        this.showToast(`There must be at least one administrator in the group.`, 'danger');
    }
  }

  removeUser(user: Member) {
    let findUg = this.usersGroup.find((ug: UserGroup) => { return ug.groupId == this.groupId && ug.userId == user.id });
    if (findUg) {
      findUg.admin = true;
      this.userGroupService.deleteUserGroup(findUg.id);
      this.showToast(`There must be at least one administrator in the group.`, 'danger');

    }
  }

  get filteredMembers(): Member[] {
    const term = this.filterTermMembers.trim().toLowerCase();
    if (!this.members) {
      return [];
    }

    return this.members.filter(m => {
      // concatenamos los campos que queremos buscar
      const haystack = [
        m.name,
        m.surname,
        m.username
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }
  
showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info', duration: number = 3000): void {
  this.toastMessage = message;
  this.toastType = type;

  // Limpiar timeout anterior si existe
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
  }

  // Autocierre tras x milisegundos
  this.toastTimeout = setTimeout(() => {
    this.toastMessage = null;
  }, duration);
}

closeToast(): void {
  this.toastMessage = null;
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
  }
}
}
