import { Address } from "./address.model";

export enum StatusEvent{
    ONGOIN="ONGOING",
    FINISHED="FINISHED",
    SHEDULED="SHEDULED"
}
export class Event {
    id:string;
    title: string;
    startDateAndTime: string;
    endDateAndTime: string;
    description: string;
    maxParticipants: Number;
    address: Address;
    status: StatusEvent;
    groupId: string;

 constructor(id:string, title: string, startDateAndTime: string, endDateAndTime: string, description: string, maxParticipants: Number, address: Address, status: StatusEvent, groupId: string ) {
        this.id = id;
        this.title = title;
        this.startDateAndTime = startDateAndTime;
        this.endDateAndTime = endDateAndTime;
        this.description = description;
        this.maxParticipants = maxParticipants;
        this.address = address;
        this.status = status;
        this.groupId = groupId;
    }

}