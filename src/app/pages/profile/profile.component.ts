import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DataSnapshot } from '@angular/fire/database';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit{
  profileForm: FormGroup;

  currentMember:Member | null = null;
  isEdit: boolean = false;
  errores: string | null = null;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private memberService: MemberService) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      birthdate: ['',Validators.required],
    });
    this.toggleFormControls();

  }

  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({user,member})=>{
      this.currentMember= member;
      this.profileForm.setValue({
        'name':  member?.name,
        'surname':  member?.surname,
        'email':  member?.email,
        'dni':  member?.dni,
        'phone':  member?.phone,
        'birthdate':  member?.birthdate,
      });
    })
  }

  guardarCambios(){
    
    let name = this.profileForm.get("name")?.value;
    let surname = this.profileForm.get("surname")?.value;
    let email = this.profileForm.get("email")?.value;
    let dni = this.profileForm.get("dni")?.value;
    let phone = this.profileForm.get("phone")?.value;
    let birthdate = this.profileForm.get("birthdate")?.value;

    

    let isValidForm = this.profileForm.valid;

    
    if(isValidForm && this.currentMember){

      this.currentMember.name= name;
      this.currentMember.surname= surname;
      this.currentMember.email= email;
      this.currentMember.dni= dni;
      this.currentMember.phone= phone;
      this.currentMember.birthdate= birthdate;

      this.memberService.saveMember(this.currentMember).then(()=>{
        this.isEdit=false;
      }).catch(error=>{
        this.errores = "Error al actualizar la información del usuario"
      });
    }
  }

  toggleFormControls() {
    if (this.isEdit) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }
  toggleEditMode() {
    this.isEdit = !this.isEdit;
    this.toggleFormControls();
  }

}
