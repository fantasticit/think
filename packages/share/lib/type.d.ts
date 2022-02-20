export interface Pagination {
    page: number;
    pageSize: number;
}
export interface IUser {
    id: string;
    name: string;
    password?: string;
    avatar?: string;
    email?: string;
    role: "normal" | "admin";
    status: "normal" | "locked";
    token?: string;
}
export interface IWiki {
    id: string;
    name: string;
    avatar: string;
    description: string;
    createUserId: string;
    createUser: IUser;
    status: "private" | "public";
    createdAt: string;
    updatedAt: string;
}
export interface IWikiUser extends IUser {
    userRole: "admin" | "noraml";
    userStatus: "normal";
    isCreator: boolean;
}
export interface IDocument {
    id: string;
    wikiId: string;
    isWikiHome: boolean;
    createUserId: string;
    createUser: IUser;
    parentDocumentId?: string;
    title: string;
    content: string;
    status: "private" | "public";
    views: number;
    sharePassword?: string;
    createdAt: string;
    updatedAt: string;
    children?: IDocument[];
}
export interface IAuthority {
    id: string;
    documentId: string;
    userId: string;
    readable: boolean;
    editable: boolean;
}
export interface IComment {
    id: string;
    parentCommentId?: string;
    documentId: string;
    createUserId: string;
    createUser: IUser;
    replyUserId?: string;
    replyUser?: IUser;
    html: string;
    userAgent: string;
    createdAt: string;
    updatedAt: string;
    children?: IComment[];
}
export interface IMessage {
    id: string;
    userId: string;
    title: string;
    message: string;
    url: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ITemplate {
    id: string;
    createUserId: string;
    createUser: IUser;
    title: string;
    content: string;
    state: string;
    usageAmount: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}
