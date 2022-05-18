import { IUser } from './user';
/**
 * 文档模板数据定义
 */
export interface ITemplate {
    id: string;
    createUserId: IUser['id'];
    createUser: IUser;
    title: string;
    content: string;
    state: string;
    usageAmount: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
