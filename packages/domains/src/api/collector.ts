import { IDocument, IWiki, CollectType } from '../models';

export const CollectorApiDefinition = {
  /**
   * 收藏（或取消收藏）
   */
  toggle: {
    method: 'post' as const,
    server: 'toggle' as const,
    client: () => '/collector/toggle',
  },

  /**
   * 检测是否收藏
   */
  check: {
    method: 'post' as const,
    server: 'check' as const,
    client: () => '/collector/check',
  },

  /**
   * 获取收藏的知识库
   */
  wikis: {
    method: 'get' as const,
    server: 'wikis' as const,
    client: () => '/collector/wikis',
  },

  /**
   * 获取收藏的文档
   */
  documents: {
    method: 'get' as const,
    server: 'documents' as const,
    client: () => '/collector/documents',
  },
};
