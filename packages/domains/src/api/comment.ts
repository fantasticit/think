import { IComment, IDocument } from '../models';

export const CommentApiDefinition = {
  /**
   * 新建评论
   */
  add: {
    method: 'post' as const,
    server: 'add' as const,
    client: () => '/comment/add',
  },

  /**
   * 更新评论
   */
  update: {
    method: 'patch' as const,
    server: 'update' as const,
    client: () => '/comment/update',
  },

  /**
   * 删除评论
   */
  delete: {
    method: 'delete' as const,
    server: 'delete/:id' as const,
    client: (id: IComment['id']) => `/comment/delete/${id}`,
  },

  /**
   * 获取指定文档评论
   */
  documents: {
    method: 'get' as const,
    server: 'document/:documentId' as const,
    client: (documentId: IDocument['id']) => `/comment/document/${documentId}`,
  },
};
