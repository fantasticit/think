import { ILoginUser, IUser } from '@think/domains';
import React from 'react';

export interface ICollaborationEditorProps {
  /**
   * 文档 id
   */
  id: string;

  /**
   *  类型
   */
  type: 'document' | 'template';

  /**
   * 是否可编辑
   */
  editable: boolean;

  /**
   * 是否需要菜单
   */
  menubar?: boolean;

  /**
   * 当前用户
   * 为 null 时会查看对应文档是否为公开状态，否则鉴权失败
   */
  user: ILoginUser | null;

  /**
   * 是否需要评论
   */
  hideComment?: boolean;

  /**
   * 文档标题变动
   */
  onTitleUpdate?: (arg: string) => void;

  /**
   * 协作用户变动
   */
  onAwarenessUpdate?: (users: { clientId: number; user: IUser }[]) => void;

  /**
   * 渲染在编辑器区域的节点
   * @element 编辑器渲染父节点
   */
  renderInEditorPortal?: (element: HTMLElement) => React.ReactNode;

  /**
   * 子节点，在编辑器渲染后才会加载
   */
  renderOnMount?: React.ReactNode;
}

export type ProviderStatus = 'connecting' | 'connected' | 'disconnected' | 'loadCacheSuccess';
