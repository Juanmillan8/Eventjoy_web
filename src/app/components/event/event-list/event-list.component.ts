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
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  @Input() groupId: string | null = null;
  events: Event[] | null = null;
  admins: Member[] | null = null;
  authMember: Member | null = null;
  userEventsMemberAuth: UserEvent[] = [];
  eventsWithUserEvents: { event: Event; users: UserEvent[] }[] | null = null;
  allUserEvents: UserEvent[] = [];
  filterTerm: string = '';
  myAdminGroups: Group[] = [];



  constructor(private eventService: EventService, private memberService: MemberService, private authService: AuthService, private userEventService: UserEventService, private groupService: GroupService) { }
  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.authMember = member;

      if (this.authMember != null && this.authMember != undefined) {
        this.groupService.getGroupsByAdminStatus(this.authMember.id).subscribe(({ adminGroups, memberGroups }) => {
          this.myAdminGroups = adminGroups;
        });

        this.userEventService.getByUser(this.authMember.id).subscribe((userEvent: UserEvent[]) => {
          this.userEventsMemberAuth = userEvent;
        });

        if (this.groupId) {
          this.eventService.loadEventsWithUsersByGroup(this.groupId).subscribe(data => {
            this.eventsWithUserEvents = data;
            // Opcionalmente, extraer solo los eventos para un uso más simple
            this.events = data.map(item => item.event);
            this.allUserEvents = data.flatMap(item => item.users);
          });
        } else {
          if (this.authMember) {
            this.eventService.getEventsByUser(this.authMember.id).subscribe((events: Event[]) => {
              this.events = events;
            });
            this.userEventService.getAll().subscribe((events: UserEvent[]) => {
              this.allUserEvents = events;
            });
          }

        }
      }
    });
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

  isAuthMemberAdmin(event:Event) {

    return this.myAdminGroups.some((ag)=>{return ag.id == event.groupId});
  }

  isAuthMemberAdminOfGroup(){
    if(this.groupId){
      return this.myAdminGroups.some((ag)=>{return ag.id == this.groupId});
    }
    return false;
  }

  isJoined(eventId: string) {
    if (this.allUserEvents && this.authMember) {
      return this.allUserEvents.some(ue => ue.eventId == eventId && ue.userId == this.authMember?.id);
    } else {
      return false;
    }
  }

  leaveEvent(eventId: string) {
    if (this.isJoined(eventId)) {
      let userEvent = this.allUserEvents.find(ue => ue.eventId == eventId && ue.userId == this.authMember?.id);
      if (userEvent) {
        this.userEventService.deleteUserEvent(userEvent);
      }

    }
  }
  joinEvent(eventId: string) {
    if (this.authMember) {
      let userEvent = new UserEvent("-1", this.authMember.id, eventId, false, false);
      this.userEventService.createUserEvent(userEvent);
    }
  }

  numberOfParticipants(eventId: string): Number {

    return this.allUserEvents.filter(ue => ue.eventId === eventId).length;
  }

  isComplete(event: Event) {
    return !(this.numberOfParticipants(event.id) < event.maxParticipants);
  }

  /** Devuelve solo los eventos cuyo título incluya el texto de filtro */
  get filteredEvents(): Event[] {
    const term = this.filterTerm.trim().toLowerCase();
    if (!this.events) {
      return [];
    }

    return this.events.filter(e => {
      // Construimos un string con todas las propiedades relevantes
      const haystack = [
        e.title,
        e.description,
        e.startDateAndTime,
        e.endDateAndTime,
        e.maxParticipants.toString(),
        e.fullAddress,
        e.computedStatus
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }
}
