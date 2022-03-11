import { IUser } from "./user";
export interface IMessage {
    id: string;
    userId: IUser["id"];
    title: string;
    message: string;
    url: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
