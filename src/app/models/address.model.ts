export class Address {
    street:string;
    numberStreet:string;
    floor:string;
    door: string;
    postalCode:string;
    city:string;
    province:string;
    municipality: string;
    
constructor(street: string, numberStreet: string, floor: string, door: string, postalCode: string, city: string, province: string, municipality: string ) {
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