export class Invitation {
  id: string;
  invitedUserId: string;
  inviterUserId: string;
  groupId: string;
  invitedAt: string;

  
  constructor(
    id: string,
    invitedUserId: string,
    inviterUserId: string,
    groupId: string,
    invitedAt: string
  ) {
    this.id = id;
    this.invitedUserId = invitedUserId;
    this.inviterUserId = inviterUserId;
    this.groupId = groupId;
    this.invitedAt = invitedAt;
  }

}