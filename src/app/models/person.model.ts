export enum ROLE{
    MEMBER="MEMBER",
    ADMIN="ADMIN"
}
export class Person {
    id:string;
    userAccountId:string;
    name:string;
    surname: string;
    email:string;
    role:ROLE;
    photo:string;
    
    constructor (id:string,userAccountId:string,name:string,surname:string,email:string,role:ROLE,photo:string){
        this.id=id;
        this.userAccountId = userAccountId;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
        this.photo = photo;
    }
}