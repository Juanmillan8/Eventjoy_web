import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventListComponent } from '../../components/event/event-list/event-list.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';
import { ValorationListComponent } from "../../components/valoration/valoration-list/valoration-list.component";
import { AuthService } from '../../services/auth.service';
import { ReportListComponent } from '../../components/report/report-list/report-list.component';

@Component({
  selector: 'app-showprofile',
  standalone: true,
  imports: [CommonModule, EventListComponent, ValorationListComponent,RouterLink,ReportListComponent],
  templateUrl: './showprofile.component.html',
  styleUrl: './showprofile.component.css'
})
export class ShowprofileComponent implements OnInit{

  userId:string|null=null;
  member:Member|null=null;
  authMember:Member|null = null;

  constructor(private route: ActivatedRoute, private memberService:MemberService, private authService:AuthService){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId'); // o el nombre que uses en la ruta
      if(this.userId){
        this.memberService.getMemberByUid(this.userId).subscribe((member:Member)=>{
          this.member = member;
        });
        this.authService.getUserDataAuth().subscribe(({user,member})=>{
          this.authMember = member;
        })
      }
    });
  }
}
