import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { AuthService } from '../../../services/auth.service';
import { Group } from '../../../models/group.model';
import { UserGroupService } from '../../../services/usergroup.service';
import { UserGroup } from '../../../models/usergroup.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit {
  type: Number | null = null;
  groupAdminList: Group[]| null= null;
  groupNOAdminList: Group[]| null= null;

  constructor(private route: ActivatedRoute, private groupService: GroupService,private userGroupService: UserGroupService, private authService: AuthService) { }


  ngOnInit() {
    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      if (user && member) {
        this.groupService.getGroupsByAdminStatus(member.userAccountId).subscribe(({ adminGroups, memberGroups }) => {
          this.groupAdminList = adminGroups;
          this.groupNOAdminList = memberGroups;
        });
      }
    });
  }
}
