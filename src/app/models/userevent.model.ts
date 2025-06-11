export class UserEvent {
  id: string;
  userId: string;
  eventId: string;

  constructor(
    id: string,
    userId: string,
    eventId: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.eventId = eventId;
  }

  static fromJson(raw: any): UserEvent {
        return new UserEvent(
            raw.id,
            raw.userId,
            raw.eventId
        );
    }
}