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
   * 获取验证码
   */
  sendVerifyCode: {
    method: 'get' as const,
    server: 'sendVerifyCode' as const,
    client: () => '/verify/sendVerifyCode',
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
   * 重置密码
   */
  resetPassword: {
    method: 'post' as const,
    server: 'resetPassword' as const,
    client: () => '/user/resetPassword',
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

  /**
   * 锁定用户
   */
  toggleLockUser: {
    method: 'post' as const,
    server: 'lock/user' as const,
    client: () => `/user/lock/user`,
  },

  /**
   * 获取系统配置
   */
  getSystemConfig: {
    method: 'get' as const,
    server: 'config/system' as const,
    client: () => `/user/config/system`,
  },

  /**
   * 发送测试邮件
   */
  sendTestEmail: {
    method: 'get' as const,
    server: 'config/system/sendTestEmail' as const,
    client: () => `/user/config/system/sendTestEmail`,
  },

  /**
   * 发送测试邮件
   */
  updateSystemConfig: {
    method: 'post' as const,
    server: 'config/system/updateSystemConfig' as const,
    client: () => `/user/config/system/updateSystemConfig`,
  },
};
