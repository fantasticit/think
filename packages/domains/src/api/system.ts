export const SystemApiDefinition = {
  getPublicConfig: {
    method: 'get' as const,
    server: '/' as const,
    client: () => '/system',
  },
};
