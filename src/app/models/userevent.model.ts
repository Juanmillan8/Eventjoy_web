export class UserEvent {
  id: string;
  userId: string;
  eventId: string;
  isCreator: boolean;
  notificationsEnabled: boolean;

  constructor(
    id: string,
    userId: string,
    eventId: string,
    isCreator: boolean,
    notificationsEnabled: boolean
  ) {
    this.id = id;
    this.userId = userId;
    this.eventId = eventId;
    this.isCreator = isCreator;
    this.notificationsEnabled = notificationsEnabled;
  }

  static fromJson(raw: any): UserEvent {
        return new UserEvent(
            raw.id,
            raw.userId,
            raw.eventId,
            raw.isCreator,
            raw.notificationsEnabled
        );
    }
}