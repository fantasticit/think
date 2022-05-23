import { IWiki } from '../models';

export const WikiApiDefinition = {
  /**
   * 获取用户所有知识库（创建的、参与的）
   */
  getAllWikis: {
    method: 'Get' as const,
    server: 'list/all' as const,
    client: () => '/wiki/list/all',
  },

  /**
   * 获取用户创建的知识库
   */
  getOwnWikis: {
    method: 'Get' as const,
    server: 'list/own' as const,
    client: () => '/wiki/list/own',
  },

  /**
   * 获取用户参与的知识库
   */
  getJoinWikis: {
    method: 'Get' as const,
    server: 'list/join' as const,
    client: () => '/wiki/list/join',
  },

  /**
   * 新建知识库
   */
  add: {
    method: 'Post' as const,
    server: 'add' as const,
    client: () => '/wiki/add',
  },

  /**
   * 获取知识库首页文档
   */
  getHomeDocumentById: {
    method: 'Get' as const,
    server: 'homedoc/:id' as const,
    client: (id: IWiki['id']) => `/wiki/homedoc/${id}`,
  },

  /**
   * 获取知识库目录
   */
  getTocsById: {
    method: 'Get' as const,
    server: 'tocs/:id' as const,
    client: (id: IWiki['id']) => `/wiki/tocs/${id}`,
  },

  /**
   * 更新知识库目录
   */
  updateTocsById: {
    method: 'Patch' as const,
    server: 'tocs/:id/update' as const,
    client: (id: IWiki['id']) => `/wiki/tocs/${id}/update`,
  },

  /**
   * 获取知识库所有文档
   */
  getDocumentsById: {
    method: 'Get' as const,
    server: 'documents/:id' as const,
    client: (id: IWiki['id']) => `/wiki/documents/${id}`,
  },

  /**
   * 获取知识库详情
   */
  getDetailById: {
    method: 'Get' as const,
    server: 'detail/:id' as const,
    client: (id: IWiki['id']) => `/wiki/detail/${id}`,
  },

  /**
   * 更新知识库
   */
  updateById: {
    method: 'Patch' as const,
    server: 'update/:id' as const,
    client: (id: IWiki['id']) => `/wiki/update/${id}`,
  },

  /**
   * 删除知识库
   */
  deleteById: {
    method: 'Delete' as const,
    server: 'delet/:id' as const,
    client: (id: IWiki['id']) => `/wiki/delet/${id}`,
  },

  /**
   * 获取知识库成员
   */
  getMemberById: {
    method: 'Get' as const,
    server: 'member/:id' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}`,
  },

  /**
   * 添加知识库成员
   */
  addMemberById: {
    method: 'Post' as const,
    server: 'member/:id/add' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}/add`,
  },

  /**
   * 更新知识库成员
   */
  updateMemberById: {
    method: 'Patch' as const,
    server: 'member/:id/update' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}/update`,
  },

  /**
   * 删除知识库成员
   */
  deleteMemberById: {
    method: 'Delete' as const,
    server: 'member/:id/delete' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}/delete`,
  },

  /**
   * 分享知识库
   */
  shareById: {
    method: 'Post' as const,
    server: 'share/:id' as const,
    client: (id: IWiki['id']) => `/wiki/share/${id}`,
  },

  /**
   * 获取公开知识库首页文档
   */
  getPublicHomeDocumentById: {
    method: 'Get' as const,
    server: '/public/homedoc/:id' as const,
    client: (id: IWiki['id']) => `/wiki/public/homedoc/${id}`,
  },

  /**
   * 获取公开知识库目录
   */
  getPublicTocsById: {
    method: 'Get' as const,
    server: '/public/tocs/:id' as const,
    client: (id: IWiki['id']) => `/wiki/public/tocs/${id}`,
  },

  /**
   * 获取知识库详情
   */
  getPublicDetailById: {
    method: 'Get' as const,
    server: '/public/detail/:id' as const,
    client: (id: IWiki['id']) => `/wiki/public/detail/${id}`,
  },

  /**
   * 获取所有公开知识库
   */
  getPublicWikis: {
    method: 'Get' as const,
    server: '/public/wikis' as const,
    client: (id: IWiki['id']) => `/wiki/public/wikis`,
  },
};
