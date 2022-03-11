import { WikiStatus, WikiUserRole, DocumentStatus, IWiki, IDocument } from "./models";
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
export declare const getWikiUserRoleText: (role: WikiUserRole) => string;
export declare const isPublicDocument: (currentStatus: IDocument["status"]) => boolean;
