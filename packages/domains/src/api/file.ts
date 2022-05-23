export const FileApiDefinition = {
  /**
   * 上传文件
   */
  upload: {
    method: 'post' as const,
    server: 'upload' as const,
    client: () => '/file/upload',
  },
};
