import { IUser } from './user';
import { IDocument } from './document';
/**
 * 知识库状态枚举
 */
export declare enum WikiStatus {
    private = "private",
    public = "public"
}
/**
 * 知识库成员状态枚举
 */
export declare enum WikiUserStatus {
    applying = "applying",
    inviting = "inviting",
    normal = "normal"
}
/**
 * 知识库成员角色枚举
 */
export declare enum WikiUserRole {
    normal = "normal",
    admin = "admin"
}
/**
 * 知识库数据定义
 */
export interface IWiki {
    id: string;
    name: string;
    avatar: string;
    description: string;
    createUserId: IUser['id'];
    createUser: IUser;
    status: WikiStatus;
    homeDocumentId: IDocument['id'];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * 知识库成员数据定义
 */
export interface IWikiUser extends IUser {
    userRole: WikiUserRole;
    userStatus: WikiUserStatus;
    isCreator: boolean;
}
