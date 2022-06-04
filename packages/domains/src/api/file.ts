export const FileApiDefinition = {
  /**
   * 上传文件
   */
  upload: {
    method: 'post' as const,
    server: 'upload' as const,
    client: () => '/file/upload',
  },

  /**
   * 初始分块上传
   */
  initChunk: {
    method: 'post' as const,
    server: 'upload/initChunk' as const,
    client: () => '/file/upload/initChunk',
  },

  /**
   * 上传分块文件
   */
  uploadChunk: {
    method: 'post' as const,
    server: 'upload/chunk' as const,
    client: () => '/file/upload/chunk',
  },

  /**
   * 上传分块文件
   */
  mergeChunk: {
    method: 'post' as const,
    server: 'merge/chunk' as const,
    client: () => '/file/merge/chunk',
  },
};

export const FILE_CHUNK_SIZE = 2 * 1024 * 1024;
