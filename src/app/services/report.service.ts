import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { combineLatest, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { MemberService } from './member.service';

import { Valoration } from '../models/valoration.model';
import { Report, ReportStatus } from '../models/report.model';



@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private COLLECTION_NAME = "reports"


  constructor(private database: Database, private memberService: MemberService) { }


  existReportsToUserPending(userIdReported: string, userIdReporter: string, groupId: string) {
    const reportRef = ref(this.database, this.COLLECTION_NAME);
    const reportQuery = query(
      reportRef,
      orderByChild('reporterUserId'),
      equalTo(userIdReporter)
    );

    return get(reportQuery).then(snapshot => {
      if (!snapshot.exists()) return false;

      const values = Object.values(snapshot.val());

      const pendingReports = values.filter((report: any) =>
        report.reportedUserId === userIdReported &&
        report.groupId === groupId &&
        report.reportStatus === ReportStatus.PENDING
      );

      return pendingReports.length > 0;
    }).catch(err => {
      console.error('Error checking reports:', err);
      return false;
    });
  }

    save(report: Report) {
    //Creamos la referencia de la persona que deseamos guardar en firebase database
    let reportRef = ref(this.database, `/${this.COLLECTION_NAME}/${report.id}`);

    if (report.id == "-1") {
      let newReportRef = ref(this.database, this.COLLECTION_NAME);
      let idRandom = push(newReportRef);

      //Modificamos el id, que es 0, a un id random
      reportRef = idRandom;
      if (reportRef.key != null) {
        report.id = reportRef.key;
      }
    }
    //Crear nueva reserva
    return set(reportRef, report) as Promise<void>
  }
}
