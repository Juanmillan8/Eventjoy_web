import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventListComponent } from '../../components/event/event-list/event-list.component';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-showprofile',
  standalone: true,
  imports: [CommonModule, EventListComponent],
  templateUrl: './showprofile.component.html',
  styleUrl: './showprofile.component.css'
})
export class ShowprofileComponent implements OnInit{

  userId:string|null=null;
  member:Member|null=null;
  
  constructor(private route: ActivatedRoute, private memberService:MemberService){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId'); // o el nombre que uses en la ruta
      if(this.userId){
        this.memberService.getMemberByUid(this.userId).subscribe((member:Member)=>{
          this.member = member;
        });
      }
    });
  }
}
