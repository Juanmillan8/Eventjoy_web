import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../../models/group.model';
import { Member } from '../../../models/member.model';
import { UserGroupService } from '../../../services/usergroup.service';
import { GroupService } from '../../../services/group.service';
import { MemberService } from '../../../services/member.service';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.css'
})
export class GroupViewComponent implements OnInit {

  groupId: string | null = null;
  group: Group | null = null;
  members: Member[] | null = null;
  admins: Member[] | null = null;

  constructor(private route: ActivatedRoute, private memberService: MemberService, private groupService: GroupService) { }

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
    });
  }

  isAdmin(userId: string): boolean {
  return this.admins?.some(admin => admin.id === userId) ?? false;
}
}
