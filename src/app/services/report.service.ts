import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set } from '@angular/fire/database';
import { combineLatest, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { MemberService } from './member.service';

import { Valoration } from '../models/valoration.model';
import { Report, ReportStatus } from '../models/report.model';
import { Member } from '../models/member.model';



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

  getReceivedReportWithRaters(uid: string): Observable<{ report: Report; user: Member }[]> {
      // 1) Primero recuperamos las valoraciones hechas por uid
      const reportRef = ref(this.database, this.COLLECTION_NAME);
      const reportQuery = query(
        reportRef,
        orderByChild('reportedUserId'),
        equalTo(uid)
      );
  
      return listVal(reportQuery).pipe(
        switchMap(rawVals => {
          const vals: Report[] = rawVals
            ? rawVals.map(v => Report.fromJson(v))
            : [];
  
          if (vals.length === 0) {
            return of([]);
          }
  
          const observables = vals.map(val =>
            this.memberService.getMemberByUid(val.reporterUserId).pipe(
              map((m: Member) => ({
                report: val,
                user: m
              }))
            )
          );
  
          // 3) Combinamos todos con combineLatest para obtener un array con resultados
          return combineLatest(observables);
        })
      );
    }
  
     getMadedReportWithRaters(uid: string): Observable<{ report: Report; user: Member }[]> {
      // 1) Primero recuperamos las valoraciones hechas por uid
      const reportRef = ref(this.database, this.COLLECTION_NAME);
      const reportQuery = query(
        reportRef,
        orderByChild('reporterUserId'),
        equalTo(uid)
      );
  
      return listVal(reportQuery).pipe(
        switchMap(rawVals => {
          const vals: Report[] = rawVals
            ? rawVals.map(v => Report.fromJson(v))
            : [];
  
          // Si no hay ninguna valoración, devolvemos array vacío
          if (vals.length === 0) {
            return of([]);
          }
  
          // 2) Para cada valoracion, creamos un Observable que devuelve { valoration, rater }
          const observables = vals.map(val =>
            this.memberService.getMemberByUid(val.reportedUserId).pipe(
              map((m: Member) => ({
                report: val,
                user: m
              }))
            )
          );
  
          // 3) Combinamos todos con combineLatest para obtener un array con resultados
          return combineLatest(observables);
        })
      );
    }
}
