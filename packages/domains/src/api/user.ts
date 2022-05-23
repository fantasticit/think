import { IUser } from '../models';

export const UserApiDefinition = {
  /**
   * 获取用户
   */
  getAllUsers: {
    method: 'get' as const,
    server: '/' as const,
    client: () => '/user',
  },

  /**
   * 注册
   */
  register: {
    method: 'post' as const,
    server: 'register' as const,
    client: () => '/user/register',
  },

  /**
   * 登录
   */
  login: {
    method: 'post' as const,
    server: 'login' as const,
    client: () => '/user/login',
  },

  /**
   * 登出
   */
  logout: {
    method: 'post' as const,
    server: 'logout' as const,
    client: () => '/user/logout',
  },

  /**
   * 更新
   */
  update: {
    method: 'patch' as const,
    server: 'update' as const,
    client: () => `/user/update`,
  },
};
