export class UserEvent {
  id: string;
  userId: string;
  eventId: string;
  isCreator: boolean;

  constructor(
    id: string,
    userId: string,
    eventId: string,
    isCreator: boolean
  ) {
    this.id = id;
    this.userId = userId;
    this.eventId = eventId;
    this.isCreator = isCreator;
  }

  static fromJson(raw: any): UserEvent {
        return new UserEvent(
            raw.id,
            raw.userId,
            raw.eventId,
            raw.isCreator,
        );
    }
}