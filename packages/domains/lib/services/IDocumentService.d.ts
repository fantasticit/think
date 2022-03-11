import { IUser, IWiki, ITemplate, IDocument, IAuthority } from "../models";
export declare type ICreateDocumentDto = {
    wikiId: IWiki["id"];
    parentDocumentId?: IDocument["id"] | null;
    title?: string;
    templateId?: ITemplate["id"];
};
export declare type IUpdateDocumentDto = {
    content: string;
    state: Uint8Array;
} & Pick<ICreateDocumentDto, "title">;
export declare type IShareDocumentDto = {
    sharePassword?: string;
};
export declare type IDocumentAuthorityDto = {
    documentId: IDocument["id"];
    userName: IUser["name"];
    readable: boolean;
    editable: boolean;
};
export declare abstract class IDocumentService {
    createLoading: boolean;
    createError: any;
    documentsDetail: Map<any, any>;
    getDocumentDetailLoading: boolean;
    getDocumentDetailError: any;
    updateDocumentLoading: boolean;
    updateDocumentError: any;
    deleteDocumentLoading: boolean;
    deleteDocumentError: any;
    documentsChildren: Map<any, any>;
    getDocumentChildrenLoading: boolean;
    getDocumentChildrenError: any;
    publicDocumentsChildren: Map<any, any>;
    getPublicDocumentChildrenLoading: boolean;
    getPublicDocumentChildrenError: any;
    shareLoading: boolean;
    shareError: any;
    documentsUsers: Map<any, any>;
    getDocumentUsersLoading: boolean;
    getDocumentUsersError: any;
    addDocumentUserLoading: boolean;
    addDocumentUserError: any;
    updateDocumentUserLoading: boolean;
    updateDocumentUserError: any;
    deleteDocumentUserLoading: boolean;
    deleteDocumentUserError: any;
    recentlyViewedDocuments: any[];
    getRecentlyViewedDocumentsLoading: boolean;
    getRecentlyViewedDocumentsError: any;
    publicDocumentsDetail: Map<any, any>;
    getPublicDocumentDetailLoading: boolean;
    getPublicDocumentDetailError: any;
    abstract createDocument(data: ICreateDocumentDto, user?: IUser): Promise<IDocument>;
    abstract getDocumentDetail(id: IDocument["id"], user: IUser): Promise<IDocument>;
    abstract updateDocument(id: IDocument["id"], data: IUpdateDocumentDto, user?: IUser): Promise<IDocument>;
    abstract deleteDocument(id: IDocument["id"], user?: IUser): Promise<void>;
    abstract getDocumentChidren(wikiId: IWiki["id"], documentId: IDocument["id"], user?: IUser): Promise<IDocument[]>;
    abstract shareDocument(id: IDocument["id"], data: IShareDocumentDto, user?: IUser): Promise<IDocument>;
    abstract getDocumentUsers(id: IDocument["id"], user?: IUser): Promise<Array<{
        user: IUser;
        authority: IAuthority;
    }>>;
    abstract addDocumentUser(data: IDocumentAuthorityDto, user?: IUser): Promise<IAuthority>;
    abstract updateDocumentUser(data: IDocumentAuthorityDto, user?: IUser): Promise<IAuthority>;
    abstract deleteDocumentUser(data: IDocumentAuthorityDto, user?: IUser): Promise<void>;
    abstract getRecentlyViewedDocuments(user?: IUser): Promise<IDocument[]>;
    abstract getPublicDocumentDetail(id: IDocument["id"], data?: IShareDocumentDto, userAgent?: string): any;
    abstract getPublicDocumentChildren(wikiId: IWiki["id"], documentId: IDocument["id"]): Promise<IDocument[]>;
}
