import { IUser } from "./user";
export declare enum WikiStatus {
    private = "private",
    public = "public"
}
export declare enum WikiUserStatus {
    applying = "applying",
    inviting = "inviting",
    normal = "normal"
}
export declare enum WikiUserRole {
    normal = "normal",
    admin = "admin"
}
export interface IWiki {
    id: string;
    name: string;
    avatar: string;
    description: string;
    createUserId: IUser["id"];
    createUser: IUser;
    status: WikiStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface IWikiUser extends IUser {
    userRole: WikiUserRole;
    userStatus: WikiUserStatus;
    isCreator: boolean;
}
