import { IAuth, IUser, OrganizationApiDefinition } from '@think/domains';
import Router from 'next/router';

import { HttpClient } from './http-client';

export const register = (data: Partial<IUser>): Promise<IUser> => {
  return HttpClient.post('/user/register', data);
};

export const getUsers = (): Promise<IUser[]> => {
  return HttpClient.get('/user');
};

export const getMentionUser = (): Promise<{ data: Array<{ auth: IAuth; user: IUser }>; total: number }> => {
  const { organizationId } = Router.query;
  return HttpClient.request({
    method: OrganizationApiDefinition.getMembers.method,
    url: OrganizationApiDefinition.getMembers.client(organizationId as string),
    params: {
      pageSize: 10000,
    },
  });
};
