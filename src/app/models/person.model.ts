export enum ROLE{
    USER="USER",
    ADMIN="ADMIN"
}
export class Person {
    uid:string;
    name:string;
    surname: string;
    email:string;
    role:ROLE;
    photo:string;
    
    constructor (uid:string,name:string,surname:string,email:string,role:ROLE,photo:string){
        this.uid = uid;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
        this.photo = photo;
    }
}