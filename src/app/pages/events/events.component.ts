import { Component, OnInit } from '@angular/core';
import { EventListComponent } from '../../components/event/event-list/event-list.component';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventListComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{
  authMember:Member|null = null;
  
  constructor(private authService:AuthService){}
  ngOnInit(): void {

      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        this.authMember = member;
      });
  }

  
}
