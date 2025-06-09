import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { Person } from '../../models/person.model';
import { DataSnapshot } from '@angular/fire/database';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private authService:AuthService, private router:Router, private personService:MemberService){}

  isLoggedIn: boolean = false;
  role:string|null=null;
  member:Member|null = null;
  
  ngOnInit(): void {
    
    this.authService.getUserDataAuth().subscribe(({user,member})=>{
      if(user){
        this.isLoggedIn = true;
        if(member && member.role){
          this.role = member.role;
          this.member = member;
        }
      }else{
        this.isLoggedIn = false;
      }
    })
  }

  logout(){
    this.authService.logout().then(()=>{
      this.router.navigate(["/"]);
    }).catch((error)=>{console.log(error)});;
  }
}
