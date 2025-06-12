import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../../models/member.model';
import { Event, StatusEvent } from '../../../models/event.model';

import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group.model';
import { max } from 'rxjs';
import { MemberService } from '../../../services/member.service';
import { Address } from '../../../models/address.model';
import { UserEvent } from '../../../models/userevent.model';
import { UserEventService } from '../../../services/userevent.service';
import { EventValidation } from '../../validations/event.validation';

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
  admins: Member[] | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder, private eventService: EventService, private groupService: GroupService, private memberService: MemberService, private userEventService: UserEventService) {
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
    },
      {
        validators: [
          EventValidation.endDateAfterStartDate()
        ]
      }
    );
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventid'); // o el nombre que uses en la ruta
      this.groupId = params.get('groupid'); // o el nombre que uses en la ruta
      this.errores = null;
      this.mensajes = null;

      let isEdit = this.eventId && this.eventId != "-1" ? true : false;
      this.eventForm.setValidators([
        EventValidation.startDateNotInPast(isEdit),
        EventValidation.endDateAfterStartDate()
      ]);
      this.eventForm.updateValueAndValidity();


      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        if (user && member) {
          this.memberAuth = member;
        }

        //Si no se indica un grupo se muestra un error
        if (this.groupId && this.groupId != "-1") {
          this.memberService.getAdminByGroup(this.groupId).subscribe((admins: Member[]) => {
            this.admins = admins;


            if (this.isAuthUserAdmin()) {
              if (this.eventId) {
                if (this.eventId != "-1") {
                  this.eventService.getEventsById(this.eventId).subscribe((event: Event | null) => {
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
                  });
                }
              }
            } else {
              this.errores = "The authenticated user does not have privileges to create an event in the specified group."
            }
          });
        } else {
          this.errores = "The identifier of an event must be specified."
        }
      });
    });
  }


  cancelEdit() {
    this.router.navigate([`/viewgroup/` + this.groupId]);
  }
  save() {

    this.errores = null;
    this.mensajes = null;

    let title = this.eventForm.get("title")?.value;
    let description = this.eventForm.get("description")?.value;
    let startDateAndTime = this.eventForm.get("startDateAndTime")?.value;
    let endDateAndTime = this.eventForm.get("endDateAndTime")?.value;
    let maxParticipants = this.eventForm.get("maxParticipants")?.value;
    let street = this.eventForm.get("street")?.value;
    let numberStreet = this.eventForm.get("numberStreet")?.value;
    let floor = this.eventForm.get("floor")?.value;
    let door = this.eventForm.get("door")?.value;
    let postalCode = this.eventForm.get("postalCode")?.value;
    let city = this.eventForm.get("city")?.value;
    let municipality = this.eventForm.get("municipality")?.value;
    let province = this.eventForm.get("province")?.value;


    let isValidForm = this.eventForm.valid;

    //Edición de un grupo existente
    if (this.isAuthUserAdmin()) {
      if (isValidForm) {
        if (this.event) {
          this.event.title = title;
          this.event.description = description;
          this.event.startDateAndTime = startDateAndTime;
          this.event.endDateAndTime = endDateAndTime;
          this.event.maxParticipants = maxParticipants;
          this.event.address.street = street;
          this.event.address.numberStreet = numberStreet;
          this.event.address.floor = floor;
          this.event.address.door = door;
          this.event.address.postalCode = postalCode;
          this.event.address.city = city;
          this.event.address.municipality = municipality;
          this.event.address.province = province;


          this.eventService.editEvent(this.event).then(() => {
            this.mensajes = "Event information successfully updated."
            this.router.navigate([`/viewgroup/` + this.groupId]);

          }).catch(() => {
            this.errores = "Error updating event information"
          });
        } else if (this.eventId == "-1" && this.memberAuth && this.groupId) {


          let newAddress = new Address(street, numberStreet, floor, door, postalCode, city, province, municipality);
          let newEvent = new Event("-1", title, startDateAndTime, endDateAndTime, description, maxParticipants, newAddress, StatusEvent.ONGOING, this.groupId);
          newEvent.status = newEvent.computedStatus;


          this.eventService.createEvent(newEvent).then((event) => {
            if (event && this.memberAuth) {
              let userEvent = new UserEvent("-1", this.memberAuth.id, event.id);
              this.userEventService.createUserEvent(userEvent).then(() => {
                this.router.navigate([`/viewgroup/` + this.groupId]);
              }).catch(error => {
                this.errores = "Error creating the event."
              });
            }
          }).catch(error => {
            this.errores = "Error creating the event."
          });

        }
      } else {
        this.errores = "The form has validation errors."
      }

    } else {
      this.errores = "The authenticated user does not have privileges to edit the event."
    }

  }

  delete() {
    this.errores = null;
    this.mensajes = null;
    if (this.isAuthUserAdmin()) {
      if (this.event) {
        this.eventService.deleteEvent(this.event).then(() => {
          this.errores = null;
          this.mensajes = null;
          this.existEvent = true;
          this.router.navigate([`/viewgroup/` + this.groupId]);
        }).catch(error => {
          console.log(error)
          this.errores = "Error al borrar el grupo."
        });
      }
    } else {
      this.errores = "The authenticated user does not have privileges to edit the event."
    }

  }
  isAdmin(userId: string): boolean {
    return this.admins?.some(admin => admin.id === userId) ?? false;
  }

  isAuthUserAdmin() {
    if (this.memberAuth) {
      return this.isAdmin(this.memberAuth.userAccountId);
    } else {
      return false;
    }
  }
}
