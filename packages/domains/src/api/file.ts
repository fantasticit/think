export const FileApiDefinition = {
  /**
   * 上传文件
   */
  upload: {
    method: 'Post' as const,
    server: 'upload' as const,
    client: () => '/file/upload',
  },
};
