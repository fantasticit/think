import { IUser } from "./user";
export interface ITemplate {
    id: string;
    createUserId: IUser["id"];
    createUser: IUser;
    title: string;
    content: string;
    state: string;
    usageAmount: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
