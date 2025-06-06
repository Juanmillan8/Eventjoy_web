import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { AuthService } from '../../../services/auth.service';
import { Group } from '../../../models/group.model';
import { UserGroupService } from '../../../services/usergroup.service';
import { UserGroup } from '../../../models/usergroup.model';
import { CommonModule } from '@angular/common';
import { Member } from '../../../models/member.model';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit {
  type: Number | null = null;
  groupAdminList: Group[] | null = null;
  groupNOAdminList: Group[] | null = null;
  groupNoBelgonTo: Group[] | null = null;
  showType:string = "JOINED";

  allGroups: Group[] | null = null;
  authMember: null | Member = null;
  constructor(private router: Router, private groupService: GroupService, private userGroupService: UserGroupService, private authService: AuthService) { }


  ngOnInit() {
    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      if (user && member) {
        this.authMember = member;
        this.groupService.getGroupsByAdminStatus(member.userAccountId).subscribe(({ adminGroups, memberGroups }) => {
          this.groupAdminList = adminGroups;
          this.groupNOAdminList = memberGroups;
        });
      }
    });
  }

  showOthersPublicGroups() {
    this.showType="OTHERS";
    if (this.authMember) {
      this.groupService.getPublicGroupsNoBelogTo(this.authMember?.userAccountId).subscribe((groups: Group[]) => {
        this.groupNoBelgonTo = groups;
      })
    }

  }
  showMyGroups() {
    this.showType="JOINED";
    if (this.authMember) {

      this.groupService.getGroupsByAdminStatus(this.authMember.userAccountId).subscribe(({ adminGroups, memberGroups }) => {
        this.groupAdminList = adminGroups;
        this.groupNOAdminList = memberGroups;
      });
    }
  }

  showAllGroups() {
    this.showType="ALL";

    if (this.authMember) {
      
      this.groupService.getAllPublicGroups().subscribe((groups: Group[]) => {
        this.allGroups = groups;
      });
    }
  }
  joinGroup(gid: string) {
    if (this.authMember) {
      let userGroup = new UserGroup("-1", this.authMember?.userAccountId, gid, false, new Date().toLocaleDateString(), false)
      this.userGroupService.saveUserGroup(userGroup).then(() => {
        this.router.navigate(["/groups"]);
      })
    }
  }

  isJoined(groupId: string):boolean | undefined{
    return this.groupAdminList?.some(group => group.id === groupId) || this.groupNOAdminList?.some(group => group.id === groupId);
  }
  isAdmin(groupId: string):boolean| undefined{
    return this.groupAdminList?.some(group => group.id === groupId);
  }

  leaveGroup(gid: string) {
    if (this.authMember && this.isAdmin(gid)!=undefined && !this.isAdmin(gid)) {

      this.userGroupService.getByUserIdAndGroup(this.authMember.userAccountId, gid).then((value: UserGroup | undefined) => {
        if (value != undefined && value) {
          this.userGroupService.deleteUserGroup(value.id);
          this.showMyGroups();
        }
      })
    }
  }

 
}
