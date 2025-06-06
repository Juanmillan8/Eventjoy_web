import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../../models/member.model';
import { Event } from '../../../models/event.model';

import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  event: Event | null = null;
  eventForm: FormGroup;
  eventId: string | null = null;
  groupId: string | null = null;
  errores: string | null = null;
  mensajes: string | null = null;
  existEvent: boolean = true;
  memberAuth: Member | null = null;
  groupAdminList: Group[] | null = null;
  groupNOAdminList: Group[] | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder, private eventService: EventService, private groupService: GroupService) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDateAndTime: ['', [Validators.required]],
      endDateAndTime: ['', Validators.required],
      maxParticipants: ['', [Validators.required]],
      street: ['', Validators.required],
      numberStreet: ['', [Validators.required]],
      floor: ['', Validators.required],
      door: ['', Validators.required],
      postalCode: ['', [Validators.required]],
      city: ['', Validators.required],
      municipality: ['', Validators.required],
      province: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventid'); // o el nombre que uses en la ruta
      this.groupId = params.get('groupid'); // o el nombre que uses en la ruta

      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        if (user && member) {
          this.memberAuth = member;
          this.groupService.getGroupsByAdminStatus(member.userAccountId).subscribe(({ adminGroups, memberGroups }) => {
            this.groupAdminList = adminGroups;
            this.groupNOAdminList = memberGroups;
          });
        }
      });

      if (this.eventId && this.eventId != "-1") {
        this.eventService.getEventsById(this.eventId).subscribe((event: Event) => {
          if (event) {
            this.event = event;
            this.eventForm.setValue({
              title: this.event.title,
              description: this.event.description,
              startDateAndTime: this.event.startDateForm,
              endDateAndTime: this.event.endDateForm,
              maxParticipants: this.event.maxParticipants,
              street: this.event.address.street,
              numberStreet: this.event.address.numberStreet,
              floor: this.event.address.floor,
              door: this.event.address.door,
              postalCode: this.event.address.postalCode,
              city: this.event.address.city,
              municipality: this.event.address.municipality,
              province: this.event.address.province,
            });
          }
        })
      }
    });
  }
  cancelEdit() { }
  save() { }
  delete() { }
}
