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
   * 合并分块文件
   */
  mergeChunk: {
    method: 'post' as const,
    server: 'merge/chunk' as const,
    client: () => '/file/merge/chunk',
  },

  /**
   * OSS 签名
   */
  ossSign: {
    method: 'post' as const,
    server: 'oss/sign' as const,
    client: () => '/file/oss/sign',
  },

  /**
   * OSS 分块上传
   */
  ossChunk: {
    method: 'post' as const,
    server: 'oss/chunk' as const,
    client: () => '/file/oss/chunk',
  },

  /**
   * OSS 合并分块
   */
  ossMerge: {
    method: 'post' as const,
    server: 'oss/merge' as const,
    client: () => '/file/oss/merge',
  },
};

export const FILE_CHUNK_SIZE = 2 * 1024 * 1024;
