import { IDocument, IWiki } from '@think/domains';
import { event } from 'helpers/event-emitter';

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
