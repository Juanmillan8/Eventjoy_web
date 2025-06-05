import { Address } from "./address.model";

export class Event {
    id:string;
    title: string;
    startDateAndTime: string;
    endDateAndTime: string;
    description: string;
    maxParticipants: string;
    address: Address;
    status: string;
    groupId: string;

 constructor(id:string, title: string, startDateAndTime: string, endDateAndTime: string, description: string, maxParticipants: string, address: Address, status: string, groupId: string ) {
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