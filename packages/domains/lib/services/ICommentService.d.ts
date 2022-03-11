import { IUser, IComment, IDocument, IPagination } from "../models";
export declare type ICreateCommentDto = {
    parentCommentId?: IComment["id"];
    documentId: IDocument["id"];
    html: string;
    replyUserId?: IUser["id"];
};
export declare type IUpdateCommentDto = {
    id: IComment["id"];
    html?: string;
};
export declare abstract class ICommentService {
    abstract createComment(data: ICreateCommentDto, user?: IUser, userAgent?: string): Promise<IComment>;
    abstract updateComment(data: IUpdateCommentDto, user?: IUser): Promise<IComment>;
    abstract deleteComment(id: IComment["id"], user?: IUser): Promise<void>;
    abstract getDocumentComments(documentId: IDocument["id"], pagination: IPagination): Promise<IComment[]>;
}
