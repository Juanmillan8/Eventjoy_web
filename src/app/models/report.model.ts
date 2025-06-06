
  export enum ReportReason {
    OFFENSIVE_LANGUAGE = "OFFENSIVE_LANGUAGE",
    SPAM= "SPAM",
    HARASSMENT= "HARASSMENT",
    VIOLENCE= "VIOLENCE",
    UNFAIR_PLAY= "UNFAIR_PLAY",
    OTHER= "OTHER"
  }

  export enum  ReportStatus {
    PENDING= "PENDING",
    APPROVED= "APPROVED",
    REJECTED= "REJECTED"
  }

export class Report {

  id: string;
  reportReason: ReportReason;
  reportDescription: string;
  reportedUserId: string;
  reporterUserId: string;
  groupId: string;
  reportedAt: string;
  reportStatus: ReportStatus;

 constructor(
    id: string,
    reportReason: ReportReason,
    reportDescription: string,
    reportedUserId: string,
    reporterUserId: string,
    groupId: string,
    reportedAt: string,
    reportStatus: ReportStatus
  ) {
    this.id = id;
    this.reportReason = reportReason;
    this.reportDescription = reportDescription;
    this.reportedUserId = reportedUserId;
    this.reporterUserId = reporterUserId;
    this.groupId = groupId;
    this.reportedAt = reportedAt;
    this.reportStatus = reportStatus;
  }
}