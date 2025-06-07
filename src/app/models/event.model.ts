import { Address } from "./address.model";

export enum StatusEvent {
    ONGOING = "ONGOING",
    FINISHED = "FINISHED",
    SCHEDULED = "SCHEDULED"
}
export class Event {
    id: string;
    title: string;
    startDateAndTime: string;
    endDateAndTime: string;
    description: string;
    maxParticipants: Number;
    address: Address;
    status: StatusEvent;
    groupId: string;

    constructor(id: string, title: string, startDateAndTime: string, endDateAndTime: string, description: string, maxParticipants: Number, address: Address, status: StatusEvent, groupId: string) {
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
    get computedStatus(): StatusEvent {
        const now = new Date();
        const start = new Date(this.startDateAndTime);
        const end = new Date(this.endDateAndTime);

        if (now < start) {
            return StatusEvent.SCHEDULED;
        } else if (now >= start && now <= end) {
            return StatusEvent.ONGOING;
        } else {
            return StatusEvent.FINISHED;
        }
    }
    get fullAddress(): string {
        return `${this.address.street}, ${this.address.numberStreet}${this.address.floor ? ', Floor ' + this.address.floor : ''}${this.address.door ? ', Door ' + this.address.door : ''}, ${this.address.postalCode} ${this.address.city}, ${this.address.municipality} (${this.address.province})`;
    }

    static fromJson(raw: any): Event {
        const address = new Address(
            raw.address.street,
            raw.address.numberStreet,
            raw.address.floor,
            raw.address.door,
            raw.address.postalCode,
            raw.address.city,
            raw.address.province,
            raw.address.municipality
        );

        return new Event(
            raw.id,
            raw.title,
            raw.startDateAndTime,
            raw.endDateAndTime,
            raw.description,
            raw.maxParticipants,
            address,
            raw.status as StatusEvent,
            raw.groupId
        );
    }

    parseDateForm(d: string) {
        let date = new Date(d);
        let day = date.getDate().toString().padStart(2, '0');;
        let month = (date.getMonth() + 1).toString().padStart(2, '0');;
        let year = date.getFullYear();
        let hour = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');;

        return `${year}-${month}-${day}T${hour}:${minutes}`
    }
    get startDateForm(): string {
        return this.parseDateForm(this.startDateAndTime);
    }
    get endDateForm(): string {
        return this.parseDateForm(this.endDateAndTime);
    }
}