import { ITemplate } from '../models';

export const TemplateApiDefinition = {
  /**
   * 获取公开模板
   */
  public: {
    method: 'Get' as const,
    server: 'public' as const,
    client: () => '/template/public',
  },

  /**
   * 获取个人创建模板
   */
  own: {
    method: 'Get' as const,
    server: 'own' as const,
    client: () => '/template/own',
  },

  /**
   * 新建模板
   */
  add: {
    method: 'Post' as const,
    server: 'add' as const,
    client: () => '/template/add',
  },

  /**
   * 更新模板
   */
  updateById: {
    method: 'Patch' as const,
    server: 'update/:id' as const,
    client: (id: ITemplate['id']) => `/template/update/${id}`,
  },

  /**
   * 获取模板详情
   */
  getDetailById: {
    method: 'Get' as const,
    server: 'detail/:id' as const,
    client: (id: ITemplate['id']) => `/template/detail/${id}`,
  },

  /**
   * 删除模板
   */
  deleteById: {
    method: 'Delete' as const,
    server: 'delete/:id' as const,
    client: (id: ITemplate['id']) => `/template/delete/${id}`,
  },
};
