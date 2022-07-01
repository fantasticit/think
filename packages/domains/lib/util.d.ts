import { WikiStatus, DocumentStatus, IWiki, IDocument } from './models';
/**
 * 知识库状态列表数据
 */
export declare const WIKI_STATUS_LIST: {
    value: WikiStatus;
    label: string;
}[];
/**
 * 知识库成员角色列表数据
 */
export declare const WIKI_USER_ROLES: {
    value: string;
    label: string;
}[];
/**
 * 文档状态列表数据
 */
export declare const DOCUMENT_STATUS: {
    value: DocumentStatus;
    label: string;
}[];
/**
 * 获取知识库状态对应文本
 * @param wiki 实例数据
 * @returns
 */
export declare const getWikiStatusText: (wiki: IWiki) => string;
/**
 * 检查知识库是否公开
 * @param currentStatus wiki 实例数据的 status 字段
 * @returns
 */
export declare const isPublicWiki: (currentStatus: IWiki['status']) => boolean;
/**
 * 检查文档是否公开
 * @param currentStatus document 实例数据的 status 字段
 * @returns
 */
export declare const isPublicDocument: (currentStatus: IDocument['status']) => boolean;
