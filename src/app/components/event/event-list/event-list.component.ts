import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, StatusEvent } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { Address } from '../../../models/address.model';
import { Member } from '../../../models/member.model';
import { MemberService } from '../../../services/member.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  @Input() groupId: string | null = null;
  events: Event[] | null = null;
  admins: Member[] | null = null;
  authMember: Member | null = null;

  constructor(private eventService: EventService, private memberService:MemberService, private authService:AuthService) { }
  ngOnInit(): void {
    if (this.groupId) {
      this.eventService.getEventsByGroup(this.groupId).subscribe((events: Event[]) => {
        this.events = events;
      });
      this.memberService.getAdminByGroup(this.groupId).subscribe((admins: Member[]) => {
        this.admins = admins;
      });
      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        this.authMember = member;
      });
  }
}

getStatusClass(status: string): string {
  switch (status) {
    case 'ONGOING':
      return 'bg-success';
    case 'SCHEDULED':
      return 'bg-warning text-dark';
    case 'FINISHED':
      return 'bg-secondary';
    default:
      return 'bg-light text-dark';
  }
}

isAdmin(userId: string): boolean {
  return this.admins?.some(admin => admin.id === userId) ?? false;
}

isAuthUserAdmin(){
  if (this.authMember) {
    return this.isAdmin(this.authMember.userAccountId);
  } else {
    return false;
  }
}

}
