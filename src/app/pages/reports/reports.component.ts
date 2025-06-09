import { Component, OnInit } from '@angular/core';
import { ReportListComponent } from '../../components/report/report-list/report-list.component';
import { Member } from '../../models/member.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReportListComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{

  memberAuth:Member|null=null;
  
  constructor(private route: ActivatedRoute, private authService:AuthService){}
  
  ngOnInit(): void {
    this.authService.getUserDataAuth().subscribe(({user,member})=>{
      this.memberAuth = member;
    });
  }
}
