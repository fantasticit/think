import { IUser, IMessage, IPagination } from "../models";
export declare abstract class IMessageService {
    abstract getUnreadMessage(pagination: IPagination, user?: IUser): Promise<{
        data: IMessage[];
        total: number;
    }>;
    abstract getReadMessage(pagination: IPagination, user?: IUser): Promise<{
        data: IMessage[];
        total: number;
    }>;
    abstract getAllMessage(pagination: IPagination, user?: IUser): Promise<{
        data: IMessage[];
        total: number;
    }>;
    abstract readMessage(id: IMessage["id"], user?: IUser): Promise<void>;
}
