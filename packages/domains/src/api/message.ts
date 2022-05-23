import { IMessage } from '../models';

export const MessageApiDefinition = {
  /**
   * 获取未读消息
   */
  getUnread: {
    method: 'get' as const,
    server: 'unread' as const,
    client: () => '/message/unread',
  },

  /**
   * 获取已读消息
   */
  getRead: {
    method: 'get' as const,
    server: 'read' as const,
    client: () => '/message/read',
  },

  /**
   * 获取所有消息
   */
  getAll: {
    method: 'get' as const,
    server: 'all' as const,
    client: () => '/message/all',
  },

  /**
   * 将消息标记为已读
   */
  readMessage: {
    method: 'post' as const,
    server: 'read/:id' as const,
    client: (id: IMessage['id']) => `/message/read/${id}`,
  },
};
