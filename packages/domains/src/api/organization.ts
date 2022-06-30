import { IOrganization } from '../models';

export const OrganizationApiDefinition = {
  /**
   * 创建
   */
  createOrganization: {
    method: 'post' as const,
    server: '/create' as const,
    client: () => '/organization/create',
  },

  /**
   * 获取用户个人组织
   */
  getPersonalOrganization: {
    method: 'get' as const,
    server: '/personal' as const,
    client: () => '/organization/personal',
  },

  /**
   * 获取用户除个人组织外其他组织
   */
  getUserOrganizations: {
    method: 'get' as const,
    server: '/list/personal' as const,
    client: () => '/organization/list/personal',
  },

  /**
   * 获取组织详情
   */
  getOrganizationDetail: {
    method: 'get' as const,
    server: '/detail/:id' as const,
    client: (id: IOrganization['id']) => `/organization/detail/${id}`,
  },

  /**
   * 更新组织基本信息
   */
  updateOrganization: {
    method: 'post' as const,
    server: '/update/:id' as const,
    client: (id: IOrganization['id']) => `/organization/update/${id}`,
  },

  /**
   * 更新组织基本信息
   */
  deleteOrganization: {
    method: 'delete' as const,
    server: '/delete/:id' as const,
    client: (id: IOrganization['id']) => `/organization/delete/${id}`,
  },

  /**
   * 获取组织成员
   */
  getMembers: {
    method: 'get' as const,
    server: '/member/:id' as const,
    client: (id: IOrganization['id']) => `/organization/member/${id}`,
  },

  /**
   * 添加组织成员
   */
  addMemberById: {
    method: 'post' as const,
    server: 'member/:id/add' as const,
    client: (id: IOrganization['id']) => `/organization/member/${id}/add`,
  },

  /**
   * 更新组织成员
   */
  updateMemberById: {
    method: 'patch' as const,
    server: 'member/:id/update' as const,
    client: (id: IOrganization['id']) => `/organization/member/${id}/update`,
  },

  /**
   * 删除组织成员
   */
  deleteMemberById: {
    method: 'delete' as const,
    server: 'member/:id/delete' as const,
    client: (id: IOrganization['id']) => `/organization/member/${id}/delete`,
  },
};
