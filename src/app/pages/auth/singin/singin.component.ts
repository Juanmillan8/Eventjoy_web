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

@Component({
  selector: 'app-singin',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule,HeaderComponent,FooterComponent],
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent {

  registerForm:FormGroup;
  error:String|null = null;
  constructor(formBuilder:FormBuilder,private authService:AuthService, private router:Router, private memberService:MemberService){
    this.registerForm = formBuilder.group({
      'name': ['', [Validators.required]],
      'surname': ['', [Validators.required]],
      'admin': ['', []],
      'email': ['', [Validators.email]],
      'password': ['', [Validators.required]]
    });
  }
  register() {
    this.error=""
    if (this.registerForm.valid) {
      let name = this.registerForm.get("name")?.value;
      let surname = this.registerForm.get("surname")?.value;
      let admin = this.registerForm.get("admin")?.value;
      let email = this.registerForm.get("email")?.value;
      let password = this.registerForm.get("password")?.value;

      //Comprobamos si existe un usuario con el mismo email
      firstValueFrom(this.memberService.getMemberByEmail(email)).then((member) => {
        if (member && member.length ==0) {
          this.authService.register({ email, password }).then((userCredential: UserCredential) => {

            let member = new Member(userCredential.user.uid,userCredential.user.uid, name, surname, email, ROLE.MEMBER, "", "", "", "", "",0, "EMAIL");

            if (admin == "true") {
              member.role = ROLE.ADMIN
            }
            this.memberService.saveMember(member).then(() => {
              this.router.navigate(["/home"]);

            })
          }).catch(error => {
            console.log(error)
          });
        }else{
          this.error ="Ya existe un usuario con el mismo email."
        }
      })
    }
  }

}
