import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, StatusEvent } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { Address } from '../../../models/address.model';
import { Member } from '../../../models/member.model';
import { MemberService } from '../../../services/member.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { UserEventService } from '../../../services/userevent.service';
import { UserEvent } from '../../../models/userevent.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  @Input() groupId: string | null = null;
  events: Event[] | null = null;
  admins: Member[] | null = null;
  authMember: Member | null = null;
  userEventsMemberAuth: UserEvent[] | null = null;
  eventsWithUserEvents: { event: Event; users: UserEvent[] }[] | null = null;
  allUserEvents: UserEvent[] = [];



  constructor(private eventService: EventService, private memberService: MemberService, private authService: AuthService, private userEventService: UserEventService) { }
  ngOnInit(): void {

    if (this.groupId) {
      this.eventService.loadEventsWithUsersByGroup(this.groupId).subscribe(data => {
        this.eventsWithUserEvents = data;
        // Opcionalmente, extraer solo los eventos para un uso más simple
        this.events = data.map(item => item.event);
        this.allUserEvents = data.flatMap(item => item.users);

      });
      this.memberService.getAdminByGroup(this.groupId).subscribe((admins: Member[]) => {
        this.admins = admins;
      });
      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        this.authMember = member;
        if (this.authMember) {
          this.userEventService.getByUser(this.authMember.id).subscribe((userEvent: UserEvent[]) => {
            this.userEventsMemberAuth = userEvent;
          })
        }
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

  isAuthUserAdmin() {
    if (this.authMember) {
      return this.isAdmin(this.authMember.userAccountId);
    } else {
      return false;
    }
  }

  isJoined(eventId: string) {
    if (this.allUserEvents && this.authMember) {
      return this.allUserEvents.some(ue => ue.eventId == eventId && ue.userId == this.authMember?.id);
    }else{
      return false;
    }
  }

  leaveEvent(eventId: string) {
    if(this.isJoined(eventId)){
      let userEvent = this.allUserEvents.find(ue => ue.eventId == eventId && ue.userId == this.authMember?.id);
      if(userEvent){
        this.userEventService.deleteUserEvent(userEvent);
      }

    }
  }
  joinEvent(eventId: string) {
    if(this.authMember){
      let userEvent = new UserEvent("-1",this.authMember.id,eventId,false,false);
      this.userEventService.createUserEvent(userEvent);
    }
  }

  numberOfParticipants(eventId: string): Number {
    if (!this.eventsWithUserEvents) return 0;

    const eventEntry = this.eventsWithUserEvents.find(e => e.event.id === eventId);
    if (!eventEntry) return 0;

    return eventEntry.users.length;
  }

  isComplete(event:Event){
    return !(this.numberOfParticipants(event.id) < event.maxParticipants);
  }
}
