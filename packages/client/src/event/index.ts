import { IDocument, IUser, IWiki } from '@think/domains';
import { EventEmitter } from 'helpers/event-emitter';

export const event = new EventEmitter();

export const REFRESH_TOCS = `REFRESH_TOCS`; // 刷新知识库目录
export const CREATE_DOCUMENT = `CREATE_DOCUMENT`;
/**
 * 刷新知识库目录
 */
export const triggerRefreshTocs = () => {
  event.emit(REFRESH_TOCS);
};
/**
 * 新建文档
 * @param data
 */
export const triggerCreateDocument = (data: { wikiId: IWiki['id']; documentId: IDocument['id'] | null }) => {
  event.emit(CREATE_DOCUMENT, data);
};

export const CHANGE_DOCUMENT_TITLE = `CHANGE_DOCUMENT_TITLE`;
/**
 * 改变文档标题
 * @param title
 */
export const triggerChangeDocumentTitle = (title: string) => {
  event.emit(CHANGE_DOCUMENT_TITLE, title);
};

export const USE_DOCUMENT_VERSION = `USE_DOCUMENT_VERSION`;
/**
 * 使用文档版本
 * @param data
 */
export const triggerUseDocumentVersion = (data: Record<string, unknown>) => {
  event.emit(USE_DOCUMENT_VERSION, data);
};

export const JOIN_USER = `JOIN_USER`;
type CollaborationUser = {
  clientId: number;
  user: IUser;
};
/**
 * 文档协作：加入用户
 * @param users
 */
export const triggerJoinUser = (users: Array<CollaborationUser>) => {
  event.emit(JOIN_USER, users);
};
