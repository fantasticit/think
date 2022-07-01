import { IOrganization } from './organization';

export enum AuthEnum {
  creator = 'creator',
  admin = 'admin',
  member = 'member',
  noAccess = 'noAccess',
}

export const AuthEnumTextMap = {
  [AuthEnum.creator]: '超级管理员',
  [AuthEnum.admin]: '管理员',
  [AuthEnum.member]: '成员',
  [AuthEnum.noAccess]: '无权限',
};

export const AuthEnumArray = Object.keys(AuthEnumTextMap).map((value) => ({
  label: AuthEnumTextMap[value],
  value,
}));

export interface IAuth {
  id: string;
  type: AuthEnum;
  organizationId: IOrganization['id'];
  wikiId?: string;
  documentId?: string;
  createdAt: string;
  updatedAt: string;
}
