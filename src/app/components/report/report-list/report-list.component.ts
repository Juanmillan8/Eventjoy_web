import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Member } from '../../../models/member.model';
import { AuthService } from '../../../services/auth.service';
import { Report } from '../../../models/report.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent implements OnInit, OnChanges {

  @Input() userId: string | null = null;
  @Input() view: string | null = null;
  
  reportsList: { report: Report; user: Member }[] | null = null;

  authMember: Member | null = null;


  constructor(private reportService: ReportService, private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.authMember = member;
    })

    if (this.userId && this.view) {
      this.loadList();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // si cambia userId **o** view, recargamos
    if ((changes['userId'] || changes['view']) && this.userId && this.view) {
      this.loadList();
    }
  }

  private loadList() {

    if (this.userId && this.view) {
      if (this.view === 'MADED') {
        this.reportService
          .getMadedReportWithRaters(this.userId)
          .subscribe((list) => {
            this.reportsList = list
            console.log(this.reportsList)
          });
      } else if (this.view === 'RECEIVED') {
        this.reportService
          .getReceivedReportWithRaters(this.userId)
                   .subscribe((list) => {
            this.reportsList = list
            console.log(this.reportsList)
          });
      }
    }
  }
}
