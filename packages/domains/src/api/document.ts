import { IDocument } from '../models';

export const DocumentApiDefinition = {
  /**
   * 搜索文档
   */
  search: {
    method: 'get' as const,
    server: '/:organizationId/search' as const,
    client: (organizationId) => `/document/${organizationId}/search`,
  },

  /**
   * 获取用户最近访问的文档
   */
  recent: {
    method: 'get' as const,
    server: '/:organizationId/recent' as const,
    client: (organizationId) => `/document/${organizationId}/recent`,
  },

  /**
   * 新建文档
   */
  create: {
    method: 'post' as const,
    server: 'create' as const,
    client: () => '/document/create',
  },

  /**
   * 获取文档详情
   */
  getDetailById: {
    method: 'get' as const,
    server: 'detail/:id' as const,
    client: (id: IDocument['id']) => `/document/detail/${id}`,
  },

  /**
   * 导出文档
   */
  exportDocx: {
    method: 'post' as const,
    server: '/export/docx' as const,
    client: () => '/document/export/docx',
  },

  /**
   * 更新文档
   */
  updateById: {
    method: 'patch' as const,
    server: 'update/:id' as const,
    client: (id: IDocument['id']) => `/document/update/${id}`,
  },

  /**
   * 获取文档版本记录
   */
  getVersionById: {
    method: 'get' as const,
    server: 'version/:id' as const,
    client: (id: IDocument['id']) => `/document/version/${id}`,
  },

  /**
   * 获取文档成员
   */
  getMemberById: {
    method: 'get' as const,
    server: 'member/:id' as const,
    client: (id: IDocument['id']) => `/document/member/${id}`,
  },

  /**
   * 添加文档成员
   */
  addMemberById: {
    method: 'post' as const,
    server: 'member/:id/add' as const,
    client: (id: IDocument['id']) => `/document/member/${id}/add`,
  },

  /**
   * 更新文档成员
   */
  updateMemberById: {
    method: 'patch' as const,
    server: 'member/:id/update' as const,
    client: (id: IDocument['id']) => `/document/member/${id}/update`,
  },

  /**
   * 删除文档成员
   */
  deleteMemberById: {
    method: 'post' as const,
    server: 'member/:id/delete' as const,
    client: (id: IDocument['id']) => `/document/member/${id}/delete`,
  },

  /**
   * 获取子文档
   */
  getChildren: {
    method: 'post' as const,
    server: 'children' as const,
    client: () => `/document/children`,
  },

  /**
   * 删除文档
   */
  deleteById: {
    method: 'delete' as const,
    server: 'delete/:id' as const,
    client: (id: IDocument['id']) => `/document/delete/${id}`,
  },

  /**
   * 分享文档
   */
  shareById: {
    method: 'post' as const,
    server: 'share/:id' as const,
    client: (id: IDocument['id']) => `/document/share/${id}`,
  },

  /**
   * 获取公开文档详情
   */
  getPublicDetailById: {
    method: 'post' as const,
    server: 'public/detail/:id' as const,
    client: (id: IDocument['id']) => `/document/public/detail/${id}`,
  },

  /**
   * 获取公开文档的子文档
   */
  getPublicChildren: {
    method: 'post' as const,
    server: 'public/children' as const,
    client: () => `/document/public/children`,
  },
};
