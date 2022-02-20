import { IDocument, IWiki } from "./type";
export declare enum UserRole {
    normal = "normal",
    admin = "admin",
    superadmin = "superadmin"
}
export declare enum UserStatus {
    normal = "normal",
    locked = "locked"
}
export declare enum WikiStatus {
    private = "private",
    public = "public"
}
export declare enum WikiUserStatus {
    applying = "applying",
    inviting = "inviting",
    normal = "normal"
}
export declare enum WikiUserRole {
    normal = "normal",
    admin = "admin"
}
export declare enum DocumentStatus {
    private = "private",
    public = "public"
}
export declare enum CollectType {
    document = "document",
    wiki = "wiki"
}
export declare const WIKI_STATUS_LIST: {
    value: WikiStatus;
    label: string;
}[];
export declare const WIKI_USER_ROLES: {
    value: string;
    label: string;
}[];
export declare const DOCUMENT_STATUS: {
    value: DocumentStatus;
    label: string;
}[];
export declare const getWikiStatusText: (wiki: IWiki) => string;
export declare const isPublicWiki: (currentStatus: IWiki["status"]) => boolean;
export declare const renderWikiUserRole: (role: any) => string;
export declare const getWikiShareURL: (wikiId: any) => string;
export declare const getDocumentShareURL: (documentId: any) => string;
export declare const isPublicDocument: (currentStatus: IDocument["status"]) => boolean;
