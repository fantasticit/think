import { IUser } from './user';
import { IDocument } from './document';
/**
 * 评论
 */
export interface IComment {
    id: string;
    parentCommentId?: IComment['id'];
    documentId: IDocument['id'];
    createUserId: IUser['id'];
    createUser: IUser;
    replyUserId?: IUser['id'];
    replyUser?: IUser;
    html: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
    children?: IComment[];
}
