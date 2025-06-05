export class Group {
    id:string;
    title:string;
    description:string;
    visibility: string;
    icon:string;
 
    
    constructor (id:string,title:string,description:string,visibility:string,icon:string){
        this.id=id;
        this.title = title;
        this.description = description;
        this.visibility = visibility;
        this.icon = icon;
    }
}