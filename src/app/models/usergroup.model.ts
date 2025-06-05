export class UserGroup {
    id:string;
    userId:string;
    groupId:string;
    isAdmin:boolean;
    joinedAt: string;
    notificationsEnabled:boolean;
 
    
    constructor (id:string,userId:string,groupId:string,isAdmin:boolean,joinedAt:string,notificationsEnabled:boolean){
        this.id=id;
        this.userId = userId;
        this.groupId = groupId;
        this.isAdmin = isAdmin;
        this.joinedAt = joinedAt;
        this.notificationsEnabled = notificationsEnabled;
    }
}