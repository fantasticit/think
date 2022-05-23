import { IDocument } from '../models';

export const DocumentApiDefinition = {
  /**
   * 搜索文档
   */
  search: {
    method: 'Get' as const,
    server: 'search' as const,
    client: () => '/document/search',
  },

  /**
   * 获取用户最近访问的文档
   */
  recent: {
    method: 'Get' as const,
    server: 'recent' as const,
    client: () => '/document/recent',
  },

  /**
   * 新建文档
   */
  create: {
    method: 'Post' as const,
    server: 'create' as const,
    client: () => '/document/create',
  },

  /**
   * 获取文档详情
   */
  getDetailById: {
    method: 'Get' as const,
    server: 'detail/:id' as const,
    client: (id: IDocument['id']) => `/document/detail/${id}`,
  },

  /**
   * 更新文档
   */
  updateById: {
    method: 'Patch' as const,
    server: 'update/:id' as const,
    client: (id: IDocument['id']) => `/document/update/${id}`,
  },

  /**
   * 获取文档版本记录
   */
  getVersionById: {
    method: 'Get' as const,
    server: 'version/:id' as const,
    client: (id: IDocument['id']) => `/document/version/${id}`,
  },

  /**
   * 获取文档成员
   */
  getMemberById: {
    method: 'Get' as const,
    server: 'member/:id' as const,
    client: (id: IDocument['id']) => `/document/member/${id}`,
  },

  /**
   * 添加文档成员
   */
  addMemberById: {
    method: 'Post' as const,
    server: 'member/:id/add' as const,
    client: (id: IDocument['id']) => `/document/member/${id}/add`,
  },

  /**
   * 更新文档成员
   */
  updateMemberById: {
    method: 'Patch' as const,
    server: 'member/:id/update' as const,
    client: (id: IDocument['id']) => `/document/member/${id}/update`,
  },

  /**
   * 删除文档成员
   */
  deleteMemberById: {
    method: 'Post' as const,
    server: 'member/:id/delete' as const,
    client: (id: IDocument['id']) => `/document/member/${id}/delete`,
  },

  /**
   * 获取子文档
   */
  getChildren: {
    method: 'Get' as const,
    server: 'children' as const,
    client: () => `/document/children`,
  },

  /**
   * 删除文档
   */
  deleteById: {
    method: 'Delete' as const,
    server: 'delete/:id' as const,
    client: (id: IDocument['id']) => `/document/delete/${id}`,
  },

  /**
   * 分享文档
   */
  shareById: {
    method: 'Post' as const,
    server: 'share/:id' as const,
    client: (id: IDocument['id']) => `/document/share/${id}`,
  },

  /**
   * 获取公开文档详情
   */
  getPublicDetailById: {
    method: 'Get' as const,
    server: 'public/detail/:id' as const,
    client: (id: IDocument['id']) => `/document/public/detail/${id}`,
  },

  /**
   * 获取公开文档的子文档
   */
  getPublicChildren: {
    method: 'Get' as const,
    server: 'public/children' as const,
    client: () => `/document/public/children`,
  },
};
