import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [CommonModule, EventListComponent,FormsModule],
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

  constructor(private route: ActivatedRoute, private memberService: MemberService, private groupService: GroupService, private authService:AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      this.groupId = params.get('id');
      console.log(this.groupId);

      if (this.groupId) {
        this.groupService.getGroupById(this.groupId).subscribe((group: Group) => {
          this.group = group;
        })
      }
      if (this.groupId) {
        this.memberService.getMembersByGroup(this.groupId).subscribe((members: Member[]) => {
          this.members = members;
        });
        this.memberService.getAdminByGroup(this.groupId).subscribe((admins: Member[]) => {
          this.admins = admins;
        });
      }
          this.authService.getUserDataAuth().subscribe(({ user, member }) => {
            this.authMember = member;
           
          });

    });
  }

  isAdmin(userId: string): boolean {
  return this.admins?.some(admin => admin.id === userId) ?? false;
  }

  isAuthUserAdmin(){
    if(this.authMember){
      return this.isAdmin(this.authMember.userAccountId);
    }else{
      return false;
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
}
