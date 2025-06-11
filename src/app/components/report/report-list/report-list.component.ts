import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Member } from '../../../models/member.model';
import { AuthService } from '../../../services/auth.service';
import { Report, ReportStatus } from '../../../models/report.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent implements OnInit, OnChanges {

  @Input() userId: string | null = null;
  @Input() view: string | null = null;

  reportsList: { report: Report; user: Member }[] | null = null;

  authMember: Member | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  toastTimeout: any = null;
  toastMessage: string | null = null;

  constructor(private reportService: ReportService, private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.authMember = member;
    })
    this.loadList();
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
    if (this.view == 'ADMIN') {
      this.reportService.getAllReports().subscribe((list) => {
        this.reportsList = list;
        console.log(this.reportsList)
      });
    }
  }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info', duration: number = 3000): void {
    this.toastMessage = message;
    this.toastType = type;

    // Limpiar timeout anterior si existe
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Autocierre tras x milisegundos
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, duration);
  }

  closeToast(): void {
    this.toastMessage = null;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  aprove(report: Report) {
    report.reportStatus = ReportStatus.APPROVED;

    this.reportService.save(report).then(() => {
      this.showToast("Report accepted successfully", "success");
    }).catch(() => {
      this.showToast("Error saving report", "danger");
    });

  }
  reject(report: Report) {

    report.reportStatus = ReportStatus.REJECTED;

    this.reportService.save(report).then(() => {
      this.showToast("Report reject successfully", "success");
    }).catch(() => {
      this.showToast("Error saving report", "danger");
    });

  }

}
