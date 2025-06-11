import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  authMember:Member|null=null;

  constructor(private authService:AuthService){}
  
  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({member,user})=>{
      this.authMember = member;
    })
  }

  
}
