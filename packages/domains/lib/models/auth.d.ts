import { IOrganization } from './organization';
export declare enum AuthEnum {
    creator = "creator",
    admin = "admin",
    member = "member",
    noAccess = "noAccess"
}
export declare const AuthEnumTextMap: {
    creator: string;
    admin: string;
    member: string;
    noAccess: string;
};
export declare const AuthEnumArray: {
    label: any;
    value: string;
}[];
export interface IAuth {
    id: string;
    type: AuthEnum;
    organizationId: IOrganization['id'];
    wikiId?: string;
    documentId?: string;
    createdAt: string;
    updatedAt: string;
}
