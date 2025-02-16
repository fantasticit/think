export const AdApiDefinition = {
  /**
   * 获取用户
   */
  getAll: {
    method: 'get' as const,
    server: '' as const,
    client: () => '/ad',
  },

  create: {
    method: 'post' as const,
    server: '' as const,
    client: () => '/ad',
  },

  /**
   * 获取组织内加星的知识库
   */
  deleteById: {
    method: 'delete' as const,
    server: ':id' as const,
    client: (id) => `/ad/${id}`,
  },
};
