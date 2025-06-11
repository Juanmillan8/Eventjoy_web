import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Member } from '../../models/member.model';
import { InvitationListComponent } from '../../components/invitation/invitation-list/invitation-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule,InvitationListComponent],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.css'
})
export class InvitationsComponent implements OnInit {

  constructor(private authService:AuthService){}
  authMember:Member|null = null;

  ngOnInit(): void {

    this.authService.getUserDataAuth().subscribe(({user,member})=>{
      this.authMember = member;
    });  
}

}
