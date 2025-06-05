export class Address {
    id:string;
    street:string;
    numberStreet:string;
    floor:string;
    door: string;
    postalCode:string;
    city:string;
    province:string;
    municipality: string;
    
constructor(id:string, street: string, numberStreet: string, floor: string, door: string, postalCode: string, city: string, province: string, municipality: string ) {
    this.id = id;
    this.street = street;
    this.numberStreet = numberStreet;
    this.floor = floor;
    this.door = door;
    this.postalCode = postalCode;
    this.city = city;
    this.province = province;
    this.municipality = municipality;
  }
}