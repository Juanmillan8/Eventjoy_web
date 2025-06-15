import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../../models/member.model';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import { MemberValidation } from '../../../validations/member.validation';
import { EventValidation } from '../../../validations/event.validation';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;

  currentMember: Member | null = null;
  errores: string | null = null;
    toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  toastTimeout: any = null;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private memberService: MemberService, private router: Router) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      birthdate: ['', [Validators.required, MemberValidation.minimumAge(12)]],
    });
  }

  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.currentMember = member;
      this.profileForm.setValue({
        'name': member?.name,
        'surname': member?.surname,
        'username': member?.username,
        'dni': member?.dni,
        'phone': member?.phone,
        'birthdate': member?.birthdate,
      });
    })
  }

  guardarCambios() {
    this.errores = null;

    let name = this.profileForm.get("name")?.value;
    let surname = this.profileForm.get("surname")?.value;
    let username = this.profileForm.get("username")?.value;
    let dni = this.profileForm.get("dni")?.value;
    let phone = this.profileForm.get("phone")?.value;
    let birthdate = this.profileForm.get("birthdate")?.value;



    let isValidForm = this.profileForm.valid;


    if (isValidForm && this.currentMember) {

      this.currentMember.name = name;
      this.currentMember.surname = surname;
      this.currentMember.dni = dni;
      this.currentMember.phone = phone;
      this.currentMember.birthdate = birthdate;

        if (this.currentMember && this.currentMember.username.trim() != username.trim()) {
          firstValueFrom(this.memberService.getMemberByUsername(username)).then((memberFind: Member[]) => {
            if (memberFind && memberFind.length == 0 && this.currentMember) {
                this.currentMember.username = username;
                this.showToast("Information updated successfully","success")
                this.saveMember();
            } else {
               this.showToast("Already exist a member with the same username.","danger")
            }
          });
        } else {                
          this.showToast("Information updated successfully","success")

          this.saveMember();
        }
    } else {
        this.showToast("The form has validation errors.","danger")
    }
  }

  saveMember() {
    if (this.currentMember) {
      this.memberService.saveMember(this.currentMember).then(() => {
        this.router.navigate(["/showprofile", this.currentMember?.userAccountId])
      }).catch(() => {
        this.showToast("Error updating member information.","danger")
      });
    }
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
