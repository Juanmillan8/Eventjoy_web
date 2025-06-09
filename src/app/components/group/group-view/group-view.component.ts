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
import { ValorationFormModalComponent } from '../../valoration/valoration-form-modal/valoration-form-modal.component';
import { ValorationService } from '../../../services/valoration.service';
import { Valoration } from '../../../models/valoration.model';
import { ReportFormModalComponent } from "../../report/report-form-modal/report-form-modal.component";
import { Report, ReportReason, ReportStatus } from '../../../models/report.model';
import { ReportService } from '../../../services/report.service';
import { InvitationFormModalComponent } from '../../invitation/invitation-form-modal/invitation-form-modal.component';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [CommonModule, EventListComponent, FormsModule, RouterLink, ValorationFormModalComponent, ReportFormModalComponent,InvitationFormModalComponent],
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
  selectedUserId: string | null = null;
  showValorationModal = false;
  showReportModal = false;
  showInvitationModal = false;
  report: Report | null = null;  

  constructor(private route: ActivatedRoute, private memberService: MemberService, private groupService: GroupService, private authService: AuthService, private userGroupService: UserGroupService, private valorationService: ValorationService, private reportService:ReportService) { }

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
      this.userGroupService.saveUserGroup(findUg).then(() => {
        this.showToast(`${user.name} is now an admin.`, 'success');
      });
    }
  }
  removeAdmin(user: Member) {
    let findUg = this.usersGroup.find((ug: UserGroup) => { return ug.groupId == this.groupId && ug.userId == user.id });
    let numberOfAdmins = this.usersGroup.filter((ug: UserGroup) => { return ug.groupId == this.groupId && ug.admin == true });


    if (findUg && numberOfAdmins.length > 1) {
      findUg.admin = false;
      this.userGroupService.saveUserGroup(findUg).then(() => {
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
      this.showToast(`The user ` + user.name + ` has been successfully removed.`, 'success');

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

  openValorationModal(user: any) {
    this.selectedUserId = user.id;
    if (this.authMember && this.selectedUserId) {
      this.valorationService.hasBeenUserRated(this.authMember.id, this.selectedUserId).then((res: boolean) => {
        if (res) {
          this.showToast("The user has already been assessed.", "danger")
        } else {
          this.showValorationModal = true;
        }
      })
    }
  }

  onSubmitValoration(data: Valoration ) {
    if (this.selectedUserId && this.authMember) {
      let valoration = new Valoration("-1", data.title, data.description, data.rating, this.selectedUserId, this.authMember.id)
      this.valorationService.save(valoration).then(() => {
        this.showToast("Valuation created successfully.", "success")
      }).catch(() => {
        this.showToast("Error creating the valuation.", "danger")
      })
    }
  }

  closeValorationModal() {
    this.showValorationModal = false;
  }

  openReportModal(user: any) {
    this.selectedUserId = user.id;
    if (this.authMember && this.selectedUserId && this.groupId) {
      let newReport = new Report("-1",ReportReason.OFFENSIVE_LANGUAGE,"",this.selectedUserId,this.authMember.id,this.groupId,new Date().toLocaleDateString(),ReportStatus.PENDING)
      this.report = newReport;

      this.reportService.existReportsToUserPending(this.selectedUserId,this.authMember.userAccountId,this.groupId).then((res: boolean) => {
        if (res) {
          this.showToast("There is already a pending report for this group.", "danger")
        } else {
          this.showReportModal = true;
        }
      })
    }
  }

  onSubmitReport(data: Report ) {
    if (this.selectedUserId && this.authMember) {
      data.reportStatus = ReportStatus.PENDING;
      data.reportedAt = new Date().toLocaleDateString();
      
      this.reportService.save(data).then(() => {
        this.showToast("Report created successfully.", "success")
      }).catch(() => {
        this.showToast("Error creating the report.", "danger")
      })
    }
  }

  closeReportModal() {
    this.showReportModal = false;
  }

 openInvitationModal() {
    if (this.group && this.isAuthUserAdmin() ) {
      this.showInvitationModal = true;
      console.log("Show invitation moddal")
    }
  }
  closeInvitationModal() {
    this.showInvitationModal = false;
  }
}
