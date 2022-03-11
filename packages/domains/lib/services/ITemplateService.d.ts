import { IUser, ITemplate, IPagination } from "../models";
export declare type ICreateTemplateDto = {
    title: string;
    content?: string;
    state?: Uint8Array;
    isPublic?: boolean;
};
export declare abstract class ITemplateService {
    abstract createTemplate(data: ICreateTemplateDto, user?: IUser): Promise<ITemplate>;
    abstract updateTemplate(id: ITemplate["id"], data: ICreateTemplateDto): Promise<ITemplate>;
    abstract deleteTemplate(id: ITemplate["id"], data: ICreateTemplateDto): Promise<void>;
    abstract getTemplateDetail(id: ITemplate["id"]): Promise<ITemplate>;
    abstract getPrivateTemplates(pagination: IPagination, user?: IUser): Promise<{
        data: ITemplate[];
        total: number;
    }>;
    abstract getPublicTemplates(pagination: IPagination): Promise<{
        data: ITemplate[];
        total: number;
    }>;
}
