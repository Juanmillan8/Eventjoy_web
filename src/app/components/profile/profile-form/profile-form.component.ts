import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../../models/member.model';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import { MemberValidation } from '../../../validations/member.validation';
import { EventValidation } from '../../../validations/event.validation';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent implements OnInit{
  profileForm: FormGroup;

  currentMember:Member | null = null;
  errores: string | null = null;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private memberService: MemberService, private router: Router) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      birthdate: ['',[Validators.required,MemberValidation.minimumAge(12)]],
    });
  }

  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({user,member})=>{
      this.currentMember= member;
      this.profileForm.setValue({
        'name':  member?.name,
        'surname':  member?.surname,
        'dni':  member?.dni,
        'phone':  member?.phone,
        'birthdate':  member?.birthdate,
      });
    })
  }

  guardarCambios(){
    this.errores = null;

    let name = this.profileForm.get("name")?.value;
    let surname = this.profileForm.get("surname")?.value;
    let dni = this.profileForm.get("dni")?.value;
    let phone = this.profileForm.get("phone")?.value;
    let birthdate = this.profileForm.get("birthdate")?.value;

    

    let isValidForm = this.profileForm.valid;

    
    if(isValidForm && this.currentMember){

      this.currentMember.name= name;
      this.currentMember.surname= surname;
      this.currentMember.dni= dni;
      this.currentMember.phone= phone;
      this.currentMember.birthdate= birthdate;

      this.memberService.saveMember(this.currentMember).then(()=>{
        this.router.navigate(["/showprofile",this.currentMember?.userAccountId])
      }).catch(()=>{
        this.errores = "Error updating member information."
      });
    }else{
      this.errores = "The form has validation errors."
    }
  }


}
