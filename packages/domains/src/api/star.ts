export const StarApiDefinition = {
  /**
   * 收藏（或取消收藏）
   */
  toggle: {
    method: 'post' as const,
    server: 'toggle' as const,
    client: () => '/star/toggle',
  },

  /**
   * 检测是否收藏
   */
  check: {
    method: 'post' as const,
    server: 'check' as const,
    client: () => '/star/check',
  },

  /**
   * 获取收藏的知识库
   */
  wikis: {
    method: 'get' as const,
    server: 'wikis' as const,
    client: () => '/star/wikis',
  },

  /**
   * 获取知识库内加星的文章
   */
  wikiDocuments: {
    method: 'get' as const,
    server: 'wiki/documents' as const,
    client: () => '/star/wiki/documents',
  },

  /**
   * 获取收藏的文档
   */
  documents: {
    method: 'get' as const,
    server: 'documents' as const,
    client: () => '/star/documents',
  },
};
