import { Person, ROLE } from "./person.model";

export class Member extends Person {
    dni:string;
    phone:string;
    birthdate: string;
    username:string;
    level:Number;
    provider:string;

    constructor (id:string,uid:string,name:string,surname:string,email:string,role:ROLE,photo:string,dni:string,phone:string,birthdate:string,username:string,level:Number,provider:string){
        
        super(id,uid,name,surname,email,role,photo);
        this.dni = dni;
        this.phone = phone;
        this.birthdate = birthdate;
        this.username = username;
        this.level = level;
        this.provider = provider;
    }

   
}