import { WikiStatus, DocumentStatus, IWiki, IDocument } from './models';

/**
 * 知识库状态列表数据
 */
export const WIKI_STATUS_LIST = [
  {
    value: WikiStatus.private,
    label: '私有',
  },
  {
    value: WikiStatus.public,
    label: '公开',
  },
];

/**
 * 知识库成员角色列表数据
 */
export const WIKI_USER_ROLES = [
  {
    value: 'admin',
    label: '管理员',
  },
  {
    value: 'normal',
    label: '成员',
  },
];

/**
 * 文档状态列表数据
 */
export const DOCUMENT_STATUS = [
  {
    value: DocumentStatus.private,
    label: '私有',
  },
  {
    value: DocumentStatus.public,
    label: '公开',
  },
];

/**
 * 获取知识库状态对应文本
 * @param wiki 实例数据
 * @returns
 */
export const getWikiStatusText = (wiki: IWiki): string => {
  return WIKI_STATUS_LIST.find((t) => t.value === wiki.status)!.label;
};

/**
 * 检查知识库是否公开
 * @param currentStatus wiki 实例数据的 status 字段
 * @returns
 */
export const isPublicWiki = (currentStatus: IWiki['status']) => currentStatus === WikiStatus.public;

/**
 * 检查文档是否公开
 * @param currentStatus document 实例数据的 status 字段
 * @returns
 */
export const isPublicDocument = (currentStatus: IDocument['status']) => currentStatus === DocumentStatus.public;
