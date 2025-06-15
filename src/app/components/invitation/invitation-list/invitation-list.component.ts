import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { Member } from '../../../models/member.model';
import { ReportService } from '../../../services/report.service';
import { AuthService } from '../../../services/auth.service';
import { InvitationService } from '../../../services/invitation.service';
import { Invitation } from '../../../models/invitation.model';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-invitation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invitation-list.component.html',
  styleUrl: './invitation-list.component.css'
})
export class InvitationListComponent implements OnInit {

  @Input() view: string | null = null;

  receivedInvitations: { invitation: Invitation; user: Member; group: Group }[] | null = null;

  authMember: Member | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  toastTimeout: any = null;

  constructor(private invitationService: InvitationService, private authService: AuthService,private router:Router) { }

  ngOnInit(): void {

    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.authMember = member;
      if (this.authMember) {
        this.loadList();
      }
    });
  }

  private loadList() {

    if (this.view === 'RECEIVED' && this.authMember) {
      this.invitationService
        .getReceivedInvitations(this.authMember.userAccountId)
        .subscribe((list) => {
          this.receivedInvitations = list
        });
    }

  }

  acceptInvitation(invitation:Invitation){
    this.invitationService.deleteInvitation(invitation).then(() => { 
      this.showToast("Invitation successfully accepted.","success");
      this.router.navigate(["/viewgroup/",invitation.groupId])
    }).catch(() => { 
      this.showToast("Error accepting invitation.","danger")
    });
  }
  rejectInvitation(invitation: Invitation) {
    this.invitationService.deleteInvitation(invitation).then(() => { 
      this.showToast("Invitation successfully rejected.","success")
    }).catch(() => { 
      this.showToast("Error rejecting the invitation.","danger")
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
