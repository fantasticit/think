export const StarApiDefinition = {
  /**
   * 加星或取消
   */
  toggleStar: {
    method: 'post' as const,
    server: 'toggle' as const,
    client: () => '/star/toggle',
  },

  /**
   * 检测是否收藏
   */
  isStared: {
    method: 'post' as const,
    server: 'isStared' as const,
    client: () => '/star/isStared',
  },

  /**
   * 获取组织内加星的知识库
   */
  getStarWikisInOrganization: {
    method: 'get' as const,
    server: '/:organizationId/wikis' as const,
    client: (organizationId) => `/star/${organizationId}/wikis`,
  },

  /**
   * 获取知识库内加星的文章
   */
  getStarDocumentsInWiki: {
    method: 'get' as const,
    server: '/wiki/documents' as const,
    client: () => `/star/wiki/documents`,
  },

  /**
   * 获取组织内加星的文档
   */
  getStarDocumentsInOrganization: {
    method: 'get' as const,
    server: '/:organizationId/documents' as const,
    client: (organizationId) => `/star/${organizationId}/documents`,
  },
};
