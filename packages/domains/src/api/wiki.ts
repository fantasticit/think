import { IWiki } from '../models';

export const WikiApiDefinition = {
  /**
   * 获取用户所有知识库（创建的、参与的）
   */
  getAllWikis: {
    method: 'get' as const,
    server: 'list/all/:organizationId' as const,
    client: (organizationId) => `/wiki/list/all/${organizationId}`,
  },

  /**
   * 获取用户创建的知识库
   */
  getOwnWikis: {
    method: 'get' as const,
    server: 'list/own/:organizationId' as const,
    client: (organizationId) => `/wiki/list/own/${organizationId}`,
  },

  /**
   * 获取用户参与的知识库
   */
  getJoinWikis: {
    method: 'get' as const,
    server: 'list/join/:organizationId' as const,
    client: (organizationId) => `/wiki/list/join/${organizationId}`,
  },

  /**
   * 新建知识库
   */
  add: {
    method: 'post' as const,
    server: 'add' as const,
    client: () => '/wiki/add',
  },

  /**
   * 获取知识库首页文档
   */
  getHomeDocumentById: {
    method: 'get' as const,
    server: 'homedoc/:id' as const,
    client: (id: IWiki['id']) => `/wiki/homedoc/${id}`,
  },

  /**
   * 获取知识库目录
   */
  getTocsById: {
    method: 'get' as const,
    server: 'tocs/:id' as const,
    client: (id: IWiki['id']) => `/wiki/tocs/${id}`,
  },

  /**
   * 更新知识库目录
   */
  updateTocsById: {
    method: 'patch' as const,
    server: 'tocs/:id/update' as const,
    client: (id: IWiki['id']) => `/wiki/tocs/${id}/update`,
  },

  /**
   * 获取知识库所有文档
   */
  getDocumentsById: {
    method: 'get' as const,
    server: 'documents/:id' as const,
    client: (id: IWiki['id']) => `/wiki/documents/${id}`,
  },

  /**
   * 获取知识库详情
   */
  getDetailById: {
    method: 'get' as const,
    server: 'detail/:id' as const,
    client: (id: IWiki['id']) => `/wiki/detail/${id}`,
  },

  /**
   * 更新知识库
   */
  updateById: {
    method: 'patch' as const,
    server: 'update/:id' as const,
    client: (id: IWiki['id']) => `/wiki/update/${id}`,
  },

  /**
   * 删除知识库
   */
  deleteById: {
    method: 'delete' as const,
    server: 'delet/:id' as const,
    client: (id: IWiki['id']) => `/wiki/delet/${id}`,
  },

  /**
   * 获取知识库成员
   */
  getMemberById: {
    method: 'get' as const,
    server: 'member/:id' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}`,
  },

  /**
   * 添加知识库成员
   */
  addMemberById: {
    method: 'post' as const,
    server: 'member/:id/add' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}/add`,
  },

  /**
   * 更新知识库成员
   */
  updateMemberById: {
    method: 'patch' as const,
    server: 'member/:id/update' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}/update`,
  },

  /**
   * 删除知识库成员
   */
  deleteMemberById: {
    method: 'delete' as const,
    server: 'member/:id/delete' as const,
    client: (id: IWiki['id']) => `/wiki/member/${id}/delete`,
  },

  /**
   * 分享知识库
   */
  shareById: {
    method: 'post' as const,
    server: 'share/:id' as const,
    client: (id: IWiki['id']) => `/wiki/share/${id}`,
  },

  /**
   * 获取公开知识库首页文档
   */
  getPublicHomeDocumentById: {
    method: 'get' as const,
    server: '/public/homedoc/:id' as const,
    client: (id: IWiki['id']) => `/wiki/public/homedoc/${id}`,
  },

  /**
   * 获取公开知识库目录
   */
  getPublicTocsById: {
    method: 'get' as const,
    server: '/public/tocs/:id' as const,
    client: (id: IWiki['id']) => `/wiki/public/tocs/${id}`,
  },

  /**
   * 获取知识库详情
   */
  getPublicDetailById: {
    method: 'get' as const,
    server: '/public/detail/:id' as const,
    client: (id: IWiki['id']) => `/wiki/public/detail/${id}`,
  },

  /**
   * 获取所有公开知识库
   */
  getPublicWikis: {
    method: 'get' as const,
    server: '/public/wikis' as const,
    client: () => `/wiki/public/wikis`,
  },
};
