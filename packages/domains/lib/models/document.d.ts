import { IUser } from "./user";
import { IWiki } from "./wiki";
export declare enum DocumentStatus {
    private = "private",
    public = "public"
}
export interface IDocument {
    id: string;
    wikiId: IWiki["id"];
    isWikiHome: boolean;
    createUserId: IUser["id"];
    createUser: IUser;
    parentDocumentId?: IDocument["id"];
    title: string;
    content: string;
    status: DocumentStatus;
    views: number;
    sharePassword?: string;
    createdAt: Date;
    updatedAt: Date;
    children?: IDocument[];
}
export interface IAuthority {
    id: string;
    documentId: IDocument["id"];
    userId: IUser["id"];
    readable: boolean;
    editable: boolean;
}
