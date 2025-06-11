import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Member } from '../../../models/member.model';
import { ReportService } from '../../../services/report.service';
import { AuthService } from '../../../services/auth.service';
import { InvitationService } from '../../../services/invitation.service';
import { Invitation } from '../../../models/invitation.model';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-invitation-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './invitation-list.component.html',
  styleUrl: './invitation-list.component.css'
})
export class InvitationListComponent implements OnInit {

  @Input() view: string | null = null;
  
  receivedInvitations: { invitation: Invitation; user: Member; group: Group  }[] | null = null;

  authMember: Member | null = null;


  constructor(private invitationService: InvitationService, private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.authMember = member;
      if(this.authMember){
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
}
