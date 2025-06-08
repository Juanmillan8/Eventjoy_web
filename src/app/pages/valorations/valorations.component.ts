import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';
import { ValorationListComponent } from '../../components/valoration/valoration-list/valoration-list.component';
import { EventListComponent } from '../../components/event/event-list/event-list.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-valorations',
  standalone: true,
  imports: [CommonModule, ValorationListComponent],
  templateUrl: './valorations.component.html',
  styleUrl: './valorations.component.css'
})
export class ValorationsComponent implements OnInit{

  memberAuth:Member|null=null;
  
  constructor(private route: ActivatedRoute, private authService:AuthService){}
  
  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({user,member})=>{
      this.memberAuth = member;
    });
  }
}
