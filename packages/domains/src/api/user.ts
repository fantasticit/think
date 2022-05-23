import { IUser } from '../models';

export const UserApiDefinition = {
  /**
   * 获取用户
   */
  getAllUsers: {
    method: 'Get' as const,
    server: '/' as const,
    client: () => '/user',
  },

  /**
   * 注册
   */
  register: {
    method: 'Post' as const,
    server: 'register' as const,
    client: () => '/user/register',
  },

  /**
   * 登录
   */
  login: {
    method: 'Post' as const,
    server: 'login' as const,
    client: () => '/user/login',
  },

  /**
   * 登出
   */
  logout: {
    method: 'Post' as const,
    server: 'logout' as const,
    client: () => '/user/logout',
  },

  /**
   * 更新
   */
  update: {
    method: 'Patch' as const,
    server: 'update' as const,
    client: () => `/user/update`,
  },
};
