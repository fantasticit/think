import { IUser } from './user';
import { IOrganization } from './organization';
import { IWiki } from './wiki';
import { IDocument } from './document';
/**
 * 消息数据定义
 */
export interface IMessage {
    id: string;
    userId: IUser['id'];
    title: string;
    message: string;
    url: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare type MessageType = 'toOrganization' | 'toWiki' | 'toDocument';
export declare const buildMessageURL: (type: MessageType) => (arg: {
    organizationId: IOrganization['id'];
    wikiId?: IWiki['id'];
    documentId?: IDocument['id'];
}) => string;
export {};
