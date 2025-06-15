import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { Person, ROLE } from '../../../models/person.model';
import { UserCredential } from '@angular/fire/auth';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../../models/member.model';
import { firstValueFrom } from 'rxjs';
import { MemberValidation } from '../../../validations/member.validation';

@Component({
  selector: 'app-singin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent {

  registerForm: FormGroup;
  error: String | null = null;
  constructor(formBuilder: FormBuilder, private authService: AuthService, private router: Router, private memberService: MemberService) {
    this.registerForm = formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      birthdate: ['', [Validators.required, MemberValidation.minimumAge(12)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  register() {
    this.error = ""
    if (this.registerForm.valid) {
    let name = this.registerForm.get("name")?.value;
    let surname = this.registerForm.get("surname")?.value;
    let username = this.registerForm.get("username")?.value;
    let email = this.registerForm.get("email")?.value;

    let dni = this.registerForm.get("dni")?.value;
    let phone = this.registerForm.get("phone")?.value;
    let birthdate = this.registerForm.get("birthdate")?.value;
    let password = this.registerForm.get("password")?.value;


      //Comprobamos si existe un usuario con el mismo email
      firstValueFrom(this.memberService.getMemberByUsername(username)).then((memberFind: Member[]) => {
        if (memberFind && memberFind.length ==0) {
          this.authService.register({ email, password }).then((userCredential: UserCredential) => {
            let member = new Member(userCredential.user.uid, userCredential.user.uid, name, surname, email, ROLE.MEMBER,"",dni,phone,birthdate,username, 0, "EMAIL");
            this.memberService.saveMember(member).then(() => {
              this.router.navigate(["/home"]);
            })
          }).catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              this.error = 'Email already exist.';
            } else {
              this.error = 'Error register.';
            }
          });
        } else {
          this.error = 'Already exist a member with the same username.';
        }
      })



    }
  }

}
