export enum Visibility{
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}
export class Group {
    id:string;
    title:string;
    description:string;
    visibility: Visibility;
    icon:string;
 
    
    constructor (id:string,title:string,description:string,visibility:Visibility,icon:string){
        this.id=id;
        this.title = title;
        this.description = description;
        this.visibility = visibility;
        this.icon = icon;
    }
}